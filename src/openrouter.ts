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

    const response = await this.client.chat.completions.create({
      model: config.openRouterModel,
      messages: [
        {
          role: "system",
          content: [
            "Summarize only the supplied logical code change.",
            "Use no outside knowledge and make no unsupported claims.",
            "Every factual statement must be supported by at least one supplied source ID.",
            "Preserve the exact changeId. Do not create URLs or source IDs.",
            "Describe user impact conservatively. If evidence is insufficient, say so and require human review.",
            "Internal-only changes belong in internal-and-build-system. Origin provenance may use origin-only-customizations.",
            "Return only JSON matching the schema."
          ].join("\n")
        },
        { role: "user", content: JSON.stringify(input) }
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "trio_change_summary", strict: true, schema: changeJsonSchema }
      },
      provider: { require_parameters: true }
    } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
    this.responseModel = response.model;
    const summary = changeSummarySchema.parse(parseContent(response.choices[0]?.message.content ?? null));
    this.validateChangeSummary(summary, change);
    await mkdir(config.cacheDir, { recursive: true });
    const cache: CacheRecord = {
      inputHash: hash,
      promptVersion: PROMPT_VERSION,
      schemaVersion: SCHEMA_VERSION,
      requestedModel: config.openRouterModel,
      responseModel: response.model,
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
    const response = await this.client.chat.completions.create({
      model: config.openRouterModel,
      messages: [
        {
          role: "system",
          content: [
            "Organize validated change summaries into concise build release-note items.",
            "Use each supplied changeId exactly once. Combine only closely related changes.",
            "Use only supplied sourceIds and preserve their factual meaning.",
            "Do not add uncited facts, risks, or known concerns.",
            "Mark only the most user-significant items as highlights.",
            "If combined evidence is uncertain, require human review.",
            "Return only JSON matching the schema."
          ].join("\n")
        },
        { role: "user", content: JSON.stringify(input) }
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "trio_build_summary", strict: true, schema: aggregateJsonSchema }
      },
      provider: { require_parameters: true }
    } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
    this.responseModel = response.model;
    const result = aggregateOutputSchema.parse(parseContent(response.choices[0]?.message.content ?? null));
    this.validateAggregate(result.items, changes, summaries);
    return result.items;
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
