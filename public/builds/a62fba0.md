# Trio Build a62fba0

Built 2026-06-28T08:13:39.000Z from `cdb2b48..a62fba0`.

## Highlights

- **More reliable bolus progress reporting**
  - Bolus progress updates are now handled on a single internal queue to avoid race conditions.
  - Creating and clearing the bolus progress reporter are serialized so rapid start/stop transitions don't overwrite each -.
  - The app now more reliably reports bolus progress and clears the progress display when a bolus finishes.
  - [View source](https://github.com/nightscout/Trio/pull/1227)
- **Recover from expired Core Data history token**
  - Trio now detects when the Core Data persistent history token has expired.
  - Trio clears the stale token and attempts to replay recent database changes.
  - If replay fails, Trio refreshes all stored data and switches to the current token so updates continue.
  - [View source](https://github.com/nightscout/Trio/pull/1247)

## Internal and Build-System Changes

- **Reorganize Xcode project file**
  - The Xcode project configuration (project.pbxproj) was reorganized.
  - Many source file references were added, removed, or reordered in the project settings.
  - This change only updates build and file references used by developers.
  - There are no user-facing feature or behavior changes in the app.
  - [View source](https://github.com/gordolio/Trio/commit/90dd1b0e509c73b0b62d21a40e7bedd8377a8ead)

## Build Metadata

- Source workflow: [28315793999](https://github.com/gordolio/Trio/actions/runs/28315793999)
- Previous built commit: [`cdb2b482b0815244288958ddd4169c921ebbeb43`](https://github.com/gordolio/Trio/commit/cdb2b482b0815244288958ddd4169c921ebbeb43)
- Current built commit: [`a62fba08d239db8a6ca6991726e794458bc05972`](https://github.com/gordolio/Trio/commit/a62fba08d239db8a6ca6991726e794458bc05972)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
