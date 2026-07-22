# Trio Build 24e4245

Built 2026-07-20T14:49:17.000Z from `94020d8..24e4245`.

## Highlights

- **Alerting fixes and replay on restart**
  - The "Acknowledge all alerts" button is removed from the pump setup screen.
  - The alarm tone picker is easier to use with clearer selection marks and larger tap targets.
  - Old legacy "not looping" notifications are cleared so they won't fire after updating the app.
  - On app launch, unacknowledged device alerts are replayed so you can acknowledge them.
  - Acknowledging an alert now clears duplicate or related history entries so they do not linger.
  - [View source](https://github.com/nightscout/Trio/pull/1307)

## Build Metadata

- Source workflow: [29749441420](https://github.com/gordolio/Trio/actions/runs/29749441420)
- Previous built commit: [`94020d890ae2b51751f2639366fcf01ac07fb7a7`](https://github.com/gordolio/Trio/commit/94020d890ae2b51751f2639366fcf01ac07fb7a7)
- Current built commit: [`24e424583ee0419886484dc4d15b94990f09e2f0`](https://github.com/gordolio/Trio/commit/24e424583ee0419886484dc4d15b94990f09e2f0)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
