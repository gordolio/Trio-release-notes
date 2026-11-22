# Trio Build 633836f

Built 2026-11-22T21:48:45.000Z from `9988877..633836f`.

## Highlights

- **Therapy profiles: create, edit and switch**
  - You can create, rename, delete and switch between therapy profiles, and edit their settings.
  - The Home screen shows the active profile name when more than one profile exists.
  - [View source](https://github.com/nightscout/Trio/pull/1764)
- **Upload and import multiple therapy profiles**
  - Trio now uploads all therapy profiles and scheduled profile switches to Nightscout.
  - Onboarding can import multiple Nightscout profiles so your profiles are preserved during setup.
  - [View source](https://github.com/nightscout/Trio/pull/1765)
- **Remote therapy profile commands**
  - Trio now accepts remote commands to switch, save, delete therapy profiles and scheduled starts.
  - Saves and deletes include a profile fingerprint; the active profile and Default cannot be deleted.
  - [View source](https://github.com/nightscout/Trio/pull/1766)
- **Therapy profiles**
  - You can create and switch between therapy profiles with different basal, carb, ISF, and target settings.
  - Profiles can be scheduled weekly or selected from LoopFollow.
  - [View source](https://github.com/nightscout/Trio/pull/1788)
- **Stop duplicate app initialization when opening CGM**
  - Opening the CGM setup sheet no longer triggers the app to initialize twice.
  - This avoids duplicate startup behavior when first setting up or using certain CGM sources.
  - [View source](https://github.com/nightscout/Trio/pull/1781)

## New Features

- **Store therapy profiles and scheduled switches**
  - Trio can now save named therapy profiles and their scheduled switches.
  - This change adds only background storage—there is no new user interface yet, so you won’t see new screens.
  - [View source](https://github.com/nightscout/Trio/pull/1763)

## Internal and Build-System Changes

- **Remove unused statistics and APS cleanup**
  - Removed unused statistics models and related APS code; users should see no functional changes.
  - [View source](https://github.com/nightscout/Trio/pull/1681)

## Build Metadata

- Source workflow: [45072776325](https://github.com/gordolio/Trio/actions/runs/45072776325)
- Previous built commit: [`998887784cc59402dc15058ccc35ef62bfc810b9`](https://github.com/gordolio/Trio/commit/998887784cc59402dc15058ccc35ef62bfc810b9)
- Current built commit: [`633836f5dc10e91f1f8da64287cbc83066f84445`](https://github.com/gordolio/Trio/commit/633836f5dc10e91f1f8da64287cbc83066f84445)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
