import { describe, expect, it, vi } from "vitest";
import { newestStoredAncestor } from "../src/build-history.js";
import type { BuildIdentity, StoredBuild, WorkflowRunInfo } from "../src/types.js";

function run(id: number, branch: string, createdAt: string): WorkflowRunInfo {
  return {
    id,
    name: "4. Build Trio",
    path: ".github/workflows/build_trio.yml",
    headBranch: branch,
    headSha: "current",
    status: "completed",
    conclusion: "success",
    createdAt,
    updatedAt: createdAt,
    url: `https://example.test/runs/${id}`
  };
}

function storedBuild(runId: number, branch: string, fullSha: string, builtAt: string): StoredBuild {
  return {
    runId,
    branch,
    fullSha,
    shortSha: fullSha.slice(0, 7),
    builtAt,
    reportPath: `public/builds/${fullSha.slice(0, 7)}.json`
  };
}

const current: BuildIdentity = {
  run: run(30, "codex/treatments-origin-complete-poc", "2026-07-31T12:00:00Z"),
  abbreviatedSha: "current",
  fullSha: "current-full-sha",
  buildDate: "2026-07-31T12:00:00Z"
};

describe("newestStoredAncestor", () => {
  it("uses the newest older build that is an ancestor, regardless of branch", async () => {
    const builds = [
      storedBuild(10, "dev", "older-ancestor", "2026-07-29T12:00:00Z"),
      storedBuild(20, "unrelated", "newer-unrelated", "2026-07-30T12:00:00Z"),
      storedBuild(21, "dev", "newest-ancestor", "2026-07-30T13:00:00Z")
    ];
    const isAncestor = vi.fn(async (sha: string) => sha.endsWith("ancestor"));

    await expect(newestStoredAncestor(builds, current, isAncestor)).resolves.toEqual(builds[2]);
    expect(isAncestor).toHaveBeenCalledTimes(1);
    expect(isAncestor).toHaveBeenCalledWith("newest-ancestor", current.fullSha);
  });

  it("ignores the current run and builds created after it", async () => {
    const isAncestor = vi.fn(async () => true);
    const builds = [
      storedBuild(current.run.id, current.run.headBranch, "same-run", "2026-07-31T11:00:00Z"),
      storedBuild(31, "dev", "future", "2026-08-01T12:00:00Z")
    ];

    await expect(newestStoredAncestor(builds, current, isAncestor)).resolves.toBeNull();
    expect(isAncestor).not.toHaveBeenCalled();
  });

  it("returns null when no recorded build is an ancestor", async () => {
    const builds = [storedBuild(20, "unrelated", "not-an-ancestor", "2026-07-30T12:00:00Z")];

    await expect(newestStoredAncestor(builds, current, async () => false)).resolves.toBeNull();
  });
});
