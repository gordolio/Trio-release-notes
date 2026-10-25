# Trio Build 25f3854

Built 2026-10-25T21:07:38.000Z from `9abf724..25f3854`.

## Highlights

- **Prevent Dynamic Island compact text truncation**
  - Compact Dynamic Island text now scales instead of truncating.
  - When multiple Live Activities appear or in landscape, arrows and glucose values remain visible.
  - [View source](https://github.com/nightscout/Trio/pull/1668)
- **Watch opens pushed meals sooner**
  - Pushed meals now open on the watch even if Trio hasn't received them.
  - Trio checks in more reliably when the watch contacts the phone, on app foreground, or on pushes.
  - [View source](https://github.com/gordolio/Trio/commit/b2ae40d7f4659059e40c05db213405e3117aebe0)

## Internal and Build-System Changes

- **Make schedule tests DST-safe**
  - Automated schedule-related tests were fixed to avoid DST-related failures.
  - This does not change app behavior for users.
  - [View source](https://github.com/nightscout/Trio/pull/1670)

## Build Metadata

- Source workflow: [40232674299](https://github.com/gordolio/Trio/actions/runs/40232674299)
- Previous built commit: [`9abf724776c601d8e06d573430d0a2372776a8b3`](https://github.com/gordolio/Trio/commit/9abf724776c601d8e06d573430d0a2372776a8b3)
- Current built commit: [`25f385401f6b903a80440d9414d855b30e3f9796`](https://github.com/gordolio/Trio/commit/25f385401f6b903a80440d9414d855b30e3f9796)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
