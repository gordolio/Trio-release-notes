# Trio Build 64e9bad

Built 2026-09-13T15:51:54.000Z from `544fd2c..64e9bad`.

## Highlights

- **Finalize pump events and record scheduled basal**
  - Pump doses now finalize with actual delivered amounts instead of keeping only the initial command.
  - Gaps with no pump reports are filled by recorded scheduled-basal rows so the app tracks expected basal delivery.
  - Scheduled-basal rows are excluded from command inputs and are not uploaded to Nightscout/Health/Tidepool.
  - Temporary in-flight (mutable) doses update in place until finalized, and uploads send finalized doses only.
  - TDD totals and the basal chart use recorded delivered values and consume scheduled-basal rows where present.
  - [View source](https://github.com/nightscout/Trio/pull/1300)

## Build Metadata

- Source workflow: [34765948390](https://github.com/gordolio/Trio/actions/runs/34765948390)
- Previous built commit: [`544fd2c5fb63a4b1647207a90a909c32e2f5e895`](https://github.com/gordolio/Trio/commit/544fd2c5fb63a4b1647207a90a909c32e2f5e895)
- Current built commit: [`64e9badf760470023832ffd15823c1b2f8edac6d`](https://github.com/gordolio/Trio/commit/64e9badf760470023832ffd15823c1b2f8edac6d)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
