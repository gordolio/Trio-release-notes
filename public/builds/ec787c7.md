# Trio Build ec787c7

Built 2026-10-30T04:03:47.000Z from `7dca2c8..ec787c7`.

## Highlights

- **Fix notification snooze and alarm repetition**
  - Dismissing glucose notifications now snoozes the alarm (15 min default) rather than silencing it.
  - Tapping notifications and snooze buttons now apply the chosen snooze durations.
  - [View source](https://github.com/nightscout/Trio/pull/1679)
- **Upload IOB forecast to Nightscout**
  - Trio uploads an IOB forecast (IOB and insulin activity values) to Nightscout.
  - Followers can display where IOB and insulin activity are heading.
  - [View source](https://github.com/nightscout/Trio/pull/1689)
- **Use classic tab bar in iOS 26 compatibility mode**
  - When iOS 26 runs in design-compatibility mode, Trio uses the legacy tab layout.
  - The + button and tab labels will appear in the correct positions.
  - [View source](https://github.com/nightscout/Trio/pull/1691)

## Internal and Build-System Changes

- **Compiler-warning cleanup and unused code removal**
  - Removed unused code, redundant awaits, and small warnings to clean up the build.
  - There should be no visible changes for users.
  - [View source](https://github.com/nightscout/Trio/pull/1688)

## Build Metadata

- Source workflow: [40998768962](https://github.com/gordolio/Trio/actions/runs/40998768962)
- Previous built commit: [`7dca2c89ec2d1f363b0ecab05b8fb3d2e04ab0b9`](https://github.com/gordolio/Trio/commit/7dca2c89ec2d1f363b0ecab05b8fb3d2e04ab0b9)
- Current built commit: [`ec787c73aa39c3f2698b25b65586b2a58e85418e`](https://github.com/gordolio/Trio/commit/ec787c73aa39c3f2698b25b65586b2a58e85418e)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
