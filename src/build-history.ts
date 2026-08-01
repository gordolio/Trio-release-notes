import type { BuildIdentity, StoredBuild } from "./types.js";

export type AncestorCheck = (ancestorSha: string, descendantSha: string) => Promise<boolean>;

export async function newestStoredAncestor(
  builds: StoredBuild[],
  current: BuildIdentity,
  isAncestor: AncestorCheck
): Promise<StoredBuild | null> {
  const currentCreatedAt = new Date(current.run.createdAt).valueOf();
  const candidates = builds
    .filter(
      (build) =>
        build.runId !== current.run.id &&
        new Date(build.builtAt).valueOf() < currentCreatedAt
    )
    .sort((left, right) => {
      const dateDifference = new Date(right.builtAt).valueOf() - new Date(left.builtAt).valueOf();
      return dateDifference || right.runId - left.runId;
    });

  for (const candidate of candidates) {
    if (await isAncestor(candidate.fullSha, current.fullSha)) {
      return candidate;
    }
  }
  return null;
}
