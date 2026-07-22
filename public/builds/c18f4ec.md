# Trio Build c18f4ec

Built 2026-06-14T08:19:15.000Z from `368540b..c18f4ec`.

## Highlights

- **Consolidate Omnipod options into OmnipodKit**
  - Pump picker now shows a single "All Omnipod Types" option instead of separate Eros and DASH entries.
  - Onboarding and pump setup use one Omnipod choice instead of separate Eros/DASH options.
  - Omnipod onboarding basal-rate picker allows 0 U/hr (DASH minimum), which may not enforce Eros's 0.05 U/hr minimum.
  - Privacy and telemetry texts now reference OmnipodKit instead of the removed OmniKit/OmniBLE.
  - [View source](https://github.com/nightscout/Trio/pull/1200)

## Build Metadata

- Source workflow: [27492779675](https://github.com/gordolio/Trio/actions/runs/27492779675)
- Previous built commit: [`368540b6659d25a23b3318ebdbdde546907b69ac`](https://github.com/gordolio/Trio/commit/368540b6659d25a23b3318ebdbdde546907b69ac)
- Current built commit: [`c18f4ecdb95f18c858ba32f347ee573c61378e82`](https://github.com/gordolio/Trio/commit/c18f4ecdb95f18c858ba32f347ee573c61378e82)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
