import { readFile } from "node:fs/promises";
import path from "node:path";
import { downloadBuildMetadata } from "./artifact.js";
import { normalizeChanges } from "./changes.js";
import { config } from "./config.js";
import { GENERATOR_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from "./constants.js";
import { assertDescendant, changedFiles, commitsBetween, maintenanceHotspots, resolveCommit } from "./git.js";
import { GitHubClient } from "./github.js";
import { OpenRouterSummarizer } from "./openrouter.js";
import { buildCategories, readExistingReport, updateLatest, writeReport } from "./render.js";
import { loadState, saveState } from "./state.js";
import type {
  BuildIdentity,
  BuildReport,
  GeneratorState,
  NormalizedChange,
  Provenance,
  ReportItem,
  StoredBuild,
  WorkflowRunInfo
} from "./types.js";

function normalizedBuildDate(plistDate: string | null, fallback: string): string {
  if (plistDate) {
    const parsed = new Date(plistDate);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toISOString();
    }
  }
  return fallback;
}

async function identifyBuild(github: GitHubClient, run: WorkflowRunInfo): Promise<BuildIdentity> {
  await github.assertSuccessfulBuild(run);
  const artifactUrl = await github.getArtifactDownloadUrl(run.id);
  const metadata = await downloadBuildMetadata(artifactUrl, config.githubToken);
  return {
    run,
    abbreviatedSha: metadata.abbreviatedSha,
    fullSha: await resolveCommit(metadata.abbreviatedSha),
    buildDate: normalizedBuildDate(metadata.buildDate, run.updatedAt)
  };
}

async function findPreviousBuild(
  github: GitHubClient,
  state: GeneratorState,
  current: WorkflowRunInfo
): Promise<StoredBuild> {
  const previousRun = await github.findPreviousSuccessfulRun(current);
  if (!previousRun) {
    throw new Error(`No previous successful build exists for branch ${current.headBranch}`);
  }
  const stored = state.successfulBuilds.find((build) => build.runId === previousRun.id);
  if (stored) {
    return stored;
  }
  const previous = await identifyBuild(github, previousRun);
  return {
    runId: previous.run.id,
    branch: previous.run.headBranch,
    fullSha: previous.fullSha,
    shortSha: previous.abbreviatedSha,
    builtAt: previous.run.createdAt,
    reportPath: null
  };
}

function combinedProvenance(changes: NormalizedChange[]): Provenance {
  const values = new Set(changes.map((change) => change.provenance));
  if (values.size === 1) {
    return changes[0]?.provenance ?? "internal";
  }
  return "mixed";
}

function reportItems(
  aggregated: Awaited<ReturnType<OpenRouterSummarizer["aggregate"]>>,
  changes: NormalizedChange[]
): ReportItem[] {
  const changeById = new Map(changes.map((change) => [change.id, change]));
  const sourceById = new Map(changes.flatMap((change) => change.sources).map((source) => [source.id, source]));
  return aggregated.map((item) => {
    const itemChanges = item.changeIds.map((changeId) => changeById.get(changeId)).filter((change) => change !== undefined);
    return {
      ...item,
      provenance: combinedProvenance(itemChanges),
      sources: item.sourceIds.map((sourceId) => {
        const source = sourceById.get(sourceId);
        if (!source) {
          throw new Error(`Missing validated report source ${sourceId}`);
        }
        return { id: source.id, type: source.type, title: source.title, url: source.url };
      })
    };
  });
}

async function latestPublishedDate(): Promise<string | null> {
  try {
    const latest = JSON.parse(await readFile(path.join(config.publicDir, "latest.json"), "utf8")) as BuildReport;
    return latest.metadata.buildDate;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function generateForRun(runId: number): Promise<void> {
  const github = new GitHubClient();
  const state = await loadState();
  if (state.processedRuns[String(runId)]) {
    console.log(`Workflow run ${runId} is already processed`);
    return;
  }

  const run = await github.getRun(runId);
  const current = await identifyBuild(github, run);
  const previous = await findPreviousBuild(github, state, run);
  await assertDescendant(previous.fullSha, current.fullSha);

  const existingReport = await readExistingReport(current.abbreviatedSha);
  let reportPath: string;
  if (existingReport) {
    if (existingReport.metadata.currentBuiltSha !== current.fullSha) {
      throw new Error(`Short SHA collision for ${current.abbreviatedSha}`);
    }
    reportPath = `public/builds/${current.abbreviatedSha}.json`;
  } else {
    const commits = await commitsBetween(previous.fullSha, current.fullSha);
    const files = await changedFiles(previous.fullSha, current.fullSha);
    const hotspots = maintenanceHotspots(commits);
    const changes = await normalizeChanges(
      commits,
      hotspots,
      files.map((file) => file.path),
      github
    );
    const summarizer = new OpenRouterSummarizer();
    const summaries = [];
    for (const change of changes) {
      summaries.push(await summarizer.summarizeChange(change));
    }
    const items = reportItems(await summarizer.aggregate(changes, summaries), changes);
    const pulls = changes
      .flatMap((change) => change.pullRequests)
      .filter(
        (pull, index, all) =>
          all.findIndex((candidate) => candidate.repository === pull.repository && candidate.number === pull.number) === index
      );
    const report: BuildReport = {
      schemaVersion: SCHEMA_VERSION,
      metadata: {
        sourceWorkflowRunId: run.id,
        sourceWorkflowRunUrl: run.url,
        sourceBranch: run.headBranch,
        previousBuiltSha: previous.fullSha,
        currentBuiltSha: current.fullSha,
        shortSha: current.abbreviatedSha,
        buildDate: current.buildDate,
        generationDate: new Date().toISOString(),
        generatorVersion: GENERATOR_VERSION,
        promptVersion: PROMPT_VERSION,
        model: summarizer.model
      },
      highlights: items.filter((item) => item.highlight),
      categories: buildCategories(items),
      maintenanceHotspots: hotspots,
      includedPullRequests: pulls,
      includedCommits: commits.map(({ sha, subject, author, authoredAt }) => ({ sha, subject, author, authoredAt })),
      includedFiles: files
    };
    reportPath = await writeReport(report);
    const existingLatestDate = await latestPublishedDate();
    if (!existingLatestDate || new Date(report.metadata.buildDate) >= new Date(existingLatestDate)) {
      await updateLatest(report);
    }
    console.log(`Generated ${reportPath} from ${files.length} changed files and ${commits.length} commits`);
  }

  const currentRecord: StoredBuild = {
    runId: run.id,
    branch: run.headBranch,
    fullSha: current.fullSha,
    shortSha: current.abbreviatedSha,
    builtAt: run.createdAt,
    reportPath
  };
  for (const build of [previous, currentRecord]) {
    const existingIndex = state.successfulBuilds.findIndex((candidate) => candidate.runId === build.runId);
    if (existingIndex >= 0) {
      state.successfulBuilds[existingIndex] = build;
    } else {
      state.successfulBuilds.push(build);
    }
  }
  state.successfulBuilds.sort((left, right) => left.builtAt.localeCompare(right.builtAt));
  state.processedRuns[String(run.id)] = {
    fullSha: current.fullSha,
    reportPath,
    processedAt: new Date().toISOString()
  };
  state.promptVersion = PROMPT_VERSION;
  state.schemaVersion = SCHEMA_VERSION;
  await saveState(state);
}

export async function processRunsSince(cutoff: Date): Promise<void> {
  const github = new GitHubClient();
  const runs = (await github.listRunsSince(cutoff)).sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  let eligible = 0;
  for (const run of runs) {
    if (!(await github.isSuccessfulBuild(run))) {
      continue;
    }
    eligible += 1;
    await generateForRun(run.id);
  }
  console.log(`Checked ${runs.length} completed workflow runs and found ${eligible} successful builds`);
}
