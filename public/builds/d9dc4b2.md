# Trio Build d9dc4b2

Built 2026-08-10T18:10:53.000Z from `eadcd72..d9dc4b2`.

## Highlights

- **Quick‑Pick Treatments**
  - Long-pressing the + button on the home screen now shows Quick‑Pick Treatments that suggest bolus and carb amounts.
  - You can pick a bolus amount, a carb amount, or both, then slide to confirm to enact the bolus and/or log the carbs.
  - If you have no carb history, carb suggestion buttons are not shown.
  - The app shows progress text while updating and displays clear alerts if carb logging or bolus enactment partially or完全y.
  - The old "Quick‑Pick Boluses" setting and labels are renamed to "Quick‑Pick Treatments" and existing user opt‑ins are 迁移.
  - [View source](https://github.com/nightscout/Trio/pull/1336)
- **Fix IOB chart shading and show projected IOB decay**
  - IOB shading no longer floats above the COB area and now hugs the IOB line.
  - A dashed projected IOB-decay line and faint future shading are shown in the COB/IOB chart.
  - Stale or out-of-window IOB projections are not rendered.
  - Selection dots are aligned to the stepped COB/IOB lines when inspecting values.
  - [View source](https://github.com/nightscout/Trio/pull/1382)
- **Fix snoozed alert countdown on Home screen**
  - Snoozed alerts on the Home screen now show the correct remaining minutes.
  - The countdown is measured from the current time so it no longer uses an outdated timer.
  - [View source](https://github.com/nightscout/Trio/pull/1390)
- **Target line spans full chart window**
  - Glucose target lines now extend across the full chart window.
  - Targets are repeated for every day shown instead of being limited to a fixed three-day span.
  - The target line no longer disappears when the chart history window grows.
  - [View source](https://github.com/nightscout/Trio/pull/1392)
- **Clarify ISF/CR picker label in override edit**
  - The ISF/CR picker label in the override edit form now reads "Also Inversely Change".
  - The override edit UI displays the updated label when choosing ISF/CR options.
  - [View source](https://github.com/nightscout/Trio/pull/1391)

## Interface Improvements

- **Chart info button restyled and moved up**
  - The chart’s info (glossary) button now matches the alarm bell visual style in the meal row.
  - The info button was nudged upward to avoid overlapping the chart’s x-axis labels.
  - The button’s behavior is unchanged and still opens the chart legend when tapped.
  - [View source](https://github.com/nightscout/Trio/pull/1396)

## Build Metadata

- Source workflow: [31416442288](https://github.com/gordolio/Trio/actions/runs/31416442288)
- Previous built commit: [`eadcd728f3f16d50c2df28a7ba5a1713464dd563`](https://github.com/gordolio/Trio/commit/eadcd728f3f16d50c2df28a7ba5a1713464dd563)
- Current built commit: [`d9dc4b2706e8832ca8e7090312febae3f47aaed9`](https://github.com/gordolio/Trio/commit/d9dc4b2706e8832ca8e7090312febae3f47aaed9)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
