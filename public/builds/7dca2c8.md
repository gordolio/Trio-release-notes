# Trio Build 7dca2c8

Built 2026-10-28T13:37:06.000Z from `141ccc8..7dca2c8`.

## Highlights

- **Improved log sharing and diagnostic export**
  - Share redacted Trio, pump, or CGM logs from Settings → Report a Problem.
  - Choose 24‑hour, 3‑day or 7‑day ranges and get one zip with a single time‑sorted text file.
  - [View source](https://github.com/nightscout/Trio/pull/1660)
- **In-app 'Send to the Trio Team' problem reports**
  - Users can send private problem reports with text, up to 8 screenshots and optional recent logs.
  - They receive a report ID after sending and can view or delete sent reports for up to 90 days.
  - [View source](https://github.com/nightscout/Trio/pull/1667)
- **Settings Tests hub and guided Basal Test**
  - A Settings Tests hub now appears under Therapy Settings.
  - A guided Basal Test lets you run a fasted test, see readiness checks, and view results.
  - [View source](https://github.com/gordolio/Trio/commit/ac25cd04585323573e68b7442506f8ad52d2db1f)
- **Device kit updates for Eversense and Medtrum**
  - Eversense now records each sensor's insertion date and migrates prior insertion info.
  - Medtrum adds a base-reset alert, keeps unsaved patch settings on sync, and updates activation screens.
  - [View source](https://github.com/nightscout/Trio/pull/1677)
- **Save bar sizing in therapy editors**
  - Save bars in therapy editors now size correctly to their containers.
  - Save bar backgrounds now extend across the full horizontal safe area.
  - [View source](https://github.com/gordolio/Trio/commit/aeafc774673ef72020763275bcfb8ec9f8f1c391)

## Fixes

- **Fix Duo error screen buttons**
  - Fixes buttons on the Duo error screen.
  - [View source](https://github.com/gordolio/Trio/commit/a7b761354900a2d9f538b8586a456bc8cc039050)

## Interface Improvements

- **Fix list top spacing in sheets**
  - Fix top spacing for lists in Treatments and adjustment forms.
  - This prevents the first row from being hidden under the sheet bar on some iPhones.
  - [View source](https://github.com/gordolio/Trio/commit/35e60ec34f827d231a3b24786e720ec99994f04e)
- **Help sheets use correct horizontal padding**
  - Help sheets now use horizontal side padding and keep only vertical overall padding.
  - The "Got it!" button and help list content now align with consistent side margins.
  - [View source](https://github.com/gordolio/Trio/commit/262cf39cfb877e1b03fa14a3e0431783a07a024e)
- **Sticky action bars fit their view width**
  - Sticky action bars and buttons now size to their view instead of the full device width.
  - Bar backgrounds now extend across horizontal safe areas for an edge-to-edge appearance.
  - [View source](https://github.com/gordolio/Trio/commit/0b23a263f790d8d5fd8f4d90ca4f51cf4b15877f)
- **Error buttons and widget preview fit their containers**
  - Retry and Proceed buttons plus the Live Activity widget preview now scale to their view area.
  - Buttons keep a consistent height for a uniform appearance.
  - [View source](https://github.com/gordolio/Trio/commit/c6bd339b0e5d51706b31fb6c0a8f9673fe629d95)
- **Fix for Duo therapy save bar**
  - Fixes for saving Duo therapy settings were merged into development.
  - Human review recommended.
  - [View source](https://github.com/gordolio/Trio/commit/2892aeb782cdfbf2b48d92527b8f3e019a2abd90)
- **Fix Duo sheet top inset**
  - Duo sheet now aligns correctly with the top of the screen.
  - Human review recommended.
  - [View source](https://github.com/gordolio/Trio/commit/fb4d9835902f5f480cd1d928e9b5a97b42a25879)
- **Duo help sheet layout fix**
  - A layout fix for the Duo help sheet was merged.
  - You may notice adjusted spacing when viewing the Duo help sheet.
  - Human review recommended.
  - [View source](https://github.com/gordolio/Trio/commit/7e9e72b50e4a497309fa705d866921b9a1317735)
- **Fix sticky action bars on Duo screens**
  - Duo-related action bars stop sticking unexpectedly.
  - You should see more consistent action controls when using Duo features.
  - Human review recommended.
  - [View source](https://github.com/gordolio/Trio/commit/0444009d5a976d5d54a35495db4b4df8af72a8d4)

## Internal and Build-System Changes

- **Stop Node.js deprecation warnings in tests**
  - Failed unit-test runs no longer show the Node.js 20 deprecation warning.
  - No change to app behavior or user experience.
  - [View source](https://github.com/nightscout/Trio/pull/1673)
- **Choose TestFlight groups for manual builds**
  - When triggering a manual build, you can limit recipients by selecting TestFlight groups.
  - If no groups are selected, the build is uploaded the usual way.
  - [View source](https://github.com/gordolio/Trio/commit/ce9df3faf87e3cd326ba00c870978ade36eb159d)
- **Skip Beta App Review for Internal TestFlight**
  - Internal TestFlight builds no longer require Beta App Review when sent to internal groups.
  - Internal testers will receive builds without an extra beta review step.
  - [View source](https://github.com/gordolio/Trio/commit/b80cde33c451dcc89b75c6f0933ab3ad13372a96)
- **Internal build and logging fixes**
  - Fix build errors and update watch app logging calls.
  - Users will not see any changes in app behavior.
  - [View source](https://github.com/gordolio/Trio/commit/da3652ff857624bd9f351c76472e4c064e0c0918)
- **Adjust debug log categories**
  - Internal debug log categories were changed. You won't notice any change.
  - [View source](https://github.com/gordolio/Trio/commit/20cacfaf77356edd005d0a23a36553e2dce74258)
- **Background test maintenance**
  - Automated unit tests were re-run.
  - [View source](https://github.com/gordolio/Trio/commit/5897074581dd3d39f972621f348cce5024ac3af7)
- **Rename test URL protocol helper**
  - Test helper StubURLProtocol was renamed to AIStubURLProtocol and updated in the AI assistants tests.
  - This is a test-only change; there are no user-visible changes.
  - [View source](https://github.com/gordolio/Trio/commit/5284d219e1815e6539df886d8a01255dffa780ac)
- **Skip automatic TestFlight groups during upload**
  - Uploaded builds are not manually added to TestFlight groups that already receive every build.
  - Only the manually selected tester groups will receive the new build when chosen.
  - [View source](https://github.com/gordolio/Trio/commit/7dca2c89ec2d1f363b0ecab05b8fb3d2e04ab0b9)

## Build Metadata

- Source workflow: [40694767000](https://github.com/gordolio/Trio/actions/runs/40694767000)
- Previous built commit: [`141ccc8809cd6caa34bac60a91959d5387f48cdb`](https://github.com/gordolio/Trio/commit/141ccc8809cd6caa34bac60a91959d5387f48cdb)
- Current built commit: [`7dca2c89ec2d1f363b0ecab05b8fb3d2e04ab0b9`](https://github.com/gordolio/Trio/commit/7dca2c89ec2d1f363b0ecab05b8fb3d2e04ab0b9)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
