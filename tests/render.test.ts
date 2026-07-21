import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderHtml, renderMaintenanceMarkdown, renderMarkdown } from "../src/render.js";
import type { BuildReport } from "../src/types.js";

async function reportFixture(): Promise<BuildReport> {
  return JSON.parse(await readFile(path.join(process.cwd(), "tests/fixtures/report.json"), "utf8")) as BuildReport;
}

describe("deterministic Markdown rendering", () => {
  it("renders categories and trusted source links", async () => {
    const markdown = renderMarkdown(await reportFixture());
    expect(markdown).toContain("## Fixes");
    expect(markdown).toContain("[Test commit](https://github.com/gordolio/Trio/commit/2222222)");
    expect(markdown).toContain("Source workflow");
  });

  it("renders an empty maintenance report", async () => {
    expect(renderMaintenanceMarkdown(await reportFixture())).toContain("No files were changed by both upstream");
  });

  it("renders a standalone HTML page", async () => {
    const html = renderHtml(await reportFixture());
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Trio Build 2222222");
    expect(html).toContain("https://github.com/gordolio/Trio/commit/2222222");
  });
});
