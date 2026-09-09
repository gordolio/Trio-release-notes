# Trio Build cddb153

Built 2026-09-09T14:52:49.000Z from `c7a33c7..cddb153`.

## Highlights

- **Show real pump failure instead of blaming authentication**
  - The app shows the pump's real reason when a Quick-Pick bolus fails, instead of always blaming Face ID/Touch ID.
  - If carbs were logged but the bolus failed, the alert will include the pump's failure message when available.
  - If biometric authentication actually failed, the app still shows the authentication error message.
  - [View source](https://github.com/nightscout/Trio/pull/1405)
- **Refreshed Pump and CGM settings screens**
  - Pump and CGM settings screens use a cleaner list layout with improved spacing and background styling.
  - Connected pumps and CGMs appear as larger centered buttons showing the device image and name.
  - Add Pump and Add CGM actions are more prominent and include a help button with device hints.
  - The Smooth Glucose help text was rewritten with clearer bullet points explaining smoothing behavior.
  - [View source](https://github.com/nightscout/Trio/pull/1471)

## Build Metadata

- Source workflow: [34364474546](https://github.com/gordolio/Trio/actions/runs/34364474546)
- Previous built commit: [`c7a33c7c7d50d8bbd6e6d017b134a5d6c8f5bc8a`](https://github.com/gordolio/Trio/commit/c7a33c7c7d50d8bbd6e6d017b134a5d6c8f5bc8a)
- Current built commit: [`cddb153e648cc18037a6acca16b1d3a3a9dd0e44`](https://github.com/gordolio/Trio/commit/cddb153e648cc18037a6acca16b1d3a3a9dd0e44)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
