# Trio Build 3b32631

Built 2026-08-01T03:00:41.000Z from `fb7890e..3b32631`.

## Highlights

- **Restore upstream Treatments state handling**
  - Treatments now uses the upstream state model and popup instead of the broader fork-specific state changes.
  - Bolus recommendations remain visible but are no longer copied into the Bolus field automatically; tap the recommendation to accept it.
  - This supersedes the attempted low-forecast auto-apply fix from build fb7890e.
  - [View source](https://github.com/gordolio/Trio/commit/dcae4cfe08eeb44e676da965ccceb0d342c1ac4d)
- **Keep AI food analysis isolated**
  - Analyze Food with AI remains available in Treatments and can fill carbs, fat, protein, and notes after review.
  - AI analysis now runs in a fork-owned coordinator outside the upstream Treatments state model.
  - Applying AI nutrition recalculates the recommendation but does not populate or enact a bolus.
  - [View source](https://github.com/gordolio/Trio/commit/6df2e7ad606289784cc51e641df9df203f3144c1)

## Build Metadata

- Source workflow: [30680651555](https://github.com/gordolio/Trio/actions/runs/30680651555)
- Previous built commit: [`fb7890efca9e4e2984732961c1150487944441d7`](https://github.com/gordolio/Trio/commit/fb7890efca9e4e2984732961c1150487944441d7)
- Current built commit: [`3b3263134426c0a434a787e583ed4bb612341cdd`](https://github.com/gordolio/Trio/commit/3b3263134426c0a434a787e583ed4bb612341cdd)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
