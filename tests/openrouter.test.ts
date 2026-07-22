import { describe, expect, it } from "vitest";
import { changeSchema, highlightSchema, validateChangeSummary, validateProse } from "../src/openrouter.js";
import type { NormalizedChange } from "../src/types.js";

function change(id: string, sourceIds: string[]): NormalizedChange {
  return {
    id,
    provenance: "upstream",
    commits: [],
    pullRequests: [],
    files: [],
    patchTruncated: false,
    sources: sourceIds.map((sourceId) => ({
      id: sourceId,
      type: "file",
      title: sourceId,
      text: sourceId,
      url: "https://github.com/gordolio/Trio"
    }))
  };
}

describe("OpenRouter response schemas", () => {
  it("restricts change summaries to exact supplied identifiers", () => {
    const schema = changeSchema(change("change-1", ["source-1", "source-2"])) as {
      properties: {
        changeId: { enum: string[] };
        title: { maxLength: number };
        changes: { maxItems: number; items: { maxLength: number } };
        sourceIds: { maxItems: number; items: { enum: string[] } };
      };
    };
    expect(schema.properties.changeId.enum).toEqual(["change-1"]);
    expect(schema.properties.title.maxLength).toBe(60);
    expect(schema.properties.changes.maxItems).toBe(5);
    expect(schema.properties.changes.items.maxLength).toBe(120);
    expect(schema.properties.sourceIds.maxItems).toBe(4);
    expect(schema.properties.sourceIds.items.enum).toEqual(["source-1", "source-2"]);
  });

  it("restricts highlights to five supplied changes", () => {
    const changes = [change("change-1", ["source-1"]), change("change-2", ["source-2"])];
    const schema = highlightSchema(changes) as {
      properties: { highlightChangeIds: { maxItems: number; items: { enum: string[] } } };
    };
    expect(schema.properties.highlightChangeIds.maxItems).toBe(5);
    expect(schema.properties.highlightChangeIds.items.enum).toEqual(["change-1", "change-2"]);
  });

  it("rejects citations, newlines, and oversized prose", () => {
    expect(() => validateProse("Short release note", "title", 60)).not.toThrow();
    expect(() => validateProse("Fixed by commit:abc123", "title", 60)).toThrow(/citation/);
    expect(() => validateProse("First\nSecond", "changes[0]", 120)).toThrow(/single paragraph/);
    expect(() => validateProse("x".repeat(121), "changes[0]", 120)).toThrow(/exceeds/);
  });

  it("rejects change summaries with bullets cut off mid-word", () => {
    const item = change("change-1", ["source-1"]);
    const summary = {
      changeId: "change-1",
      title: "Title",
      changes: ["A complete bullet point."],
      category: "fixes" as const,
      sourceIds: ["source-1"],
      confidence: "high" as const,
      humanReviewRequired: false
    };
    expect(() => validateChangeSummary(summary, item)).not.toThrow();
    expect(() =>
      validateChangeSummary({ ...summary, changes: ['A quoted message: "Swipe left to end snooze."'] }, item)
    ).not.toThrow();
    expect(() => validateChangeSummary({ ...summary, changes: ["A bullet cut off mid-wo"] }, item)).toThrow(/punctuation/);
  });
});
