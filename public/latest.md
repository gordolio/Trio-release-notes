# Trio Build 99ff89f

Built 2026-10-24T20:12:33.000Z from `b8c6aa3..99ff89f`.

## Highlights

- **Rename TIR setting to Lower Range Threshold**
  - Time in Range setting renamed to 'Lower Range Threshold' with Standard (70 mg/dL) and Extended (63 mg/dL).
  - Charts and statistics will display TIR/TITR ranges using the selected lower threshold.
  - [View source](https://github.com/nightscout/Trio/pull/1558)
- **Mark pump-programmed boluses in History**
  - Pump-programmed boluses are now recorded and identified in the app.
  - History \> Treatments shows a pump indicator next to those boluses.
  - [View source](https://github.com/nightscout/Trio/pull/1580)
- **Add Syai Ultra X1 CGM support**
  - Syai Ultra X1 continuous glucose monitor (CGM) is now available in Trio.
  - It requires a Syai account, cannot be calibrated, and can upload glucose data to Syai servers.
  - [View source](https://github.com/nightscout/Trio/pull/1618)
- **Close Edit Override form on save failure**
  - Edit Override form now closes when saving even if the Nightscout upload fails.
  - Your changes are saved and the app records the upload failure.
  - [View source](https://github.com/nightscout/Trio/pull/1652)
- **Surface CGM warnings and catalog G7 alerts**
  - Sensor warnings now appear during a session instead of being hidden.
  - G7 sensor alerts are now categorized and surface like other CGMs.
  - [View source](https://github.com/nightscout/Trio/pull/1659)

## Build Metadata

- Source workflow: [40127501549](https://github.com/gordolio/Trio/actions/runs/40127501549)
- Previous built commit: [`b8c6aa398cc682c346af3d085bfd839f3c66841d`](https://github.com/gordolio/Trio/commit/b8c6aa398cc682c346af3d085bfd839f3c66841d)
- Current built commit: [`99ff89f138f7e0c03a0b5f7a8e3608f53e07de5d`](https://github.com/gordolio/Trio/commit/99ff89f138f7e0c03a0b5f7a8e3608f53e07de5d)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
