# Trio Build b5cba15

Built 2026-07-12T22:09:16.000Z from `16691d2..b5cba15`.

## Highlights

- **Show 'Initiating' when a bolus starts**
  - Trio now shows an 'initiating' state on the bolus progress view when a bolus is started.
  - The bolus progress indicator displays the initiating state until insulin delivery begins.
  - The initiating state text is included in the app localizations.
  - [View source](https://github.com/nightscout/Trio/pull/1211)
- **Copy SHA and version info from Settings**
  - You can select and copy the SHA and submodule names in the Settings view.
  - A copy button is added to the version header to copy full app version, branch, and SHA to the clipboard.
  - Copying now shows a brief "Copied" confirmation toast and provides haptic feedback.
  - Version copy was changed from a long-press gesture to a normal button for easier use.
  - [View source](https://github.com/nightscout/Trio/pull/1214)
- **Live Activity glucose forecast on lock screen**
  - Adds a new Display Glucose Forecasts toggle under Settings → Notifications → Live Activity, defaulting to off.
  - When enabled, the Live Activity lock-screen chart shows Oref glucose forecasts as either a cone or lines.
  - The forecast display type follows the existing Forecast Display Type setting in the main app.
  - Chart scaling and rendering were adjusted so forecast values fit the small lock-screen chart and remain readable.
  - [View source](https://github.com/nightscout/Trio/pull/1194)
- **Add Eversense CGM support**
  - Eversense is added as a selectable CGM option in the app.
  - Trio now includes support for Eversense CGM devices (E3 and 365).
  - The app embeds the EversenseKit framework so it can connect to Eversense sensors.
  - Optional upload to the Eversense DMS, including debug data, is available and can be opted out.
  - [View source](https://github.com/nightscout/Trio/pull/1131)

## Build Metadata

- Source workflow: [29210281377](https://github.com/gordolio/Trio/actions/runs/29210281377)
- Previous built commit: [`16691d214075c881255083e627c0b52cfdeb741c`](https://github.com/gordolio/Trio/commit/16691d214075c881255083e627c0b52cfdeb741c)
- Current built commit: [`b5cba1534785e5240cf78894f15d21a26e9e3b5b`](https://github.com/gordolio/Trio/commit/b5cba1534785e5240cf78894f15d21a26e9e3b5b)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
