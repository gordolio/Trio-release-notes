import { createHash } from "node:crypto";
import { config } from "./config.js";
import { patchForCommits } from "./git.js";
import type { GitHubClient } from "./github.js";
import type {
  CommitRecord,
  NormalizedChange,
  Provenance,
  PullRequestRecord,
  SourceEvidence
} from "./types.js";

const INTERNAL_PATH_PREFIXES = [
  ".github/",
  "fastlane/",
  "scripts/",
  "docs/",
  "README",
  "Gemfile",
  "Package.resolved"
];
const MAX_FILE_SOURCES = 200;
const MAX_COMMIT_SOURCES = 200;

// Automated CI housekeeping commits that never belong in user-facing release notes.
const SKIPPED_COMMIT_SUBJECTS = /^CI: Bump APP_DEV_VERSION\b/;

function compactSourceId(type: string, value: string): string {
  return `${type}:${createHash("sha256").update(value).digest("hex").slice(0, 12)}`;
}

function boundedSample<T>(values: T[], limit: number): T[] {
  if (values.length <= limit) {
    return values;
  }
  const firstCount = Math.ceil(limit / 2);
  return [...values.slice(0, firstCount), ...values.slice(-(limit - firstCount))];
}

function isInternalOnly(files: string[]): boolean {
  return files.length > 0 && files.every((file) => INTERNAL_PATH_PREFIXES.some((prefix) => file.startsWith(prefix)));
}

function preferredPullRequest(commit: CommitRecord, origin: PullRequestRecord[], upstream: PullRequestRecord[]): PullRequestRecord | null {
  const candidates = commit.isUpstream ? upstream : origin;
  return candidates.find((pull) => pull.mergedAt !== null) ?? null;
}

function changeProvenance(commits: CommitRecord[], files: string[], hotspots: Set<string>): Provenance {
  if (isInternalOnly(files)) {
    return "internal";
  }
  const hasUpstream = commits.some((commit) => commit.isUpstream);
  const hasOrigin = commits.some((commit) => !commit.isUpstream);
  if ((hasUpstream && hasOrigin) || (hasOrigin && files.some((file) => hotspots.has(file)))) {
    return "mixed";
  }
  return hasUpstream ? "upstream" : "origin";
}

function pullSource(pull: PullRequestRecord): SourceEvidence {
  return {
    id: `pr:${pull.repository}#${pull.number}`,
    type: "pull-request",
    title: `${pull.repository}#${pull.number}: ${pull.title}`,
    text: [`Title: ${pull.title}`, `Labels: ${pull.labels.join(", ") || "none"}`, "Description:", pull.body || "(none)"].join("\n"),
    url: pull.url
  };
}

function commitSource(commit: CommitRecord): SourceEvidence {
  return {
    id: `commit:${commit.sha.slice(0, 12)}`,
    type: "commit",
    title: commit.subject,
    text: [`Commit: ${commit.sha}`, `Author: ${commit.author}`, `Subject: ${commit.subject}`, commit.body].filter(Boolean).join("\n"),
    url: `https://github.com/${config.sourceRepository.owner}/${config.sourceRepository.repo}/commit/${commit.sha}`
  };
}

export async function normalizeChanges(
  commits: CommitRecord[],
  hotspots: string[],
  rangeFiles: string[],
  github: GitHubClient
): Promise<NormalizedChange[]> {
  const groups = new Map<string, { commits: CommitRecord[]; pulls: PullRequestRecord[] }>();

  for (const commit of commits.filter(
    (candidate) => !candidate.isUpstreamSyncMerge && !SKIPPED_COMMIT_SUBJECTS.test(candidate.subject)
  )) {
    const [originPulls, upstreamPulls] = await Promise.all([
      github.associatedPullRequests(config.sourceRepository, commit.sha),
      github.associatedPullRequests(config.upstreamRepository, commit.sha)
    ]);
    const pull = preferredPullRequest(commit, originPulls, upstreamPulls);
    const key = pull ? `pr:${pull.repository}#${pull.number}` : `commit:${commit.sha}`;
    const group = groups.get(key) ?? { commits: [], pulls: [] };
    group.commits.push(commit);
    const relatedPulls = [
      originPulls.find((candidate) => candidate.mergedAt !== null),
      upstreamPulls.find((candidate) => candidate.mergedAt !== null)
    ].filter((candidate) => candidate !== undefined);
    for (const candidate of relatedPulls) {
      if (!group.pulls.some((existing) => existing.repository === candidate.repository && existing.number === candidate.number)) {
        group.pulls.push(candidate);
      }
    }
    groups.set(key, group);
  }

  const hotspotSet = new Set(hotspots);
  const rangeFileSet = new Set(rangeFiles);
  const changes: NormalizedChange[] = [];
  for (const [id, group] of groups) {
    const files = [...new Set(group.commits.filter((commit) => commit.parents.length <= 1).flatMap((commit) => commit.files))]
      .filter((file) => rangeFileSet.has(file))
      .sort();
    const { patch, truncated } = await patchForCommits(
      group.commits.filter((commit) => commit.parents.length <= 1).map((commit) => commit.sha),
      config.maxPatchCharacters
    );
    const sources: SourceEvidence[] = [
      ...group.pulls.map(pullSource),
      ...boundedSample(group.commits, MAX_COMMIT_SOURCES).map(commitSource),
      ...files.slice(0, MAX_FILE_SOURCES).map((file) => ({
        id: compactSourceId("file", `${id}\0${file}`),
        type: "file" as const,
        title: file,
        text: `Changed file: ${file}`,
        url: `https://github.com/${config.sourceRepository.owner}/${config.sourceRepository.repo}/commit/${group.commits.at(-1)?.sha ?? "HEAD"}`
      }))
    ];
    if (patch) {
      sources.push({
        id: compactSourceId("diff", id),
        type: "diff",
        title: `Diff for ${id}`,
        text: patch,
        url: `https://github.com/${config.sourceRepository.owner}/${config.sourceRepository.repo}/compare/${group.commits[0]?.parents[0] ?? group.commits[0]?.sha}...${group.commits.at(-1)?.sha}`
      });
    }
    changes.push({
      id,
      provenance: changeProvenance(group.commits, files, hotspotSet),
      commits: group.commits,
      pullRequests: group.pulls,
      files,
      sources,
      patchTruncated: truncated || files.length > MAX_FILE_SOURCES || group.commits.length > MAX_COMMIT_SOURCES
    });
  }
  return changes;
}
