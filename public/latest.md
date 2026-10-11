# Trio Build d5db93a

Built 2026-10-11T13:32:43.000Z from `cb1c5b0..d5db93a`.

## Highlights

- **Stop repeated forecast and Carbs Required alerts**
  - Forecast (Low Glucose Soon) and Carbs Required alarms no longer re-trigger on every loop when a CGM app owns glucose‑by.
  - Only alarms driven by the current CGM reading are handed off to the CGM app when that option is enabled.
  - Forecast and Carbs Required alerts now remain active until they recover or are snoozed, instead of being cleared and re.
  - Alert behavior around CGM-owned readings is now more consistent and avoids duplicate notifications.
  - [View source](https://github.com/nightscout/Trio/pull/1573)
- **Prevent freeze when editing carb entries**
  - Editing a carb entry no longer sometimes hangs the app when switching back to the chart.
  - Saved carb edits no longer risk deleting the entry if an internal recalculation fails.
  - Chart updates are more stable because redundant internal updates are skipped.
  - Chart performance is improved when many basal segments are shown, reducing slowdowns.
  - [View source](https://github.com/nightscout/Trio/pull/1595)
- **Immediate update of glucose app badge**
  - Turning off Show Glucose App Badge removes the number from the app icon immediately.
  - Changing glucose units refreshes the app badge right away.
  - You no longer need to wait for the next reading or restart the app to update the badge.
  - [View source](https://github.com/nightscout/Trio/pull/1624)

## Build Metadata

- Source workflow: [38142385389](https://github.com/gordolio/Trio/actions/runs/38142385389)
- Previous built commit: [`cb1c5b0f02f8a0650ddf53a568f046bbdb5f413e`](https://github.com/gordolio/Trio/commit/cb1c5b0f02f8a0650ddf53a568f046bbdb5f413e)
- Current built commit: [`d5db93ac6154872d1dca220942a1e8cca6ad4892`](https://github.com/gordolio/Trio/commit/d5db93ac6154872d1dca220942a1e8cca6ad4892)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
