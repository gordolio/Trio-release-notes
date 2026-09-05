# Trio Build a9f7d9c

Built 2026-09-05T18:25:21.000Z from `7fcce38..a9f7d9c`.

## Highlights

- **Round basals to pump's actual supported rates**
  - Basal recommendations are now rounded against the actual paired pump's supported rates.
  - The pump is handed a bit-exact rate to avoid tiny numeric errors lowering the delivered dose.
  - An obsolete stored pump model setting was removed so the app no longer falls back to a bundled default.
  - This prevents unintended small drops in delivered basal rates for affected pumps.
  - [View source](https://github.com/nightscout/Trio/pull/1429)
- **Fix battery update after switching pumps**
  - Battery percent now updates after switching or onboarding a pump without restarting the app.
  - The home-screen battery icon shows the new pump's battery immediately after a swap.
  - The simulator seeds an initial battery row so a battery appears before its first status update.
  - [View source](https://github.com/nightscout/Trio/pull/1430)
- **Remove Medtronic Enlite CGM**
  - The Medtronic Enlite CGM option is removed from CGM device lists and settings.
  - Trio will no longer attempt to fetch glucose data from Enlite/Minilink devices.
  - Enlite-related names and localized strings have been removed from the app.
  - Enlite is no longer available as a selectable CGM type in setup sheets and dialogs.
  - [View source](https://github.com/nightscout/Trio/pull/1453)

## Build Metadata

- Source workflow: [33983016917](https://github.com/gordolio/Trio/actions/runs/33983016917)
- Previous built commit: [`7fcce388e2442b767baf37ca0fd03392639e7ae1`](https://github.com/gordolio/Trio/commit/7fcce388e2442b767baf37ca0fd03392639e7ae1)
- Current built commit: [`a9f7d9cde1df5aca63553711debc1a29a4f4d847`](https://github.com/gordolio/Trio/commit/a9f7d9cde1df5aca63553711debc1a29a4f4d847)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
