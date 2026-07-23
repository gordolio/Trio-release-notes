import { execFile, spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { Readable, Transform } from "node:stream";
import plist from "plist";

const execFileAsync = promisify(execFile);
const MAX_ARTIFACT_BYTES = 600 * 1024 * 1024;
const MAX_IPA_BYTES = 1024 * 1024 * 1024;

class ByteLimit extends Transform {
  private bytes = 0;

  constructor(private readonly limit: number, private readonly label: string) {
    super();
  }

  override _transform(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null, data?: Buffer) => void): void {
    this.bytes += chunk.length;
    if (this.bytes > this.limit) {
      callback(new Error(`${this.label} exceeds the ${this.limit}-byte safety limit`));
      return;
    }
    callback(null, chunk);
  }
}

export interface ArtifactBuildMetadata {
  abbreviatedSha: string;
  buildDate: string | null;
}

export function parseBuildDetailsPlist(contents: string): ArtifactBuildMetadata {
  const parsed = plist.parse(contents) as Record<string, unknown>;
  const abbreviatedSha = parsed["com-trio-commit-sha"];
  const buildDate = parsed["com-trio-build-date"];
  if (typeof abbreviatedSha !== "string" || !/^[0-9a-f]{7,40}$/i.test(abbreviatedSha)) {
    throw new Error("BuildDetails.plist does not contain a valid com-trio-commit-sha");
  }
  return {
    abbreviatedSha: abbreviatedSha.toLowerCase(),
    buildDate: typeof buildDate === "string" ? buildDate : null
  };
}

export function findDirectBuildDetailsPlist(entries: string[]): string | null {
  const plistEntries = entries.filter((entry) => /^(?:(?:artifacts|release-notes)\/)?BuildDetails\.plist$/.test(entry));
  if (plistEntries.length > 1) {
    throw new Error(`Expected at most one direct BuildDetails.plist in the artifact, found ${plistEntries.length}`);
  }
  return plistEntries[0] ?? null;
}

async function unzipListing(archive: string): Promise<string[]> {
  const { stdout } = await execFileAsync("unzip", ["-Z1", archive], { maxBuffer: 10 * 1024 * 1024 });
  return stdout.split("\n").map((entry) => entry.trim()).filter(Boolean);
}

async function extractEntryToFile(archive: string, entry: string, destination: string): Promise<void> {
  const child = spawn("unzip", ["-p", archive, entry], { stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  const exit = new Promise<number | null>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });
  try {
    await pipeline(child.stdout, new ByteLimit(MAX_IPA_BYTES, "IPA"), createWriteStream(destination, { mode: 0o600 }));
  } catch (error) {
    child.kill();
    throw error;
  }
  const code = await exit;
  if (code !== 0) {
    throw new Error(`Unable to extract artifact entry: ${stderr.trim()}`);
  }
}

async function extractEntryText(archive: string, entry: string): Promise<string> {
  const { stdout } = await execFileAsync("unzip", ["-p", archive, entry], { maxBuffer: 2 * 1024 * 1024 });
  return stdout;
}

export async function downloadBuildMetadata(downloadUrl: string, token: string): Promise<ArtifactBuildMetadata> {
  const directory = await mkdtemp(path.join(tmpdir(), "trio-release-notes-"));
  const artifactPath = path.join(directory, "artifact.zip");
  const ipaPath = path.join(directory, "build.ipa");

  try {
    const response = await fetch(downloadUrl, {
      redirect: "follow",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!response.ok || !response.body) {
      throw new Error(`Artifact download failed with HTTP ${response.status}`);
    }
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_ARTIFACT_BYTES) {
      throw new Error(`Artifact exceeds the ${MAX_ARTIFACT_BYTES}-byte safety limit`);
    }
    await pipeline(
      Readable.fromWeb(response.body as never),
      new ByteLimit(MAX_ARTIFACT_BYTES, "Artifact"),
      createWriteStream(artifactPath, { mode: 0o600 })
    );

    const artifactEntries = await unzipListing(artifactPath);
    const directPlistEntry = findDirectBuildDetailsPlist(artifactEntries);
    if (directPlistEntry) {
      return parseBuildDetailsPlist(await extractEntryText(artifactPath, directPlistEntry));
    }

    // Historical artifacts stored metadata only inside the signed IPA.
    const ipaEntries = artifactEntries.filter((entry) => entry.toLowerCase().endsWith(".ipa"));
    if (ipaEntries.length !== 1 || !ipaEntries[0]) {
      throw new Error(`Expected one IPA in the artifact, found ${ipaEntries.length}`);
    }
    await extractEntryToFile(artifactPath, ipaEntries[0], ipaPath);

    const plistEntries = (await unzipListing(ipaPath)).filter((entry) =>
      /^Payload\/[^/]+\.app\/BuildDetails\.plist$/.test(entry)
    );
    if (plistEntries.length !== 1 || !plistEntries[0]) {
      throw new Error(`Expected one app BuildDetails.plist in the IPA, found ${plistEntries.length}`);
    }
    return parseBuildDetailsPlist(await extractEntryText(ipaPath, plistEntries[0]));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
