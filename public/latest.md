# Trio Build 943bd28

Built 2026-10-06T17:42:43.000Z from `d127bb4..943bd28`.

## Highlights

- **Automatic frontier model selection**
  - Frontier choices in AI settings now resolve to the current model from a weekly catalog refresh.
  - Legacy AI settings are migrated automatically to the new frontier model choices.
  - The model picker shows new "Latest ..." frontier options that display the resolved model name and update info.
  - Food analysis now uses the resolved frontier model automatically when performing immediate analysis.
  - [View source](https://github.com/gordolio/Trio/commit/943bd282e3e78b087c3d4362cda37ba1e801a50f)

## Internal and Build-System Changes

- **Fix Trio test target failures**
  - Internal test code was updated so the Trio test target no longer fails.
  - A mock calibration method was added to tests and some numeric expectations were adjusted.
  - A test about AI availability was reworked to check after coordinator initialization.
  - These updates only affect tests and do not change app behavior for users.
  - [View source](https://github.com/gordolio/Trio/commit/608383d6f21cd94c6d48455c6f733847fc3ded94)

## Build Metadata

- Source workflow: [37503160396](https://github.com/gordolio/Trio/actions/runs/37503160396)
- Previous built commit: [`d127bb42c3dc9aae25450f067dac18704a9d51f5`](https://github.com/gordolio/Trio/commit/d127bb42c3dc9aae25450f067dac18704a9d51f5)
- Current built commit: [`943bd282e3e78b087c3d4362cda37ba1e801a50f`](https://github.com/gordolio/Trio/commit/943bd282e3e78b087c3d4362cda37ba1e801a50f)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
