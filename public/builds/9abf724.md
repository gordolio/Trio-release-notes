# Trio Build 9abf724

Built 2026-10-25T12:14:27.000Z from `99ff89f..9abf724`.

## Highlights

- **Target line continues past midnight**
  - Glucose target line now continues past midnight on the home chart.
  - You will no longer see the green target line stop at 00:00 after a day without restarting.
  - [View source](https://github.com/nightscout/Trio/pull/1665)
- **Show pump-programmed boluses in Nightscout**
  - Nightscout treatments now show when a bolus was programmed on the pump.
  - Boluses finalized as pump-programmed after upload are re-sent so Nightscout reflects the change.
  - [View source](https://github.com/nightscout/Trio/pull/1666)

## Internal and Build-System Changes

- **RoundWhiteDiscKit update for SwiftFormat parse fix**
  - Updated RoundWhiteDiscKit submodule to pick up a SwiftFormat parse fix.
  - Local builds that were failing during formatting should now succeed.
  - [View source](https://github.com/nightscout/Trio/pull/1662)

## Build Metadata

- Source workflow: [40191191221](https://github.com/gordolio/Trio/actions/runs/40191191221)
- Previous built commit: [`99ff89f138f7e0c03a0b5f7a8e3608f53e07de5d`](https://github.com/gordolio/Trio/commit/99ff89f138f7e0c03a0b5f7a8e3608f53e07de5d)
- Current built commit: [`9abf724776c601d8e06d573430d0a2372776a8b3`](https://github.com/gordolio/Trio/commit/9abf724776c601d8e06d573430d0a2372776a8b3)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
