import { z } from "zod";
import { CATEGORY_VALUES } from "./constants.js";

export type Provenance = "upstream" | "origin" | "mixed" | "internal";
export type Confidence = "high" | "medium" | "low";
export type Category = (typeof CATEGORY_VALUES)[number];

export interface WorkflowRunInfo {
  id: number;
  name: string;
  path: string;
  headBranch: string;
  headSha: string;
  status: string | null;
  conclusion: string | null;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface BuildIdentity {
  run: WorkflowRunInfo;
  abbreviatedSha: string;
  fullSha: string;
  buildDate: string;
}

export interface CommitRecord {
  sha: string;
  parents: string[];
  author: string;
  authoredAt: string;
  subject: string;
  body: string;
  files: string[];
  isUpstream: boolean;
  isUpstreamSyncMerge: boolean;
}

export interface ChangedFile {
  path: string;
  previousPath?: string;
  status: string;
}

export interface PullRequestRecord {
  repository: string;
  number: number;
  title: string;
  body: string;
  labels: string[];
  url: string;
  mergedAt: string | null;
}

export interface SourceEvidence {
  id: string;
  type: "pull-request" | "commit" | "file" | "diff";
  title: string;
  text: string;
  url: string;
}

export interface NormalizedChange {
  id: string;
  provenance: Provenance;
  commits: CommitRecord[];
  pullRequests: PullRequestRecord[];
  files: string[];
  sources: SourceEvidence[];
  patchTruncated: boolean;
}

export const changeSummarySchema = z.object({
  changeId: z.string(),
  title: z.string().min(1).max(60),
  changes: z.array(z.string().min(1).max(120)).min(1).max(5),
  category: z.enum(CATEGORY_VALUES),
  sourceIds: z.array(z.string()).min(1).max(4),
  confidence: z.enum(["high", "medium", "low"]),
  humanReviewRequired: z.boolean()
});

export type ChangeSummary = z.infer<typeof changeSummarySchema>;

export const highlightOutputSchema = z.object({
  highlightChangeIds: z.array(z.string()).max(5)
});

export interface ReportSource {
  id: string;
  type: SourceEvidence["type"];
  title: string;
  url: string;
}

export interface ReportItem extends ChangeSummary {
  changeIds: string[];
  highlight: boolean;
  provenance: Provenance;
  sources: ReportSource[];
}

export interface BuildReport {
  schemaVersion: string;
  metadata: {
    sourceWorkflowRunId: number;
    sourceWorkflowRunUrl: string;
    sourceBranch: string;
    previousBuiltSha: string;
    currentBuiltSha: string;
    shortSha: string;
    buildDate: string;
    generationDate: string;
    generatorVersion: string;
    promptVersion: string;
    model: string;
  };
  highlights: ReportItem[];
  categories: Array<{ category: Category; title: string; items: ReportItem[] }>;
  maintenanceHotspots: string[];
  includedPullRequests: PullRequestRecord[];
  includedCommits: Array<Pick<CommitRecord, "sha" | "subject" | "author" | "authoredAt">>;
  includedFiles: ChangedFile[];
}

export interface StoredBuild {
  runId: number;
  branch: string;
  fullSha: string;
  shortSha: string;
  builtAt: string;
  reportPath: string | null;
}

export interface GeneratorState {
  version: number;
  promptVersion: string;
  schemaVersion: string;
  processedRuns: Record<string, { fullSha: string; reportPath: string; processedAt: string }>;
  successfulBuilds: StoredBuild[];
}
