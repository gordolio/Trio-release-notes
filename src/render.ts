import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CATEGORY_TITLES, CATEGORY_VALUES } from "./constants.js";
import { config } from "./config.js";
import type { BuildReport, ReportItem } from "./types.js";

function escapeMarkdown(value: string): string {
  return value.replace(/([\\`*_[\]{}<>#|])/g, "\\$1");
}

function renderItem(item: ReportItem): string {
  const review = item.humanReviewRequired ? "\n  - Human review recommended." : "";
  const source = item.sources[0];
  const sourceLink = source ? `\n  - [View source](${source.url})` : "";
  const bullets = item.changes.map((change) => `  - ${escapeMarkdown(change)}`).join("\n");
  return `- **${escapeMarkdown(item.title)}**\n${bullets}${review}${sourceLink}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderHtmlItem(item: ReportItem): string {
  const source = item.sources[0];
  const sourceLink = source
    ? `<p class="sources"><a href="${escapeHtml(source.url)}" rel="noreferrer">View source on GitHub</a></p>`
    : "";
  const review = item.humanReviewRequired ? "<p><strong>Human review recommended.</strong></p>" : "";
  const bullets = `<ul>${item.changes.map((change) => `<li>${escapeHtml(change)}</li>`).join("")}</ul>`;
  return `<article><h3>${escapeHtml(item.title)}</h3>${bullets}${review}${sourceLink}</article>`;
}

function categoryItems(category: BuildReport["categories"][number]): ReportItem[] {
  return category.items.filter((item) => !item.highlight);
}

export function renderHtml(report: BuildReport): string {
  const sections: string[] = [];
  if (report.highlights.length > 0) {
    sections.push(`<section><h2>Highlights</h2>${report.highlights.map(renderHtmlItem).join("\n")}</section>`);
  }
  for (const category of report.categories) {
    const items = categoryItems(category);
    if (items.length === 0) {
      continue;
    }
    sections.push(
      `<section><h2>${escapeHtml(category.title)}</h2>${items.map(renderHtmlItem).join("\n")}</section>`
    );
  }
  if (sections.length === 0) {
    sections.push("<p>No source changes were found between the two successful builds.</p>");
  }
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Trio Build ${escapeHtml(report.metadata.shortSha)}</title>
  <style>
    :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.5; }
    body { margin: 0 auto; max-width: 52rem; padding: 2rem 1.25rem 4rem; }
    h1, h2, h3 { line-height: 1.2; }
    section { margin-top: 2.5rem; }
    article { border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent); padding: 1rem 0; }
    .sources, footer { font-size: .875rem; opacity: .8; }
    a { color: inherit; text-underline-offset: .2em; }
  </style>
</head>
<body>
  <main>
    <h1>Trio Build ${escapeHtml(report.metadata.shortSha)}</h1>
    <p>Built ${escapeHtml(report.metadata.buildDate)} from <code>${escapeHtml(report.metadata.previousBuiltSha.slice(0, 7))}..${escapeHtml(report.metadata.shortSha)}</code>.</p>
    ${sections.join("\n")}
  </main>
  <footer>
    <p><a href="${escapeHtml(report.metadata.sourceWorkflowRunUrl)}">Source workflow ${report.metadata.sourceWorkflowRunId}</a></p>
  </footer>
</body>
</html>
`;
}

export function renderMarkdown(report: BuildReport): string {
  const lines = [
    `# Trio Build ${report.metadata.shortSha}`,
    "",
    `Built ${report.metadata.buildDate} from \`${report.metadata.previousBuiltSha.slice(0, 7)}..${report.metadata.shortSha}\`.`,
    ""
  ];
  if (report.highlights.length > 0) {
    lines.push("## Highlights", "", ...report.highlights.map(renderItem), "");
  }
  for (const category of report.categories) {
    const items = categoryItems(category);
    if (items.length === 0) {
      continue;
    }
    lines.push(`## ${category.title}`, "", ...items.map(renderItem), "");
  }
  if (report.highlights.length === 0 && report.categories.every((category) => categoryItems(category).length === 0)) {
    lines.push("No source changes were found between the two successful builds.", "");
  }
  lines.push(
    "## Build Metadata",
    "",
    `- Source workflow: [${report.metadata.sourceWorkflowRunId}](${report.metadata.sourceWorkflowRunUrl})`,
    `- Previous built commit: [\`${report.metadata.previousBuiltSha}\`](https://github.com/gordolio/Trio/commit/${report.metadata.previousBuiltSha})`,
    `- Current built commit: [\`${report.metadata.currentBuiltSha}\`](https://github.com/gordolio/Trio/commit/${report.metadata.currentBuiltSha})`,
    `- Provenance model: \`${report.metadata.model}\``,
    `- Generator: \`${report.metadata.generatorVersion}\`, prompt \`${report.metadata.promptVersion}\``,
    ""
  );
  return `${lines.join("\n").trim()}\n`;
}

export function renderMaintenanceMarkdown(report: BuildReport): string {
  const lines = [
    `# Maintenance Hotspots for ${report.metadata.shortSha}`,
    "",
    `Comparison: \`${report.metadata.previousBuiltSha.slice(0, 7)}..${report.metadata.shortSha}\``,
    ""
  ];
  if (report.maintenanceHotspots.length === 0) {
    lines.push("No files were changed by both upstream and origin-specific commits in this build range.", "");
  } else {
    lines.push(
      "These files were touched by both upstream and fork-specific commits:",
      "",
      ...report.maintenanceHotspots.map(
        (file) => `- [\`${file}\`](https://github.com/gordolio/Trio/compare/${report.metadata.previousBuiltSha}...${report.metadata.currentBuiltSha})`
      ),
      ""
    );
  }
  return `${lines.join("\n").trim()}\n`;
}

export async function writeReport(report: BuildReport): Promise<string> {
  const buildsDirectory = path.join(config.publicDir, "builds");
  const maintenanceDirectory = path.join(config.publicDir, "maintenance");
  await Promise.all([
    mkdir(buildsDirectory, { recursive: true }),
    mkdir(maintenanceDirectory, { recursive: true })
  ]);
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = renderMarkdown(report);
  const reportPath = `public/builds/${report.metadata.shortSha}.json`;
  await Promise.all([
    writeFile(path.join(buildsDirectory, `${report.metadata.shortSha}.json`), json),
    writeFile(path.join(buildsDirectory, `${report.metadata.shortSha}.md`), markdown),
    writeFile(path.join(buildsDirectory, `${report.metadata.shortSha}.html`), renderHtml(report)),
    writeFile(path.join(maintenanceDirectory, `${report.metadata.shortSha}.md`), renderMaintenanceMarkdown(report))
  ]);
  return reportPath;
}

export async function updateLatest(report: BuildReport): Promise<void> {
  await mkdir(config.publicDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(config.publicDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(path.join(config.publicDir, "latest.md"), renderMarkdown(report)),
    writeFile(path.join(config.publicDir, "latest.html"), renderHtml(report)),
    writeFile(
      path.join(config.publicDir, "index.html"),
      `<!doctype html>\n<meta charset="utf-8">\n<meta http-equiv="refresh" content="0; url=latest.html">\n<title>Trio Release Notes</title>\n<a href="latest.html">Latest Trio release notes</a>\n`
    )
  ]);
}

export function buildReleaseNotesFeed(reports: BuildReport[]): BuildReport[] {
  return [...reports].sort(
    (left, right) =>
      right.metadata.buildDate.localeCompare(left.metadata.buildDate) ||
      right.metadata.shortSha.localeCompare(left.metadata.shortSha)
  );
}

export async function updateReleaseNotesFeed(): Promise<void> {
  const buildsDirectory = path.join(config.publicDir, "builds");
  await mkdir(buildsDirectory, { recursive: true });
  const reportFiles = (await readdir(buildsDirectory)).filter((file) => file.endsWith(".json"));
  const reports = await Promise.all(
    reportFiles.map(async (file) => JSON.parse(await readFile(path.join(buildsDirectory, file), "utf8")) as BuildReport)
  );
  const lines = buildReleaseNotesFeed(reports).map((report) => JSON.stringify(report));
  await writeFile(path.join(config.publicDir, "builds.jsonl"), lines.length > 0 ? `${lines.join("\n")}\n` : "");
}

export async function readExistingReport(shortSha: string): Promise<BuildReport | null> {
  try {
    return JSON.parse(await readFile(path.join(config.publicDir, "builds", `${shortSha}.json`), "utf8")) as BuildReport;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export function buildCategories(items: ReportItem[]): BuildReport["categories"] {
  return CATEGORY_VALUES.map((category) => ({
    category,
    title: CATEGORY_TITLES[category],
    items: items.filter((item) => item.category === category)
  }));
}
