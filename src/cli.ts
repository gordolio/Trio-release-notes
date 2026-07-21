#!/usr/bin/env node
import { access } from "node:fs/promises";
import { config, requireRuntimeConfiguration } from "./config.js";
import { generateForRun, processRunsSince } from "./generator.js";

function option(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

function positiveInteger(value: string | null, label: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function monthsAgo(months: number): Date {
  const cutoff = new Date();
  const day = cutoff.getUTCDate();
  cutoff.setUTCDate(1);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  const lastDay = new Date(Date.UTC(cutoff.getUTCFullYear(), cutoff.getUTCMonth() + 1, 0)).getUTCDate();
  cutoff.setUTCDate(Math.min(day, lastDay));
  return cutoff;
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main(): Promise<void> {
  requireRuntimeConfiguration();
  await access(config.sourceCheckout);
  const command = process.argv[2];
  if (command === "generate") {
    await generateForRun(positiveInteger(option("--run-id"), "--run-id"));
    return;
  }
  if (command === "backfill") {
    await processRunsSince(monthsAgo(positiveInteger(option("--months"), "--months")));
    return;
  }
  if (command === "reconcile") {
    await processRunsSince(daysAgo(positiveInteger(option("--days") ?? "30", "--days")));
    return;
  }
  throw new Error("Usage: generate --run-id <id> | backfill --months <months> | reconcile [--days <days>]");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
