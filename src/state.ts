import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { PROMPT_VERSION, SCHEMA_VERSION } from "./constants.js";
import { config } from "./config.js";
import type { GeneratorState } from "./types.js";

export function emptyState(): GeneratorState {
  return {
    version: 1,
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    processedRuns: {},
    successfulBuilds: []
  };
}

export async function loadState(): Promise<GeneratorState> {
  try {
    const state = JSON.parse(await readFile(config.statePath, "utf8")) as GeneratorState;
    if (state.version !== 1) {
      throw new Error(`Unsupported state version: ${state.version}`);
    }
    return state;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return emptyState();
    }
    throw error;
  }
}

export async function saveState(state: GeneratorState): Promise<void> {
  await mkdir(path.dirname(config.statePath), { recursive: true });
  const temporaryPath = `${config.statePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  await rename(temporaryPath, config.statePath);
}
