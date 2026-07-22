import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { config } from "./config.js";
import { CATEGORY_VALUES, MAX_HIGHLIGHTS, PROMPT_VERSION, SCHEMA_VERSION } from "./constants.js";
import {
  changeSummarySchema,
  highlightOutputSchema,
  type ChangeSummary,
  type NormalizedChange
} from "./types.js";

const categorySchema = { type: "string", enum: CATEGORY_VALUES } as const;
const confidenceSchema = { type: "string", enum: ["high", "medium", "low"] } as const;
const VALIDATION_ATTEMPTS = 2;

const changeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["changeId", "title", "changes", "category", "sourceIds", "confidence", "humanReviewRequired"],
  properties: {
    changeId: { type: "string" },
    title: { type: "string", minLength: 1, maxLength: 60 },
    changes: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", minLength: 1, maxLength: 120 } },
    category: categorySchema,
    sourceIds: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
    confidence: confidenceSchema,
    humanReviewRequired: { type: "boolean" }
  }
};

const highlightJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["highlightChangeIds"],
  properties: {
    highlightChangeIds: {
      type: "array",
      maxItems: MAX_HIGHLIGHTS,
      items: { type: "string" }
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
        maxItems: 4,
        items: { type: "string", enum: change.sources.map((source) => source.id) }
      }
    }
  };
}

export function highlightSchema(changes: NormalizedChange[]): object {
  return {
    ...highlightJsonSchema,
    properties: {
      highlightChangeIds: {
        type: "array",
        maxItems: MAX_HIGHLIGHTS,
        items: { type: "string", enum: changes.map((change) => change.id) }
      }
    }
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function validateProse(value: string, label: string, maxLength: number): void {
  if (value.length > maxLength) {
    throw new Error(`${label} exceeds ${maxLength} characters`);
  }
  if (/\b(?:commit|file|diff|pr):[^\s,;)]+/i.test(value) || /https?:\/\//i.test(value)) {
    throw new Error(`${label} contains a citation or URL; citations belong only in sourceIds`);
  }
  if (/[\r\n]/.test(value)) {
    throw new Error(`${label} must be a single paragraph`);
  }
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

export function validateChangeSummary(summary: ChangeSummary, change: NormalizedChange): void {
  if (summary.changeId !== change.id) {
    throw new Error(`OpenRouter changed change ID ${change.id} to ${summary.changeId}`);
  }
  const allowedSources = new Set(change.sources.map((source) => source.id));
  for (const sourceId of summary.sourceIds) {
    if (!allowedSources.has(sourceId)) {
      throw new Error(`OpenRouter cited unknown source ${sourceId} for ${change.id}`);
    }
  }
  validateProse(summary.title, "title", 60);
  for (const [index, bullet] of summary.changes.entries()) {
    validateProse(bullet, `changes[${index}]`, 120);
      if (!/[.!?)\]]["']?$/.test(bullet)) {
        throw new Error(`changes[${index}] must end with sentence-ending punctuation`);
      }
  }
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
        validateChangeSummary(summary, change);
        return summary;
      }
    } catch (error) {
      if (!(typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT")) {
        console.warn(`Ignoring invalid cached summary for ${change.id}: ${errorMessage(error)}`);
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
              "Summarize only the supplied logical code change for non-technical users of the Trio app.",
              "Use no outside knowledge and make no unsupported claims.",
              "Write title as a short plain-language name for the change, at most 60 characters.",
              "Write changes as 1-5 very brief bullet points, each a complete short sentence ending with punctuation.",
              "Keep bullets well under 120 characters so they never get cut off mid-word.",
              "Each bullet states one thing that changed from the user's perspective, as a complete short sentence.",
              "Do not enumerate commits, files, tests, or subchanges. Synthesize the user-visible effect.",
              "Never put source IDs, citations, URLs, Markdown, or code-reference lists in title or changes.",
              "Put 1-4 exact supporting IDs only in sourceIds, preferring a PR and the most direct diff or commit.",
              "Copy changeId exactly. Select sourceIds only from supplied sources and copy those IDs without changes.",
              "Describe changes conservatively. Use humanReviewRequired when evidence is insufficient.",
              "Internal-only changes belong in internal-and-build-system. Origin provenance may use origin-only-customizations.",
              "Example of the desired output structure:",
              '{"changeId":"<exact changeId from input>","title":"Alert improvements","changes":["Unacknowledged alerts reappear after restarting Trio.","Old not-looping notifications are cleared.","Alarm sounds are easier to select and preview."],"category":"alerting-and-safety","sourceIds":["<exact source IDs from input>"],"confidence":"high","humanReviewRequired":false}',
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
        validateChangeSummary(candidate, change);
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

  async selectHighlights(changes: NormalizedChange[], summaries: ChangeSummary[]): Promise<string[]> {
    if (summaries.length === 0) {
      return [];
    }
    const input = summaries.map((summary) => ({
      changeId: summary.changeId,
      title: summary.title,
      changes: summary.changes,
      category: summary.category,
      humanReviewRequired: summary.humanReviewRequired,
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
              "Select up to five user-significant changes as build highlights.",
              "Return only exact supplied change IDs. Do not rewrite any prose.",
              "Do not select version bumps, tests, documentation, or internal build work unless no user-facing changes exist.",
              "Return only JSON matching the schema.",
              correction
            ].filter(Boolean).join("\n")
          },
          { role: "user", content: JSON.stringify(input) }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "trio_build_highlights", strict: true, schema: highlightSchema(changes) }
        },
        provider: { require_parameters: true }
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
      this.responseModel = response.model;
      try {
        const result = highlightOutputSchema.parse(parseContent(response.choices[0]?.message.content ?? null));
        this.validateHighlights(result.highlightChangeIds, changes);
        return result.highlightChangeIds;
      } catch (error) {
        if (attempt === VALIDATION_ATTEMPTS - 1) {
          throw error;
        }
        correction = [
          `The previous response failed validation: ${errorMessage(error)}`,
          `Allowed changeIds: ${changes.map((change) => change.id).join(", ")}`,
          "Return up to five unique exact identifiers."
        ].join("\n");
      }
    }
    throw new Error("OpenRouter did not return valid build highlights");
  }

  private validateHighlights(highlightChangeIds: string[], changes: NormalizedChange[]): void {
    const allowed = new Set(changes.map((change) => change.id));
    if (new Set(highlightChangeIds).size !== highlightChangeIds.length) {
      throw new Error("OpenRouter returned duplicate highlight IDs");
    }
    for (const changeId of highlightChangeIds) {
      if (!allowed.has(changeId)) {
        throw new Error(`OpenRouter returned unknown highlight ID: ${changeId}`);
      }
    }
  }
}
