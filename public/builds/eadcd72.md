# Trio Build eadcd72

Built 2026-08-09T07:09:08.000Z from `29f13d5..eadcd72`.

## Highlights

- **Faster algorithm with identical dosing**
  - The insulin-calculation pipeline runs about twice as fast in testing.
  - Dosing decisions are unchanged and match previous outputs exactly.
  - New automated parity tests record and compare exact outputs across many scenarios.
  - Calculation-heavy scenarios use less CPU time, improving responsiveness.
  - [View source](https://github.com/nightscout/Trio/pull/1377)
- **Fix repeated Omnipod reconnects**
  - Stops the self-inflicted connect → cancel → reconnect loop when using Omnipod connect-on-demand.
  - Trio now uses a newer OmnipodKit version that includes this connectivity fix.
  - [View source](https://github.com/nightscout/Trio/pull/1380)

## Build Metadata

- Source workflow: [31299780446](https://github.com/gordolio/Trio/actions/runs/31299780446)
- Previous built commit: [`29f13d58657476d902897ce5b50ba180ba4080d7`](https://github.com/gordolio/Trio/commit/29f13d58657476d902897ce5b50ba180ba4080d7)
- Current built commit: [`eadcd728f3f16d50c2df28a7ba5a1713464dd563`](https://github.com/gordolio/Trio/commit/eadcd728f3f16d50c2df28a7ba5a1713464dd563)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
