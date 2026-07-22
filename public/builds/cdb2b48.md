# Trio Build cdb2b48

Built 2026-06-25T12:22:07.000Z from `995ac80..cdb2b48`.

## Highlights

- **Check manual temp basals for all pump models**
  - Manual temporary basal checks now run for any pump model instead of only OmnipodKit.
  - This change prepares Trio for broader pump support in future updates.
  - [View source](https://github.com/nightscout/Trio/pull/1218)
- **Prevent autosens crash on oref-swift startup**
  - Trio now creates the user profile before running the autosens step during startup.
  - This prevents a startup exception when Trio is configured to use oref-swift.
  - Devices set up with oref-swift from first run should now start and run the algorithm normally.
  - [View source](https://github.com/nightscout/Trio/pull/1233)
- **Update MedtrumKit: alerts, safety, and fixes**
  - Trio adds LoopKit alerts for pump-related notifications.
  - Trio prevents a patch from being deactivated while a bolus is active.
  - Navigation titles display correctly in the app.
  - Bluetooth communication with devices is more stable.
  - [View source](https://github.com/nightscout/Trio/pull/1234)

## Build Metadata

- Source workflow: [28168835213](https://github.com/gordolio/Trio/actions/runs/28168835213)
- Previous built commit: [`995ac80da721e92b9e8e6d8deee303cf72b55ce2`](https://github.com/gordolio/Trio/commit/995ac80da721e92b9e8e6d8deee303cf72b55ce2)
- Current built commit: [`cdb2b482b0815244288958ddd4169c921ebbeb43`](https://github.com/gordolio/Trio/commit/cdb2b482b0815244288958ddd4169c921ebbeb43)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
