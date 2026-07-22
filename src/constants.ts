export const GENERATOR_VERSION = "0.3.1";
export const PROMPT_VERSION = "6";
export const SCHEMA_VERSION = "2";

export const CATEGORY_VALUES = [
  "new-features",
  "fixes",
  "algorithm-and-dosing",
  "pump-and-cgm",
  "alerting-and-safety",
  "interface-improvements",
  "origin-only-customizations",
  "internal-and-build-system",
  "known-concerns"
] as const;

export const CATEGORY_TITLES: Record<(typeof CATEGORY_VALUES)[number], string> = {
  "new-features": "New Features",
  fixes: "Fixes",
  "algorithm-and-dosing": "Algorithm and Dosing Changes",
  "pump-and-cgm": "Pump and CGM Changes",
  "alerting-and-safety": "Alerting and Safety Changes",
  "interface-improvements": "Interface Improvements",
  "origin-only-customizations": "Origin-Only Customizations",
  "internal-and-build-system": "Internal and Build-System Changes",
  "known-concerns": "Known Concerns"
};

export const SOURCE_REPOSITORY = "gordolio/Trio";
export const UPSTREAM_REPOSITORY = "nightscout/Trio";
export const SOURCE_WORKFLOW_FILE = "build_trio.yml";
export const SOURCE_BUILD_JOB_NAME = "Build";
export const SOURCE_ARTIFACT_NAME = "build-artifacts";
export const SUMMARY_CONCURRENCY = 5;
export const MAX_HIGHLIGHTS = 5;
