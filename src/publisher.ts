import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { config } from "./config.js";

const execFileAsync = promisify(execFile);

async function git(args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { cwd: config.root, encoding: "utf8" });
  return stdout;
}

async function hasUnpushedCommits(): Promise<boolean> {
  return Number.parseInt((await git(["rev-list", "--count", "@{upstream}..HEAD"])).trim(), 10) > 0;
}

async function hasStagedChanges(): Promise<boolean> {
  try {
    await git(["diff", "--cached", "--quiet"]);
    return false;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 1) {
      return true;
    }
    throw error;
  }
}

async function pushWithRetry(): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await git(["push"]);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
      }
    }
  }
  throw lastError;
}

export async function checkpointGeneratedOutputs(runId: number): Promise<boolean> {
  await git(["add", "data", "public"]);
  const changed = await hasStagedChanges();
  if (changed) {
    await git(["commit", "-m", `Generate release notes for workflow run ${runId}`]);
  }
  if (changed || (await hasUnpushedCommits())) {
    await pushWithRetry();
  }
  if (changed) {
    console.log(`Checkpointed generated output after workflow run ${runId}`);
  }
  return changed;
}
