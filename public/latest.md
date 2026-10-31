# Trio Build 3b9866b

Built 2026-10-31T16:10:01.000Z from `ec787c7..3b9866b`.

## Highlights

- **Alarm snooze control on Apple Watch**
  - You can now view and control alarm snooze from the Apple Watch.
  - Tapping opens snooze options including ending an active snooze and shows remaining time.
  - [View source](https://github.com/nightscout/Trio/pull/1576)
- **Don't mark loop actions as enacted during suspend**
  - Loops that run while the pump is suspended are no longer marked as enacted.
  - Nightscout will no longer show suggested temp basals or SMB as delivered when nothing was given.
  - [View source](https://github.com/nightscout/Trio/pull/1696)
- **Show suspended pump status during pod changes**
  - Nightscout now uploads the pump status read at upload time.
  - Pumps will be shown as suspended during pod changes or after pod faults when appropriate.
  - [View source](https://github.com/nightscout/Trio/pull/1697)
- **Fingerstick entries no longer hide CGM readings**
  - Trio now ignores manual fingerstick entries when deciding which CGM readings to keep.
  - CGM readings that arrive shortly after a fingerstick will no longer be dropped and will be backfilled.
  - [View source](https://github.com/nightscout/Trio/pull/1702)
- **Save pump status for uploads**
  - Pump delivery status is now stored and included when Trio uploads device status.
  - Without a connected pump, uploads use the last known status and removed pumps appear as suspended.
  - [View source](https://github.com/nightscout/Trio/pull/1703)

## Interface Improvements

- **GRI now displays in chosen glucose units**
  - GRI calculations now display in your selected glucose unit (mg/dL or mmol/L).
  - Range labels and score breakdowns now show converted values with units.
  - [View source](https://github.com/nightscout/Trio/pull/1707)
- **Fix inconsistent glucose delta rounding**
  - Glucose delta values are now calculated and formatted consistently.
  - You'll see matching delta numbers across the app, removing 0.1 mmol/L mismatches.
  - [View source](https://github.com/nightscout/Trio/pull/1710)
- **Save bar sizing fixed for Duo display**
  - Therapy editors' save bar now fits the editor container instead of spanning the screen.
  - On iPhone Duo's closed display the editors no longer shift off the edge of the screen.
  - [View source](https://github.com/nightscout/Trio/pull/1682)
- **Fix top-row overlap on iPhone Duo (closed)**
  - Treatments and adjustment forms no longer have their first row hidden on iPhone Duo (closed).
  - Other iPhones' layouts are unchanged.
  - [View source](https://github.com/nightscout/Trio/pull/1683)
- **Fix help-sheet layout on iPhone Duo**
  - Help sheets display correctly on iPhone Duo's closed screen.
  - Layouts on other iPhones are unchanged.
  - [View source](https://github.com/nightscout/Trio/pull/1684)
- **Fix sticky action bar size on Duo closed display**
  - Sticky action bars now fit their visible space on iPhone Duo's closed display.
  - Other iPhone models are unchanged and behave as before.
  - [View source](https://github.com/nightscout/Trio/pull/1685)
- **Fix oversized buttons and Live Activity preview on Duo**
  - Buttons and the Live Activity preview now fit the Duo closed display.
  - Other iPhones are unchanged.
  - [View source](https://github.com/nightscout/Trio/pull/1686)

## Internal and Build-System Changes

- **Remove unused and dead code**
  - Removed unused screens, helper utilities, and dead configuration files.
  - You should not notice any change in app behavior.
  - [View source](https://github.com/nightscout/Trio/pull/1693)
- **Remove unused formatters**
  - Removed unused number, date, and percent formatters from the app.
  - Users should not notice any visible changes.
  - [View source](https://github.com/nightscout/Trio/pull/1711)

## Build Metadata

- Source workflow: [41216489454](https://github.com/gordolio/Trio/actions/runs/41216489454)
- Previous built commit: [`ec787c73aa39c3f2698b25b65586b2a58e85418e`](https://github.com/gordolio/Trio/commit/ec787c73aa39c3f2698b25b65586b2a58e85418e)
- Current built commit: [`3b9866b45e10e4abf10f0893f0a254dfbcd33b63`](https://github.com/gordolio/Trio/commit/3b9866b45e10e4abf10f0893f0a254dfbcd33b63)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
