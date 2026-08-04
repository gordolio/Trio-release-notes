# Trio Build 4bc2bc8

Built 2026-08-04T01:39:21.000Z from `e36c202..4bc2bc8`.

## Highlights

- **Add Accu-Chek SmartGuide CGM**
  - Trio adds support for the Accu-Chek SmartGuide continuous glucose monitor.
  - Accu-Chek SmartGuide is now available in the app's CGM selection and pairing options.
  - The device name is included in the app localizations so it appears in the user's language.
  - [View source](https://github.com/nightscout/Trio/pull/1292)
- **Show forecasts on Apple Watch**
  - The Apple Watch view can display glucose forecasts and predicted ranges on the chart.
  - A new Watch configuration option lets you enable forecasts on the Apple Watch.
  - When enabled, the watch chart can show either a forecast cone or distinct forecast lines.
  - The chart’s vertical scale expands automatically to include forecast values so future data is visible.
  - [View source](https://github.com/nightscout/Trio/pull/1306)
- **Telemetry & crash reports enabled by default**
  - Telemetry and crash reporting are now enabled by default for new and updated installs.
  - The onboarding diagnostics step and the one-time telemetry migration sheet have been removed.
  - You can opt out at any time in Settings → Features → App Diagnostics.
  - The app privacy policy was updated to reflect the new default and wording changes.
  - [View source](https://github.com/nightscout/Trio/pull/1322)
- **Garmin watches: dynamic glucose color and target**
  - Compatible Garmin watchfaces can now use Trio's glucose color scheme to color BG values.
  - The scheduled glucose target from your profile is sent to compatible Garmin watch apps.
  - Changes to the color scheme or profile target are pushed to the watch shortly after you edit them.
  - Multiple quick setting edits are grouped so the watch receives updates after a short delay.
  - [View source](https://github.com/nightscout/Trio/pull/1364)
- **Smarter pump BLE heartbeat handling**
  - The pump will help wake the app when the CGM cannot wake it on its own.
  - If your CGM provides its own BLE heartbeat, the app will stop asking the pump for heartbeats.
  - Heartbeat requests are refreshed when you connect or switch pumps and when the app returns to the foreground.
  - Required LoopKit/OmnipodKit updates are included to support this behavior.
  - [View source](https://github.com/nightscout/Trio/pull/1368)

## New Features

- **Add Accu-Chek SmartGuide CGM**
  - Trio (dev) now supports the Accu-Chek SmartGuide CGM.
  - The sensor is a 14-day CGM and does not connect directly to insulin pumps.
  - You must calibrate the sensor at the 12-hour mark and again 30 minutes later.
  - The first calibration stays open until you enter it via Trio or the official app.
  - If you miss the second calibration window (must be within 2.5 hours of the first), you must restart the startup process.
  - [View source](https://github.com/nightscout/Trio/pull/1310)

## Pump and CGM Changes

- **Accu-Chek integration update**
  - Accu-Chek meter support was updated.
  - Connection and reconnect behavior for Accu-Chek meters was improved.
  - Calibration now uses an updated starting glucose value.
  - [View source](https://github.com/nightscout/Trio/pull/1370)
- **Eversense E3/365 and Accu-Chek added to supported CGMs**
  - Eversense E3/365 is now listed as a supported CGM in the app.
  - Accu-Chek SmartGuide is now listed as a supported CGM in the app.
  - [View source](https://github.com/nightscout/Trio/pull/1376)

## Build Metadata

- Source workflow: [30868495728](https://github.com/gordolio/Trio/actions/runs/30868495728)
- Previous built commit: [`e36c2021def0f85b3d23caf79715e43933d39810`](https://github.com/gordolio/Trio/commit/e36c2021def0f85b3d23caf79715e43933d39810)
- Current built commit: [`4bc2bc8f33cad361014ebd6d577c1353eed22726`](https://github.com/gordolio/Trio/commit/4bc2bc8f33cad361014ebd6d577c1353eed22726)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
