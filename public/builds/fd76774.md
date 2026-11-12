# Trio Build fd76774

Built 2026-11-12T01:14:47.000Z from `57a6734..fd76774`.

## Highlights

- **Prevent zero-unit boluses and expire stale entries**
  - The Watch refuses and won't send 0 U bolus requests, showing an error message.
  - Processing screens now time out and entries older than 2 minutes are cleared and not sent.
  - [View source](https://github.com/nightscout/Trio/pull/1751)
- **Fix front-camera cropping and mirroring**
  - Front-camera photos now crop correctly to the scan frame.
  - Front-camera photos no longer trigger a mirroring error.
  - [View source](https://github.com/gordolio/Trio/pull/32)
- **Respect custom app display name**
  - iPhone will show the app's configured display name instead of always showing "Trio".
  - If you changed the app display name, your chosen name will now appear.
  - [View source](https://github.com/nightscout/Trio/pull/1767)
- **Tidepool login alerts and UI indicator**
  - Trio alerts you when Tidepool login is rejected and shows a Login Required indicator.
  - Home and Settings show the status and let you open Tidepool settings.
  - [View source](https://github.com/nightscout/Trio/pull/1706)

## Build Metadata

- Source workflow: [43130885490](https://github.com/gordolio/Trio/actions/runs/43130885490)
- Previous built commit: [`57a6734bdd33bd98bd05d0de0f31c0ce879b16f6`](https://github.com/gordolio/Trio/commit/57a6734bdd33bd98bd05d0de0f31c0ce879b16f6)
- Current built commit: [`fd76774cc9033f5903c715ea5731d25205a6f979`](https://github.com/gordolio/Trio/commit/fd76774cc9033f5903c715ea5731d25205a6f979)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
