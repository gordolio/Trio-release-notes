# Trio Build e4eeb2c

Built 2026-09-20T12:11:56.000Z from `e3c9c40..e4eeb2c`.

## Highlights

- **Fix crash when deleting therapy schedule entries**
  - Deleting a time segment in ISF, glucose target, carb ratio, or basal editors no longer crashes the app.
  - Deleting an entry via swipe, context menu, or VoiceOver now reliably removes it without error.
  - The time/value picker remains stable if an entry is removed while it is open and will not cause a crash.
  - The same fix is applied to the four onboarding therapy-setting steps so they behave the same way.
  - [View source](https://github.com/nightscout/Trio/pull/1515)
- **Fix x-axis label alignment in charts**
  - X-axis time labels on the main chart and all stats charts are correctly aligned again.
  - The Glucose Distribution (by day) chart's missing x-axis labels are restored and visible.
  - Percentile and distribution-by-time chart labels are now centered on their marks for clearer alignment.
  - Removed redundant labels and added glucose units above the Percentile (by day) chart's y-axis.
  - [View source](https://github.com/nightscout/Trio/pull/1539)
- **Submodule updates: pump, CGM, and algorithm fixes**
  - Omnipod Bluetooth was improved, adding a better keep‑alive, an O5 beep fix, and more reliable connections.
  - DanaKit fixes corrected dose end dates and improved concurrency safety.
  - LibreLoop now clears standing CGM alerts correctly when a sensor is deleted.
  - Loop algorithm tweaks smooth insulin-on-board behavior and limit correction rates.
  - App translations were updated in several components.
  - [View source](https://github.com/nightscout/Trio/pull/1549)

## Build Metadata

- Source workflow: [35508888132](https://github.com/gordolio/Trio/actions/runs/35508888132)
- Previous built commit: [`e3c9c40f57bfc67bd880ec15c8cf2f932efe6406`](https://github.com/gordolio/Trio/commit/e3c9c40f57bfc67bd880ec15c8cf2f932efe6406)
- Current built commit: [`e4eeb2ce0aaeb219719a07558323377f7cfb6684`](https://github.com/gordolio/Trio/commit/e4eeb2ce0aaeb219719a07558323377f7cfb6684)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
