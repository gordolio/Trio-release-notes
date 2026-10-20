# Trio Build 668c090

Built 2026-10-20T03:43:48.000Z from `b1774d8..668c090`.

## Highlights

- **Prevent crash when uploading carbs without ID**
  - Carb uploads no longer crash when an entry has no ID.
  - Carb entries missing an ID are skipped during upload and won't create duplicates.
  - [View source](https://github.com/nightscout/Trio/pull/1649)
- **Hide backfill button after Nightscout check**
  - Home hides the backfill button for gaps Nightscout already checked.
  - [View source](https://github.com/gordolio/Trio/pull/16)

## Build Metadata

- Source workflow: [39364041206](https://github.com/gordolio/Trio/actions/runs/39364041206)
- Previous built commit: [`b1774d80e21b44f00c09ee1359acecf7a78ea9d5`](https://github.com/gordolio/Trio/commit/b1774d80e21b44f00c09ee1359acecf7a78ea9d5)
- Current built commit: [`668c090239482a9b1c181f41dbf8fae8a13e74be`](https://github.com/gordolio/Trio/commit/668c090239482a9b1c181f41dbf8fae8a13e74be)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
