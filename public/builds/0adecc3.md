# Trio Build 0adecc3

Built 2026-09-06T19:59:59.000Z from `a9f7d9c..0adecc3`.

## Highlights

- **Fix alarm sounds and Low-Soon alerts**
  - Device alarms now use your selected tone and Play Sound setting when they fire.
  - Alarm sound files are bundled so system notifications can resolve and play chosen tones.
  - Delayed critical alarms now start their audio when they actually fire instead of remaining silent.
  - Low Glucose Soon alerts are evaluated and will fire even when a CGM app handles reading-driven alerts.
  - On iOS 26+, Trio will use AlarmKit so critical alarms can ring when the app is suspended and pierce Silent/Focus.
  - Human review recommended.
  - [View source](https://github.com/nightscout/Trio/pull/1375)

## Build Metadata

- Source workflow: [34055620881](https://github.com/gordolio/Trio/actions/runs/34055620881)
- Previous built commit: [`a9f7d9cde1df5aca63553711debc1a29a4f4d847`](https://github.com/gordolio/Trio/commit/a9f7d9cde1df5aca63553711debc1a29a4f4d847)
- Current built commit: [`0adecc36768f924809ef25d7447d2f90f7c5925c`](https://github.com/gordolio/Trio/commit/0adecc36768f924809ef25d7447d2f90f7c5925c)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
