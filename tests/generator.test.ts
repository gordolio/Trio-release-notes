import { afterEach, describe, expect, it, vi } from "vitest";
import { findPreviousBuild } from "../src/generator.js";
import { GitHubClient } from "../src/github.js";
import { isAncestor } from "../src/git.js";
import { emptyState } from "../src/state.js";
import type { BuildIdentity, StoredBuild, WorkflowRunInfo } from "../src/types.js";

vi.mock("../src/git.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../src/git.js")>();
  return { ...original, isAncestor: vi.fn(async () => true) };
});

function run(id: number, createdAt: string): WorkflowRunInfo {
  return {
    id, createdAt, updatedAt: createdAt, name: "Build Trio (dev)",
    path: ".github/workflows/build_trio.yml", headBranch: "dev",
    headSha: String(id), status: "completed", conclusion: "success",
    url: `https://example.test/runs/${id}`
  };
}

function stored(run: WorkflowRunInfo): StoredBuild {
  return {
    runId: run.id, branch: run.headBranch, fullSha: run.headSha,
    shortSha: run.headSha, builtAt: run.createdAt, reportPath: null
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(isAncestor).mockResolvedValue(true);
});

describe("findPreviousBuild", () => {
  it("uses the newer recorded build when GitHub returns an older successful run", async () => {
    const old = run(36144730841, "2026-09-25T14:01:29Z");
    const previous = run(37485451388, "2026-10-06T15:12:22Z");
    const currentRun = run(37503160396, "2026-10-06T17:23:22Z");
    const current: BuildIdentity = {
      run: currentRun, fullSha: currentRun.headSha,
      abbreviatedSha: currentRun.headSha, buildDate: currentRun.createdAt
    };
    const state = emptyState();
    state.successfulBuilds = [stored(old), stored(previous)];
    const github = new GitHubClient("test");
    vi.spyOn(github, "findPreviousSuccessfulRun").mockResolvedValue(old);

    const result = await findPreviousBuild(github, state, current);

    expect(result.runId).toBe(previous.id);
  });

  it("keeps a newer API baseline rather than replacing it with older stored state", async () => {
    const old = run(36144730841, "2026-09-25T14:01:29Z");
    const previous = run(37485451388, "2026-10-06T15:12:22Z");
    const currentRun = run(37503160396, "2026-10-06T17:23:22Z");
    const current: BuildIdentity = {
      run: currentRun, fullSha: currentRun.headSha,
      abbreviatedSha: currentRun.headSha, buildDate: currentRun.createdAt
    };
    const state = emptyState();
    state.successfulBuilds = [stored(old), stored(previous)];
    const github = new GitHubClient("test");
    vi.spyOn(github, "findPreviousSuccessfulRun").mockResolvedValue(previous);

    const result = await findPreviousBuild(github, state, current);

    expect(result.runId).toBe(previous.id);
  });

  it("does not use a newer recorded build that is not an ancestor", async () => {
    const old = run(10, "2026-09-25T14:01:29Z");
    const unrelated = run(20, "2026-10-06T15:12:22Z");
    const currentRun = run(30, "2026-10-06T17:23:22Z");
    const current: BuildIdentity = {
      run: currentRun, fullSha: currentRun.headSha,
      abbreviatedSha: currentRun.headSha, buildDate: currentRun.createdAt
    };
    const state = emptyState();
    state.successfulBuilds = [stored(old), stored(unrelated)];
    vi.mocked(isAncestor).mockImplementation(async (sha) => sha === old.headSha);
    const github = new GitHubClient("test");
    vi.spyOn(github, "findPreviousSuccessfulRun").mockResolvedValue(old);

    const result = await findPreviousBuild(github, state, current);

    expect(result.runId).toBe(old.id);
  });

  it("uses the recorded same-branch ancestor when GitHub returns no previous run", async () => {
    const previous = run(20, "2026-10-06T15:12:22Z");
    const currentRun = run(30, "2026-10-06T17:23:22Z");
    const current: BuildIdentity = {
      run: currentRun, fullSha: currentRun.headSha,
      abbreviatedSha: currentRun.headSha, buildDate: currentRun.createdAt
    };
    const state = emptyState();
    state.successfulBuilds = [stored(previous)];
    const github = new GitHubClient("test");
    vi.spyOn(github, "findPreviousSuccessfulRun").mockResolvedValue(null);

    const result = await findPreviousBuild(github, state, current);

    expect(result.runId).toBe(previous.id);
  });
});
