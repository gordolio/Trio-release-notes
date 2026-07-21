import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { config } from "./config.js";
import { CATEGORY_VALUES, PROMPT_VERSION, SCHEMA_VERSION } from "./constants.js";
import {
  aggregateOutputSchema,
  changeSummarySchema,
  type AggregateItem,
  type ChangeSummary,
  type NormalizedChange
} from "./types.js";

const categorySchema = { type: "string", enum: CATEGORY_VALUES } as const;
const confidenceSchema = { type: "string", enum: ["high", "medium", "low"] } as const;
const VALIDATION_ATTEMPTS = 2;

const changeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["changeId", "summary", "userFacingImpact", "category", "sourceIds", "confidence", "humanReviewRequired"],
  properties: {
    changeId: { type: "string" },
    summary: { type: "string", minLength: 1 },
    userFacingImpact: { type: "string", minLength: 1 },
    category: categorySchema,
    sourceIds: { type: "array", minItems: 1, items: { type: "string" } },
    confidence: confidenceSchema,
    humanReviewRequired: { type: "boolean" }
  }
};

const aggregateJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "changeIds",
          "summary",
          "userFacingImpact",
          "category",
          "sourceIds",
          "confidence",
          "humanReviewRequired",
          "highlight"
        ],
        properties: {
          changeIds: { type: "array", minItems: 1, items: { type: "string" } },
          summary: { type: "string", minLength: 1 },
          userFacingImpact: { type: "string", minLength: 1 },
          category: categorySchema,
          sourceIds: { type: "array", minItems: 1, items: { type: "string" } },
          confidence: confidenceSchema,
          humanReviewRequired: { type: "boolean" },
          highlight: { type: "boolean" }
        }
      }
    }
  }
};

export function changeSchema(change: NormalizedChange): object {
  return {
    ...changeJsonSchema,
    properties: {
      ...changeJsonSchema.properties,
      changeId: { type: "string", enum: [change.id] },
      sourceIds: {
        type: "array",
        minItems: 1,
        items: { type: "string", enum: change.sources.map((source) => source.id) }
      }
    }
  };
}

export function aggregateSchema(changes: NormalizedChange[], summaries: ChangeSummary[]): object {
  return {
    ...aggregateJsonSchema,
    properties: {
      items: {
        ...aggregateJsonSchema.properties.items,
        items: {
          ...aggregateJsonSchema.properties.items.items,
          properties: {
            ...aggregateJsonSchema.properties.items.items.properties,
            changeIds: {
              type: "array",
              minItems: 1,
              items: { type: "string", enum: changes.map((change) => change.id) }
            },
            sourceIds: {
              type: "array",
              minItems: 1,
              items: { type: "string", enum: [...new Set(summaries.flatMap((summary) => summary.sourceIds))] }
            }
          }
        }
      }
    }
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

interface CacheRecord {
  inputHash: string;
  promptVersion: string;
  schemaVersion: string;
  requestedModel: string;
  responseModel: string;
  summary: ChangeSummary;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function inputHash(value: unknown): string {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

function safeCacheName(changeId: string): string {
  return createHash("sha256").update(changeId).digest("hex");
}

function parseContent(content: string | null): unknown {
  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }
  return JSON.parse(content) as unknown;
}

export class OpenRouterSummarizer {
  private readonly client: OpenAI;
  private responseModel = config.openRouterModel;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openRouterApiKey,
      baseURL: "https://openrouter.ai/api/v1",
      maxRetries: 2,
      timeout: 120_000,
      defaultHeaders: {
        "HTTP-Referer": config.siteUrl,
        "X-OpenRouter-Title": "Trio Release Notes"
      }
    });
  }

  get model(): string {
    return this.responseModel;
  }

  async summarizeChange(change: NormalizedChange): Promise<ChangeSummary> {
    const input = {
      changeId: change.id,
      provenance: change.provenance,
      patchTruncated: change.patchTruncated,
      sources: change.sources.map(({ id, type, title, text }) => ({ id, type, title, text }))
    };
    const hash = inputHash({ input, promptVersion: PROMPT_VERSION, schemaVersion: SCHEMA_VERSION, model: config.openRouterModel });
    const cachePath = path.join(config.cacheDir, `${safeCacheName(change.id)}.json`);
    try {
      const cached = JSON.parse(await readFile(cachePath, "utf8")) as CacheRecord;
      if (
        cached.inputHash === hash &&
        cached.promptVersion === PROMPT_VERSION &&
        cached.schemaVersion === SCHEMA_VERSION &&
        cached.requestedModel === config.openRouterModel
      ) {
        this.responseModel = cached.responseModel;
        const summary = changeSummarySchema.parse(cached.summary);
        this.validateChangeSummary(summary, change);
        return summary;
      }
    } catch (error) {
      if (!(typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT")) {
        throw error;
      }
    }

    let summary: ChangeSummary | undefined;
    let responseModel = config.openRouterModel;
    let correction = "";
    for (let attempt = 0; attempt < VALIDATION_ATTEMPTS; attempt += 1) {
      const response = await this.client.chat.completions.create({
        model: config.openRouterModel,
        messages: [
          {
            role: "system",
            content: [
              "Summarize only the supplied logical code change.",
              "Use no outside knowledge and make no unsupported claims.",
              "Every factual statement must be supported by at least one supplied source ID.",
              "Copy changeId and sourceIds exactly from the supplied input. Do not shorten or rewrite them.",
              "Describe user impact conservatively. If evidence is insufficient, say so and require human review.",
              "Internal-only changes belong in internal-and-build-system. Origin provenance may use origin-only-customizations.",
              "Return only JSON matching the schema.",
              correction
            ].filter(Boolean).join("\n")
          },
          { role: "user", content: JSON.stringify(input) }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "trio_change_summary", strict: true, schema: changeSchema(change) }
        },
        provider: { require_parameters: true }
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
      responseModel = response.model;
      this.responseModel = response.model;
      try {
        const candidate = changeSummarySchema.parse(parseContent(response.choices[0]?.message.content ?? null));
        this.validateChangeSummary(candidate, change);
        summary = candidate;
        break;
      } catch (error) {
        if (attempt === VALIDATION_ATTEMPTS - 1) {
          throw error;
        }
        correction = [
          `The previous response failed validation: ${errorMessage(error)}`,
          `Allowed sourceIds: ${change.sources.map((source) => source.id).join(", ")}`,
          "Return a corrected response using only exact allowed identifiers."
        ].join("\n");
      }
    }
    if (!summary) {
      throw new Error(`OpenRouter did not return a valid summary for ${change.id}`);
    }
    await mkdir(config.cacheDir, { recursive: true });
    const cache: CacheRecord = {
      inputHash: hash,
      promptVersion: PROMPT_VERSION,
      schemaVersion: SCHEMA_VERSION,
      requestedModel: config.openRouterModel,
      responseModel,
      summary
    };
    await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
    return summary;
  }

  async aggregate(changes: NormalizedChange[], summaries: ChangeSummary[]): Promise<AggregateItem[]> {
    if (summaries.length === 0) {
      return [];
    }
    const input = summaries.map((summary) => ({
      ...summary,
      provenance: changes.find((change) => change.id === summary.changeId)?.provenance
    }));
    let correction = "";
    for (let attempt = 0; attempt < VALIDATION_ATTEMPTS; attempt += 1) {
      const response = await this.client.chat.completions.create({
        model: config.openRouterModel,
        messages: [
          {
            role: "system",
            content: [
              "Organize validated change summaries into concise build release-note items.",
              "Use each supplied changeId exactly once. Combine only closely related changes.",
              "Copy changeIds and sourceIds exactly from the supplied input. Do not shorten or rewrite them.",
              "Do not add uncited facts, risks, or known concerns.",
              "Mark only the most user-significant items as highlights.",
              "If combined evidence is uncertain, require human review.",
              "Return only JSON matching the schema.",
              correction
            ].filter(Boolean).join("\n")
          },
          { role: "user", content: JSON.stringify(input) }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "trio_build_summary", strict: true, schema: aggregateSchema(changes, summaries) }
        },
        provider: { require_parameters: true }
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
      this.responseModel = response.model;
      try {
        const result = aggregateOutputSchema.parse(parseContent(response.choices[0]?.message.content ?? null));
        this.validateAggregate(result.items, changes, summaries);
        return result.items;
      } catch (error) {
        if (attempt === VALIDATION_ATTEMPTS - 1) {
          throw error;
        }
        correction = [
          `The previous response failed validation: ${errorMessage(error)}`,
          `Allowed changeIds: ${changes.map((change) => change.id).join(", ")}`,
          `Allowed sourceIds: ${[...new Set(summaries.flatMap((summary) => summary.sourceIds))].join(", ")}`,
          "Return a corrected response using every change exactly once and only exact allowed identifiers."
        ].join("\n");
      }
    }
    throw new Error("OpenRouter did not return a valid aggregate summary");
  }

  private validateChangeSummary(summary: ChangeSummary, change: NormalizedChange): void {
    if (summary.changeId !== change.id) {
      throw new Error(`OpenRouter changed change ID ${change.id} to ${summary.changeId}`);
    }
    const allowedSources = new Set(change.sources.map((source) => source.id));
    for (const sourceId of summary.sourceIds) {
      if (!allowedSources.has(sourceId)) {
        throw new Error(`OpenRouter cited unknown source ${sourceId} for ${change.id}`);
      }
    }
  }

  private validateAggregate(items: AggregateItem[], changes: NormalizedChange[], summaries: ChangeSummary[]): void {
    const expectedChanges = new Set(changes.map((change) => change.id));
    const seenChanges = new Set<string>();
    const summaryByChange = new Map(summaries.map((summary) => [summary.changeId, summary]));
    for (const item of items) {
      const allowedSources = new Set<string>();
      for (const changeId of item.changeIds) {
        if (!expectedChanges.has(changeId) || seenChanges.has(changeId)) {
          throw new Error(`OpenRouter returned an unknown or duplicate change ID: ${changeId}`);
        }
        seenChanges.add(changeId);
        for (const sourceId of summaryByChange.get(changeId)?.sourceIds ?? []) {
          allowedSources.add(sourceId);
        }
      }
      for (const sourceId of item.sourceIds) {
        if (!allowedSources.has(sourceId)) {
          throw new Error(`Aggregated item cited out-of-scope source ${sourceId}`);
        }
      }
      for (const changeId of item.changeIds) {
        const changeSources = new Set(summaryByChange.get(changeId)?.sourceIds ?? []);
        if (!item.sourceIds.some((sourceId) => changeSources.has(sourceId))) {
          throw new Error(`Aggregated item does not cite change ${changeId}`);
        }
      }
      if (item.category === "highlights" && !item.highlight) {
        throw new Error("An item categorized as highlights must be marked as a highlight");
      }
    }
    if (seenChanges.size !== expectedChanges.size) {
      const missing = [...expectedChanges].filter((changeId) => !seenChanges.has(changeId));
      throw new Error(`OpenRouter omitted changes: ${missing.join(", ")}`);
    }
  }
}
