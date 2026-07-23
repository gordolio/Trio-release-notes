import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findDirectBuildDetailsPlist, parseBuildDetailsPlist } from "../src/artifact.js";

describe("parseBuildDetailsPlist", () => {
  it("extracts the embedded build SHA and date", async () => {
    const fixture = await readFile(path.join(process.cwd(), "tests/fixtures/BuildDetails.plist"), "utf8");
    expect(parseBuildDetailsPlist(fixture)).toEqual({
      abbreviatedSha: "24e4245",
      buildDate: "Mon Jul 20 14:42:00 UTC 2026"
    });
  });

  it("rejects a missing commit SHA", () => {
    expect(() => parseBuildDetailsPlist("<plist><dict></dict></plist>")).toThrow("com-trio-commit-sha");
  });
});

describe("findDirectBuildDetailsPlist", () => {
  it("finds metadata uploaded from the Trio artifact directory", () => {
    expect(findDirectBuildDetailsPlist(["buildlog/build.log", "artifacts/BuildDetails.plist"])).toBe(
      "artifacts/BuildDetails.plist"
    );
  });

  it("finds metadata with its workflow staging path preserved", () => {
    expect(findDirectBuildDetailsPlist(["release-notes/BuildDetails.plist"])).toBe(
      "release-notes/BuildDetails.plist"
    );
  });

  it("returns null for historical IPA-only artifacts", () => {
    expect(findDirectBuildDetailsPlist(["artifacts/Trio.ipa"])).toBeNull();
  });

  it("rejects ambiguous metadata entries", () => {
    expect(() => findDirectBuildDetailsPlist(["BuildDetails.plist", "artifacts/BuildDetails.plist"])).toThrow(
      "found 2"
    );
  });
});
