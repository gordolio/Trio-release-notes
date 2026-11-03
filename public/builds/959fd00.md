# Trio Build 959fd00

Built 2026-11-03T22:23:31.000Z from `e526f43..959fd00`.

## Highlights

- **Fix critical alarms and AlarmKit permissions**
  - Critical glucose alarms now keep sounding only for their alert and ring once for a bounded burst.
  - Existing users will be prompted for AlarmKit permission so system alarms can replace in-app audio.
  - [View source](https://github.com/nightscout/Trio/pull/1716)
- **Basal test alignment and clearer results**
  - Basal testing now follows Trio docs (4-hour minimum fast, 10% step) and shows clearer results.
  - Results include supporting formulas, docs links, fasting SMB history and which basal periods were tested.
  - [View source](https://github.com/gordolio/Trio/pull/25)

## Internal and Build-System Changes

- **Remove LoopAlgorithm submodule**
  - Removed the LoopAlgorithm module from Trio.
  - Users will see no change to dosing or saved device state.
  - [View source](https://github.com/nightscout/Trio/pull/1726)

## Build Metadata

- Source workflow: [41727038980](https://github.com/gordolio/Trio/actions/runs/41727038980)
- Previous built commit: [`e526f43945658865b48882cf2065fadbbc7c0065`](https://github.com/gordolio/Trio/commit/e526f43945658865b48882cf2065fadbbc7c0065)
- Current built commit: [`959fd00e76bd4db2fcbc32def848408656a8d7d3`](https://github.com/gordolio/Trio/commit/959fd00e76bd4db2fcbc32def848408656a8d7d3)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
