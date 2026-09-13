# Trio Build dedcae7

Built 2026-09-13T22:46:31.000Z from `64e9bad..dedcae7`.

## Highlights

- **Glucose Bobble contact image for Contact Trick**
  - Adds a new "Glucose Bobble" contact image layout for the Contact Trick feature.
  - The Bobble shows a ring, a color-coded glucose number, and a rotating trend arrow.
  - You can toggle showing minutes-since-reading and showing the glucose delta beneath the number.
  - You can switch the glucose number between color and monochrome modes.
  - When Bobble is selected, other contact-image customization options are hidden and stale CGM readings are cleared so the.
  - [View source](https://github.com/nightscout/Trio/pull/1473)
- **Fix bolus and carb label positioning on iOS 27**
  - Bolus and carbohydrate amount labels now appear next to their triangle markers in the chart.
  - This fixes label misplacement that occurred when building with Xcode 27 / iOS 27.
  - Marker triangles look the same; only the label anchoring was adjusted.
  - [View source](https://github.com/nightscout/Trio/pull/1492)

## Build Metadata

- Source workflow: [34786921547](https://github.com/gordolio/Trio/actions/runs/34786921547)
- Previous built commit: [`64e9badf760470023832ffd15823c1b2f8edac6d`](https://github.com/gordolio/Trio/commit/64e9badf760470023832ffd15823c1b2f8edac6d)
- Current built commit: [`dedcae70f46adceb06c0c93679900d37bfac1fb6`](https://github.com/gordolio/Trio/commit/dedcae70f46adceb06c0c93679900d37bfac1fb6)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
