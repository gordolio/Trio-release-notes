import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderHtml, renderMaintenanceMarkdown, renderMarkdown } from "../src/render.js";
import type { BuildReport } from "../src/types.js";

async function reportFixture(): Promise<BuildReport> {
  return JSON.parse(await readFile(path.join(process.cwd(), "tests/fixtures/report.json"), "utf8")) as BuildReport;
}

describe("deterministic Markdown rendering", () => {
  it("renders categories, bullet points, and a compact source link", async () => {
    const markdown = renderMarkdown(await reportFixture());
    expect(markdown).toContain("## Fixes");
    expect(markdown).toContain("- **Test behavior fix**");
    expect(markdown).toContain("  - A test behavior is more reliable.");
    expect(markdown).toContain("[View source](https://github.com/gordolio/Trio/commit/2222222)");
    expect(markdown).toContain("Source workflow");
  });

  it("does not repeat highlighted items in category sections", async () => {
    const report = await reportFixture();
    const item = report.categories[0]!.items[0]!;
    item.highlight = true;
    report.highlights = [item];
    const markdown = renderMarkdown(report);
    const html = renderHtml(report);
    expect(markdown.match(/Test behavior fix/g)).toHaveLength(1);
    expect(html.match(/Test behavior fix/g)).toHaveLength(1);
    expect(markdown).not.toContain("No source changes were found");
  });

  it("escapes model prose in Markdown", async () => {
    const report = await reportFixture();
    report.categories[0]!.items[0]!.changes = ["Fix [alert] *display*."];
    expect(renderMarkdown(report)).toContain("Fix \\[alert\\] \\*display\\*.");
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
