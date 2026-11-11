# Trio Build 57a6734

Built 2026-11-11T04:00:19.000Z from `9fdbdc8..57a6734`.

## Highlights

- **Consistent percent formatting and rounding**
  - Percent values now follow the user's locale and round correctly.
  - Screens show consistent percent text (no trailing .0) and translated adjustment footers.
  - [View source](https://github.com/nightscout/Trio/pull/1727)
- **Unified, localized duration and time-ago text**
  - Durations and "time ago" labels now follow your device language and use a consistent compact format.
  - VoiceOver will speak durations with correct words and plurals (e.g., "1 hour, 30 minutes").
  - [View source](https://github.com/nightscout/Trio/pull/1743)
- **Redact signed-out Dexcom Share accounts**
  - Log exports now redact Dexcom Share account names even if they were signed out.
  - Exported logs show a generic account placeholder instead of the real name.
  - [View source](https://github.com/nightscout/Trio/pull/1756)
- **Fix Medtrum alarm crash loop**
  - App no longer repeatedly crashes when Medtrum pump alarms occur.
  - Deleting devices should no longer cause intermittent errors.
  - [View source](https://github.com/nightscout/Trio/pull/1757)
- **Delay database open until first unlock**
  - Trio waits for the first device unlock before opening its database to avoid startup failures.
  - After unlocking, Trio will start itself instead of staying on the "Oops, something went wrong" screen.
  - [View source](https://github.com/nightscout/Trio/pull/1672)

## Fixes

- **Food camera rotation fix for iPhone Duo**
  - Food camera preview and photos now appear upright on iPhone Duo.
  - Switching cameras no longer produces upside-down or mis-cropped pictures.
  - [View source](https://github.com/gordolio/Trio/pull/31)

## Build Metadata

- Source workflow: [42954436914](https://github.com/gordolio/Trio/actions/runs/42954436914)
- Previous built commit: [`9fdbdc8ec4e65fba22ac05df899ea5d6b0a7638f`](https://github.com/gordolio/Trio/commit/9fdbdc8ec4e65fba22ac05df899ea5d6b0a7638f)
- Current built commit: [`57a6734bdd33bd98bd05d0de0f31c0ce879b16f6`](https://github.com/gordolio/Trio/commit/57a6734bdd33bd98bd05d0de0f31c0ce879b16f6)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
