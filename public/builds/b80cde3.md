# Trio Build b80cde3

Built 2026-10-27T00:29:47.000Z from `141ccc8..b80cde3`.

## Highlights

- **Add Settings Tests hub and basal test**
  - A new Settings Tests entry in Therapy Settings adds guided basal testing.
  - You can run readiness checks and see saved outcomes after a test finishes.
  - [View source](https://github.com/gordolio/Trio/commit/ac25cd04585323573e68b7442506f8ad52d2db1f)

## Internal and Build-System Changes

- **Choose TestFlight groups for manual builds**
  - When triggering a manual build, you can limit recipients by selecting TestFlight groups.
  - If no groups are selected, the build is uploaded the usual way.
  - [View source](https://github.com/gordolio/Trio/commit/ce9df3faf87e3cd326ba00c870978ade36eb159d)
- **Skip Beta App Review for Internal TestFlight**
  - Internal TestFlight builds no longer require Beta App Review when sent to internal groups.
  - Internal testers will receive builds without an extra beta review step.
  - [View source](https://github.com/gordolio/Trio/commit/b80cde33c451dcc89b75c6f0933ab3ad13372a96)

## Build Metadata

- Source workflow: [40424160425](https://github.com/gordolio/Trio/actions/runs/40424160425)
- Previous built commit: [`141ccc8809cd6caa34bac60a91959d5387f48cdb`](https://github.com/gordolio/Trio/commit/141ccc8809cd6caa34bac60a91959d5387f48cdb)
- Current built commit: [`b80cde33c451dcc89b75c6f0933ab3ad13372a96`](https://github.com/gordolio/Trio/commit/b80cde33c451dcc89b75c6f0933ab3ad13372a96)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
