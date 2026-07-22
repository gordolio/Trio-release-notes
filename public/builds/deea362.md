# Trio Build deea362

Built 2026-06-06T22:24:15.000Z from `2f97cd5..deea362`.

## Highlights

- **Show temp target on live activity lock screen**
  - A badge showing an active temp target name now appears on the live activity lock screen widget.
  - The temp target badge stacks with the existing override badge when both are active.
  - Badges are moved to the left side of the chart overlay instead of the right.
  - The chart no longer extends into the future when an override or temp target is active.
  - The active temp target period is drawn on the chart as a colored band.
  - [View source](https://github.com/nightscout/Trio/pull/1180)
- **Fix watch app back-sync after long staleness**
  - The watch ignores incoming state messages older than 15 minutes to avoid replaying a backlog.
  - Duplicate or older watch-state updates are skipped so the watch avoids repeated UI updates.
  - Phone sends now stamp state with the current time so watch-requested re-pushes are not silenced.
  - Acknowledgment and recommended-bolus messages are still processed and do not show the syncing animation.
  - [View source](https://github.com/nightscout/Trio/pull/1190)

## Build Metadata

- Source workflow: [27075240379](https://github.com/gordolio/Trio/actions/runs/27075240379)
- Previous built commit: [`2f97cd5fb3b91eaaf6c122afb3d323763d489ab6`](https://github.com/gordolio/Trio/commit/2f97cd5fb3b91eaaf6c122afb3d323763d489ab6)
- Current built commit: [`deea36247ce6fb2080ee8d475fe2a98debb946d2`](https://github.com/gordolio/Trio/commit/deea36247ce6fb2080ee8d475fe2a98debb946d2)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
