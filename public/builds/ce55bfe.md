# Trio Build ce55bfe

Built 2026-07-29T05:04:13.000Z from `b0c6307..ce55bfe`.

## Highlights

- **Cancel scheduled runs when nothing changed**
  - Scheduled weekly runs that find no code changes are now cancelled and show as cancelled (grey) instead of appearing as.
  - A green checkmark on a scheduled run now guarantees a new build was made and uploaded to TestFlight.
  - Build tooling was updated to fastlane 2.236.1 and to use Xcode 26.5 for building.
  - [View source](https://github.com/nightscout/Trio/pull/1352)
- **Fix mac build script and package location**
  - The Package.swift manifest was moved into an AlgorithmPackage subdirectory to avoid opening the wrong package in Xcode.
  - macOS build and test commands now run with the AlgorithmPackage path instead of a root package.
  - CI workflow cache paths and keys were updated to use AlgorithmPackage for algorithm tests.
  - This change only affects how the project is built and tested and does not change app features or behavior for users.
  - [View source](https://github.com/nightscout/Trio/pull/1353)

## Build Metadata

- Source workflow: [30423175304](https://github.com/gordolio/Trio/actions/runs/30423175304)
- Previous built commit: [`b0c6307f960ebd21a539893d472ca91138bda0fe`](https://github.com/gordolio/Trio/commit/b0c6307f960ebd21a539893d472ca91138bda0fe)
- Current built commit: [`ce55bfe418ce0fbd80c8edaa36b2cb4bb941c25a`](https://github.com/gordolio/Trio/commit/ce55bfe418ce0fbd80c8edaa36b2cb4bb941c25a)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
