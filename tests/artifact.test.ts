import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseBuildDetailsPlist } from "../src/artifact.js";

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
