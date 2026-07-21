import { describe, expect, it } from "vitest";
import { aggregateSchema, changeSchema } from "../src/openrouter.js";
import type { ChangeSummary, NormalizedChange } from "../src/types.js";

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
      properties: { changeId: { enum: string[] }; sourceIds: { items: { enum: string[] } } };
    };
    expect(schema.properties.changeId.enum).toEqual(["change-1"]);
    expect(schema.properties.sourceIds.items.enum).toEqual(["source-1", "source-2"]);
  });

  it("restricts aggregation to supplied changes and cited sources", () => {
    const changes = [change("change-1", ["source-1"]), change("change-2", ["source-2"])];
    const summaries: ChangeSummary[] = changes.map((item, index) => ({
      changeId: item.id,
      summary: "Summary",
      userFacingImpact: "Impact",
      category: "fixes",
      sourceIds: [`source-${index + 1}`],
      confidence: "high",
      humanReviewRequired: false
    }));
    const schema = aggregateSchema(changes, summaries) as {
      properties: {
        items: { items: { properties: { changeIds: { items: { enum: string[] } }; sourceIds: { items: { enum: string[] } } } } };
      };
    };
    expect(schema.properties.items.items.properties.changeIds.items.enum).toEqual(["change-1", "change-2"]);
    expect(schema.properties.items.items.properties.sourceIds.items.enum).toEqual(["source-1", "source-2"]);
  });
});
