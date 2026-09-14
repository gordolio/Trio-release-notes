# Trio Build af05ca3

Built 2026-09-14T23:44:29.000Z from `dedcae7..af05ca3`.

## Highlights

- **Chart selection moved to Meal panel**
  - The chart's floating detail card was removed and the selected-point readout now appears in the Meal panel instead of on.
  - The selected time is shown on the chart's x-axis rather than inside the readout row.
  - Scrubbing no longer re-lays the chart canvas, so highlights and the readout update without covering data.
  - Hour labels were moved into a separate label strip that follows Dynamic Type and avoids overlapping the plot.
  - [View source](https://github.com/nightscout/Trio/pull/1455)
- **Update device and sensor modules; require iOS 17.6**
  - Device and sensor integration modules were refreshed to newer upstream versions.
  - OmnipodKit was updated to include an improvement for mid-command disconnects.
  - Trio's minimum iOS deployment target was raised to iOS 17.6, so a newer iOS is required to run the app.
  - [View source](https://github.com/nightscout/Trio/pull/1465)
- **Tamer alarms and no more duplicate sounds**
  - Alarm tones were equalized so different alerts no longer vary wildly in loudness.
  - If the system alarm channel is already sounding an alert, the notification is posted silently to avoid the same sound播放.
  - Alarms no longer force the device volume to maximum and only raise it to a moderate floor when needed.
  - Alarm availability is checked early so alarms don't accidentally play twice before the app is ready.
  - [View source](https://github.com/nightscout/Trio/pull/1510)
- **Stop dropping display-only glucose readings**
  - Trio no longer drops glucose readings that are marked as display-only.
  - Display-only readings are now stored so they can be used by the loop.
  - Sensor-reported faulty readings are still withheld and not stored.
  - Libre 3/3+ sensors that previously had their display-only readings discarded will now have those readings accepted.
  - [View source](https://github.com/nightscout/Trio/pull/1512)
- **Improve telemetry reliability and privacy**
  - Telemetry uploads are now scheduled to prevent overlapping or duplicate attempts.
  - Failed telemetry tries are delayed with a one-hour retry backoff.
  - The app records the prior telemetry failure and includes that context in the next attempt.
  - If you opt out of full telemetry, the app will still send a minimal anonymous daily check-in with only version, install.
  - Telemetry requests now include app version and install ID headers and improved app ID parsing to reduce registration 오류.
  - [View source](https://github.com/nightscout/Trio/pull/1517)

## Internal and Build-System Changes

- **Internal dependency-injection cleanup**
  - There are no user-facing feature or UI changes.
  - Internal service setup was simplified to remove unused injections and duplicate resolves.
  - Several background services are now created and shared by a central container instead of self-managing singletons.
  - Automated tests were added so missing or mis-scoped service registrations fail CI instead of causing launch-time issues.
  - [View source](https://github.com/nightscout/Trio/pull/1367)

## Build Metadata

- Source workflow: [34909089589](https://github.com/gordolio/Trio/actions/runs/34909089589)
- Previous built commit: [`dedcae70f46adceb06c0c93679900d37bfac1fb6`](https://github.com/gordolio/Trio/commit/dedcae70f46adceb06c0c93679900d37bfac1fb6)
- Current built commit: [`af05ca34b98d22cbe5966722830058bf4cda01d1`](https://github.com/gordolio/Trio/commit/af05ca34b98d22cbe5966722830058bf4cda01d1)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
