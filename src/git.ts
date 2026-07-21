import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { config } from "./config.js";
import type { ChangedFile, CommitRecord } from "./types.js";

const execFileAsync = promisify(execFile);

async function git(args: string[], maxBuffer = 50 * 1024 * 1024): Promise<string> {
  const { stdout } = await execFileAsync("git", args, {
    cwd: config.sourceCheckout,
    maxBuffer,
    encoding: "utf8"
  });
  return stdout;
}

export async function resolveCommit(abbreviatedSha: string): Promise<string> {
  return (await git(["rev-parse", "--verify", `${abbreviatedSha}^{commit}`])).trim();
}

export async function assertDescendant(previousSha: string, currentSha: string): Promise<void> {
  try {
    await git(["merge-base", "--is-ancestor", previousSha, currentSha]);
  } catch {
    throw new Error(`Built commit ${currentSha} does not descend from previous built commit ${previousSha}`);
  }
}

async function isUpstreamCommit(sha: string): Promise<boolean> {
  const branches = await git(["branch", "-r", "--contains", sha]);
  return branches.split("\n").some((branch) => branch.trim().startsWith("upstream/"));
}

async function commitFiles(sha: string): Promise<string[]> {
  const output = await git(["diff-tree", "--no-commit-id", "--name-only", "-r", "-m", sha]);
  return [...new Set(output.split("\n").map((file) => file.trim()).filter(Boolean))];
}

export async function commitsBetween(previousSha: string, currentSha: string): Promise<CommitRecord[]> {
  if (previousSha === currentSha) {
    return [];
  }
  const shas = (await git(["log", "--reverse", "--format=%H", `${previousSha}..${currentSha}`]))
    .split("\n")
    .map((sha) => sha.trim())
    .filter(Boolean);

  const commits: CommitRecord[] = [];
  for (const sha of shas) {
    const fields = (await git(["show", "-s", "--format=%H%x1f%P%x1f%an%x1f%aI%x1f%s%x1f%b", sha])).split("\x1f");
    const parents = (fields[1] ?? "").split(" ").filter(Boolean);
    const isUpstream = await isUpstreamCommit(sha);
    const isUpstreamSyncMerge =
      !isUpstream && parents.length > 1 && (await Promise.all(parents.slice(1).map(isUpstreamCommit))).every(Boolean);
    commits.push({
      sha,
      parents,
      author: fields[2] ?? "Unknown",
      authoredAt: fields[3] ?? "",
      subject: fields[4] ?? "",
      body: (fields[5] ?? "").trim(),
      files: await commitFiles(sha),
      isUpstream,
      isUpstreamSyncMerge
    });
  }
  return commits;
}

export async function changedFiles(previousSha: string, currentSha: string): Promise<ChangedFile[]> {
  if (previousSha === currentSha) {
    return [];
  }
  const output = await git(["diff", "--name-status", "-z", "--find-renames", `${previousSha}..${currentSha}`]);
  const parts = output.split("\0");
  const files: ChangedFile[] = [];
  for (let index = 0; index < parts.length - 1; ) {
    const status = parts[index++] ?? "";
    const firstPath = parts[index++] ?? "";
    if (status.startsWith("R") || status.startsWith("C")) {
      const newPath = parts[index++] ?? "";
      files.push({ status, path: newPath, previousPath: firstPath });
    } else {
      files.push({ status, path: firstPath });
    }
  }
  return files;
}

export async function patchForCommits(commits: string[], limit: number): Promise<{ patch: string; truncated: boolean }> {
  if (commits.length === 0) {
    return { patch: "", truncated: false };
  }
  const output = await git([
    "show",
    "--format=commit %H%nSubject: %s%n",
    "--no-ext-diff",
    "--unified=3",
    "--no-renames",
    ...commits
  ]);
  if (output.length <= limit) {
    return { patch: output, truncated: false };
  }
  return { patch: `${output.slice(0, limit)}\n[diff truncated by generator]`, truncated: true };
}

export function maintenanceHotspots(commits: CommitRecord[]): string[] {
  const nonMergeCommits = commits.filter((commit) => commit.parents.length <= 1 && !commit.isUpstreamSyncMerge);
  const upstream = new Set(nonMergeCommits.filter((commit) => commit.isUpstream).flatMap((commit) => commit.files));
  const origin = new Set(nonMergeCommits.filter((commit) => !commit.isUpstream).flatMap((commit) => commit.files));
  return [...upstream].filter((file) => origin.has(file)).sort();
}
