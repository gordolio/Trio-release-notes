# Trio Build 560b732

Built 2026-11-01T22:59:12.000Z from `2b81a79..560b732`.

## Highlights

- **Update to LoopKit next-dev**
  - Libre 2 via LibreTransmitter now triggers Trio's glucose alarms.
  - Inoperable pump states now stop automated insulin delivery like a suspended pump.
  - [View source](https://github.com/nightscout/Trio/pull/1718)
- **Unify glucose number formatting**
  - Glucose values now display consistently with correct decimals and local decimal separators across the app.
  - History, settings and exports use the same format (e.g. mmol/L shows 6.0 and French locales show 3,9).
  - [View source](https://github.com/nightscout/Trio/pull/1715)
- **Skip misdated insulin entries to prevent crashes**
  - Trio now skips insulin entries whose end time is before their start.
  - You should no longer see repeated app crashes caused by those misdated insulin rows.
  - [View source](https://github.com/nightscout/Trio/pull/1720)

## Build Metadata

- Source workflow: [41357863557](https://github.com/gordolio/Trio/actions/runs/41357863557)
- Previous built commit: [`2b81a799ef3981621144dcbfe8be88411cf8635a`](https://github.com/gordolio/Trio/commit/2b81a799ef3981621144dcbfe8be88411cf8635a)
- Current built commit: [`560b7325be1621978ac10d76fc25a38f9f44d45a`](https://github.com/gordolio/Trio/commit/560b7325be1621978ac10d76fc25a38f9f44d45a)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
