import { Octokit } from "@octokit/rest";
import { config } from "./config.js";
import type { PullRequestRecord, WorkflowRunInfo } from "./types.js";

class IneligibleBuildError extends Error {}

export class GitHubClient {
  readonly octokit: Octokit;

  constructor(token = config.githubToken) {
    this.octokit = new Octokit({ auth: token });
  }

  async getRun(runId: number): Promise<WorkflowRunInfo> {
    const { data } = await this.octokit.rest.actions.getWorkflowRun({
      ...config.sourceRepository,
      run_id: runId
    });

    return {
      id: data.id,
      name: data.name ?? "",
      path: data.path ?? "",
      headBranch: data.head_branch ?? "",
      headSha: data.head_sha,
      status: data.status,
      conclusion: data.conclusion,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      url: data.html_url
    };
  }

  async assertSuccessfulBuild(run: WorkflowRunInfo): Promise<void> {
    if (!run.path.endsWith(`/${config.workflowFile}`)) {
      throw new IneligibleBuildError(`Run ${run.id} is not the ${config.workflowFile} workflow`);
    }
    const jobs = await this.octokit.paginate(this.octokit.rest.actions.listJobsForWorkflowRun, {
      ...config.sourceRepository,
      run_id: run.id,
      filter: "latest",
      per_page: 100
    });
    const buildJobs = jobs.filter((job) => job.name === config.buildJobName);
    if (buildJobs.length !== 1 || buildJobs[0]?.conclusion !== "success") {
      const result = buildJobs.map((job) => job.conclusion).join(", ") || "missing";
      throw new IneligibleBuildError(`Run ${run.id} does not have one successful ${config.buildJobName} job (${result})`);
    }
  }

  async isSuccessfulBuild(run: WorkflowRunInfo): Promise<boolean> {
    try {
      await this.assertSuccessfulBuild(run);
      return true;
    } catch (error) {
      if (error instanceof IneligibleBuildError) {
        return false;
      }
      throw error;
    }
  }

  async getArtifactDownloadUrl(runId: number): Promise<string> {
    const artifacts = await this.octokit.paginate(this.octokit.rest.actions.listWorkflowRunArtifacts, {
      ...config.sourceRepository,
      run_id: runId,
      per_page: 100
    });
    const artifact = artifacts.find((candidate) => candidate.name === config.artifactName && !candidate.expired);
    if (!artifact) {
      throw new Error(`Run ${runId} has no unexpired ${config.artifactName} artifact`);
    }
    return artifact.archive_download_url;
  }

  async listRunsSince(cutoff: Date): Promise<WorkflowRunInfo[]> {
    const runs: WorkflowRunInfo[] = [];
    for await (const response of this.octokit.paginate.iterator(this.octokit.rest.actions.listWorkflowRuns, {
      ...config.sourceRepository,
      workflow_id: config.workflowFile,
      status: "completed",
      per_page: 100
    })) {
      for (const run of response.data) {
        if (new Date(run.created_at) < cutoff) {
          return runs;
        }
        runs.push({
          id: run.id,
          name: run.name ?? "",
          path: run.path ?? "",
          headBranch: run.head_branch ?? "",
          headSha: run.head_sha,
          status: run.status,
          conclusion: run.conclusion,
          createdAt: run.created_at,
          updatedAt: run.updated_at,
          url: run.html_url
        });
      }
    }
    return runs;
  }

  async findPreviousSuccessfulRun(current: WorkflowRunInfo): Promise<WorkflowRunInfo | null> {
    for await (const response of this.octokit.paginate.iterator(this.octokit.rest.actions.listWorkflowRuns, {
      ...config.sourceRepository,
      workflow_id: config.workflowFile,
      branch: current.headBranch,
      status: "completed",
      per_page: 100
    })) {
      for (const run of response.data) {
        if (run.id === current.id || new Date(run.created_at) >= new Date(current.createdAt)) {
          continue;
        }
        const candidate: WorkflowRunInfo = {
          id: run.id,
          name: run.name ?? "",
          path: run.path ?? "",
          headBranch: run.head_branch ?? "",
          headSha: run.head_sha,
          status: run.status,
          conclusion: run.conclusion,
          createdAt: run.created_at,
          updatedAt: run.updated_at,
          url: run.html_url
        };
        if (await this.isSuccessfulBuild(candidate)) {
          return candidate;
        }
      }
    }
    return null;
  }

  async associatedPullRequests(repository: { owner: string; repo: string }, sha: string): Promise<PullRequestRecord[]> {
    try {
      const pulls = await this.octokit.paginate(this.octokit.rest.repos.listPullRequestsAssociatedWithCommit, {
        ...repository,
        commit_sha: sha,
        per_page: 100
      });
      return pulls.map((pull) => ({
        repository: `${repository.owner}/${repository.repo}`,
        number: pull.number,
        title: pull.title,
        body: pull.body ?? "",
        labels: pull.labels.map((label) => (typeof label === "string" ? label : label.name ?? "")).filter(Boolean),
        url: pull.html_url,
        mergedAt: pull.merged_at
      }));
    } catch (error) {
      const status = typeof error === "object" && error !== null && "status" in error ? error.status : null;
      if (status === 404 || status === 422) {
        return [];
      }
      throw error;
    }
  }
}
