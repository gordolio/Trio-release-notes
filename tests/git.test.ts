import { describe, expect, it } from "vitest";
import { maintenanceHotspots } from "../src/git.js";
import type { CommitRecord } from "../src/types.js";

function commit(sha: string, isUpstream: boolean, files: string[]): CommitRecord {
  return {
    sha,
    parents: [],
    author: "Test",
    authoredAt: "2026-07-20T00:00:00Z",
    subject: "Test",
    body: "",
    files,
    isUpstream,
    isUpstreamSyncMerge: false
  };
}

describe("maintenanceHotspots", () => {
  it("returns only files touched by upstream and origin commits", () => {
    expect(
      maintenanceHotspots([
        commit("1", true, ["Shared.swift", "Upstream.swift"]),
        commit("2", false, ["Shared.swift", "Origin.swift"])
      ])
    ).toEqual(["Shared.swift"]);
  });

  it("does not treat upstream synchronization merges as origin work", () => {
    const syncMerge = commit("3", false, ["Shared.swift"]);
    syncMerge.parents = ["1", "2"];
    syncMerge.isUpstreamSyncMerge = true;
    expect(maintenanceHotspots([commit("1", true, ["Shared.swift"]), syncMerge])).toEqual([]);
  });
});
