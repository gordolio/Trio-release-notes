import path from "node:path";
import {
  SOURCE_ARTIFACT_NAME,
  SOURCE_BUILD_JOB_NAME,
  SOURCE_REPOSITORY,
  SOURCE_WORKFLOW_FILE,
  SOURCE_WORKFLOW_NAME,
  UPSTREAM_REPOSITORY
} from "./constants.js";

function splitRepository(value: string): { owner: string; repo: string } {
  const [owner, repo, extra] = value.split("/");
  if (!owner || !repo || extra) {
    throw new Error(`Invalid repository name: ${value}`);
  }
  return { owner, repo };
}

const root = process.cwd();

export const config = {
  root,
  publicDir: path.join(root, "public"),
  statePath: path.join(root, "data", "state.json"),
  cacheDir: path.join(root, "data", "cache", "changes"),
  sourceCheckout: path.resolve(process.env.TRIO_CHECKOUT_PATH ?? path.join(root, ".source", "Trio")),
  sourceRepository: splitRepository(process.env.TRIO_REPOSITORY ?? SOURCE_REPOSITORY),
  upstreamRepository: splitRepository(process.env.TRIO_UPSTREAM_REPOSITORY ?? UPSTREAM_REPOSITORY),
  workflowFile: process.env.TRIO_WORKFLOW_FILE ?? SOURCE_WORKFLOW_FILE,
  workflowName: process.env.TRIO_WORKFLOW_NAME ?? SOURCE_WORKFLOW_NAME,
  buildJobName: process.env.TRIO_BUILD_JOB_NAME ?? SOURCE_BUILD_JOB_NAME,
  artifactName: process.env.TRIO_ARTIFACT_NAME ?? SOURCE_ARTIFACT_NAME,
  githubToken: process.env.TRIO_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN ?? "",
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
  openRouterModel: process.env.OPENROUTER_MODEL ?? "openai/gpt-5-mini",
  siteUrl: process.env.RELEASE_NOTES_SITE_URL ?? "https://gordolio.github.io/Trio-release-notes",
  maxPatchCharacters: Number.parseInt(process.env.MAX_PATCH_CHARACTERS ?? "50000", 10)
};

export function requireRuntimeConfiguration(): void {
  if (!config.githubToken) {
    throw new Error("TRIO_GITHUB_TOKEN is required");
  }
  if (!config.openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is required");
  }
}
