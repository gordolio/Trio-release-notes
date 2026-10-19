# Trio Build c8a1e98

Built 2026-10-19T05:19:42.000Z from `f85f601..c8a1e98`.

## Highlights

- **Remove food camera preview settings**
  - Temporary camera feedback preview options were removed from Settings.
  - The food camera now uses tuned defaults: 85% flash, frozen preview, and medium haptic.
  - [View source](https://github.com/gordolio/Trio/commit/06c0882f3e4b5be4c16fb92f30f49a5c00b49af0)
- **AI Assistants sign-in and status sharing**
  - You can link Trio using Sign in with Apple to share your glucose and loop status with AI assistants.
  - A new AI Assistants screen appears in Settings where you can link, view last updates, or unlink.
  - [View source](https://github.com/gordolio/Trio/commit/8953e19c214286b2521e48916d1e31b95e8e2b8a)

## Internal and Build-System Changes

- **Include Sign in with Apple consent in builds**
  - Build tooling now sends the required Sign in with Apple consent when adding that capability.
  - No direct change for app users.
  - [View source](https://github.com/gordolio/Trio/commit/c8a1e983e49b7d881f5dd3b1225fb8a6d03b1fd6)

## Build Metadata

- Source workflow: [39202089932](https://github.com/gordolio/Trio/actions/runs/39202089932)
- Previous built commit: [`f85f601bac2a344a164d1e6ea645a0dc6087e261`](https://github.com/gordolio/Trio/commit/f85f601bac2a344a164d1e6ea645a0dc6087e261)
- Current built commit: [`c8a1e983e49b7d881f5dd3b1225fb8a6d03b1fd6`](https://github.com/gordolio/Trio/commit/c8a1e983e49b7d881f5dd3b1225fb8a6d03b1fd6)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
