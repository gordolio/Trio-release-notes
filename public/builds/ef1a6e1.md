# Trio Build ef1a6e1

Built 2026-05-24T03:19:28.000Z from `0bb6888..ef1a6e1`.

## Highlights

- **Show small basal rates with more precision**
  - Basal rates (units/hour) in the therapy settings editor now show two to three decimal places for small steps.
  - This increased precision appears during onboarding when editing basal settings.
  - Displays for other unit types remain unchanged.
  - [View source](https://github.com/nightscout/Trio/pull/1161)
- **Add anonymous telemetry with consent options**
  - Trio now sends optional anonymous usage telemetry with a default opt-out (Full Sharing) choice.
  - App Diagnostics and Onboarding show three options: Full Sharing (crashes + telemetry), Crash Reports Only, and Disabled.
  - Existing users see a one-time migration sheet on first launch to choose their telemetry preference.
  - Settings includes a "What's sent" preview so you can inspect the exact telemetry JSON before consenting.
  - [View source](https://github.com/nightscout/Trio/pull/1149)

## Internal and Build-System Changes

- **Merge of development branch; no visible changes**
  - This commit merges the development branch into dev.
  - No user-visible changes are described in the commit message.
  - Further review is required to identify any functional or UI impacts.
  - Human review recommended.
  - [View source](https://github.com/gordolio/Trio/commit/ef1a6e1b1436b82a1c969d5ddf0c2a9ed4f44cc2)

## Build Metadata

- Source workflow: [26350423062](https://github.com/gordolio/Trio/actions/runs/26350423062)
- Previous built commit: [`0bb688841620824a10f203cc90ce09ca3dcec824`](https://github.com/gordolio/Trio/commit/0bb688841620824a10f203cc90ce09ca3dcec824)
- Current built commit: [`ef1a6e1b1436b82a1c969d5ddf0c2a9ed4f44cc2`](https://github.com/gordolio/Trio/commit/ef1a6e1b1436b82a1c969d5ddf0c2a9ed4f44cc2)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
