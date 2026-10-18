# Trio Build 377fac0

Built 2026-10-18T03:42:40.000Z from `cbfde60..377fac0`.

## Highlights

- **New Home Statistics Range setting**
  - A new Home Statistics Range setting lets you pick Today, Last 24 Hours, Last 7 Days, Last Month, or Last 3 Months for.
  - The home stats panel updates its numbers and labels to reflect the chosen time span.
  - Tapping the home stats panel opens the full Statistics view on the same selected span.
  - Short spans (Today, Last 24 Hours) use the chart's in-memory data; longer spans fetch older readings in the background,.
  - Background refreshes for longer spans are throttled so updates occur at most once every 5 minutes.
  - [View source](https://github.com/nightscout/Trio/pull/1590)
- **Avoid startup overwrite of restored pump state**
  - Trio now saves a restored pump's state on the pump's processing (background) queue during startup.
  - This prevents a timing issue where an older snapshot could overwrite a newer pump state at launch.
  - Legacy saved pump data is cleared only after the new pump state is written to storage.
  - [View source](https://github.com/nightscout/Trio/pull/1606)
- **Add Glycemia Risk Index to Stats**
  - Adds a Glycemia Risk Index (GRI) option to the Stats screen.
  - Shows a GRI tile with a numeric score, risk zone, and an info button opening a detailed sheet.
  - Calculates GRI from glucose readings and shows component breakdown, weighted contributions, and a 0–100 capped score.
  - Includes a risk-grid chart and displays a placeholder when there is no glucose data.
  - [View source](https://github.com/nightscout/Trio/pull/1642)
- **Fix glucose colors in comma-decimal locales**
  - Glucose colors on the lock screen, Dynamic Island, and contact image are now correct for mmol/L users in comma-decimal-.
  - +using locales.
  - Live Activity now shares the same color logic as the main app so colors match across app, lock screen, and Dynamic I‌s­.
  - The app uses the numeric glucose value in mg/dL instead of parsing formatted text to decide colors, preventing wrong 색.
  - The expired Live Activity "--" state is now shown as in-range for mmol users as it is for mg/dL users.
  - [View source](https://github.com/nightscout/Trio/pull/1644)

## Build Metadata

- Source workflow: [39093810456](https://github.com/gordolio/Trio/actions/runs/39093810456)
- Previous built commit: [`cbfde6099b3ef0b5bac97a2df7f141e10f0d6fa8`](https://github.com/gordolio/Trio/commit/cbfde6099b3ef0b5bac97a2df7f141e10f0d6fa8)
- Current built commit: [`377fac0a2bef2c3e3bf1acb4162fa1e6b54772f9`](https://github.com/gordolio/Trio/commit/377fac0a2bef2c3e3bf1acb4162fa1e6b54772f9)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
