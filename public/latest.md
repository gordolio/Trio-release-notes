# Trio Build 0bb6888

Built 2026-05-23T04:54:02.000Z from `fd9ca10..0bb6888`.

## Highlights

- **Restore Dynamic Settings help toggle behavior by updating shouldDisplayHintBinding so setting true seeds a placeholder HintPayload when hintPayload is nil; previously enabling the toggle did not present help content.** Restores the question-mark help buttons on the Dynamic Settings page so taps for Adjustment Factor, Weighted Average of TDD, and Adjust Basal present their help sheet (these taps previously did nothing). (Sources: pr:nightscout/Trio#1158, pr:gordolio/Trio#1158, commit:e331fc0755c743ccfbaea4e162ca67ecb3b34241) Sources: [gordolio/Trio#1158: Fix help buttons on Dynamic Settings page](https://github.com/nightscout/Trio/pull/1158), [nightscout/Trio#1158: Fix help buttons on Dynamic Settings page](https://github.com/nightscout/Trio/pull/1158), [Fix help buttons on Dynamic Settings page](https://github.com/gordolio/Trio/commit/e331fc0755c743ccfbaea4e162ca67ecb3b34241), [Merge pull request #1158 from bjorkert/fix/dynamic-settings-help-buttons](https://github.com/gordolio/Trio/commit/29245e95d3143902474aa3f14812bed8c71418ce), [Trio/Sources/Modules/DynamicSettings/View/DynamicSettingsRootView.swift](https://github.com/gordolio/Trio/commit/29245e95d3143902474aa3f14812bed8c71418ce), [Diff for pr:nightscout/Trio#1158](https://github.com/gordolio/Trio/compare/72ce010d54cf5a96eeb1539632f3975bb2f9bdf9...29245e95d3143902474aa3f14812bed8c71418ce)

## Interface Improvements

- **Restore Dynamic Settings help toggle behavior by updating shouldDisplayHintBinding so setting true seeds a placeholder HintPayload when hintPayload is nil; previously enabling the toggle did not present help content.** Restores the question-mark help buttons on the Dynamic Settings page so taps for Adjustment Factor, Weighted Average of TDD, and Adjust Basal present their help sheet (these taps previously did nothing). (Sources: pr:nightscout/Trio#1158, pr:gordolio/Trio#1158, commit:e331fc0755c743ccfbaea4e162ca67ecb3b34241) Sources: [gordolio/Trio#1158: Fix help buttons on Dynamic Settings page](https://github.com/nightscout/Trio/pull/1158), [nightscout/Trio#1158: Fix help buttons on Dynamic Settings page](https://github.com/nightscout/Trio/pull/1158), [Fix help buttons on Dynamic Settings page](https://github.com/gordolio/Trio/commit/e331fc0755c743ccfbaea4e162ca67ecb3b34241), [Merge pull request #1158 from bjorkert/fix/dynamic-settings-help-buttons](https://github.com/gordolio/Trio/commit/29245e95d3143902474aa3f14812bed8c71418ce), [Trio/Sources/Modules/DynamicSettings/View/DynamicSettingsRootView.swift](https://github.com/gordolio/Trio/commit/29245e95d3143902474aa3f14812bed8c71418ce), [Diff for pr:nightscout/Trio#1158](https://github.com/gordolio/Trio/compare/72ce010d54cf5a96eeb1539632f3975bb2f9bdf9...29245e95d3143902474aa3f14812bed8c71418ce)

## Internal and Build-System Changes

- **Increment APP_DEV_VERSION in Config.xcconfig from 0.7.0.17 to 0.7.0.18 (CI/build metadata bump).** Likely none for end users — this is a build/CI metadata change (APP_DEV_VERSION) in Config.xcconfig. The change is shown in the commit and diff updating APP_DEV_VERSION to 0.7.0.18. If you need confirmation about any release-process or packaging implications, please review CI/release steps manually. Sources: [gordolio/Trio#1167: Release/v0.8.0](https://github.com/nightscout/Trio/pull/1167), [nightscout/Trio#1167: Release/v0.8.0](https://github.com/nightscout/Trio/pull/1167), [CI: Bump APP_DEV_VERSION to 0.7.0.18 [skip ci]](https://github.com/gordolio/Trio/commit/643df19d9fbf7e872e9178e8be4a16ae2fc972c2), [Config.xcconfig](https://github.com/gordolio/Trio/commit/643df19d9fbf7e872e9178e8be4a16ae2fc972c2), [Diff for pr:nightscout/Trio#1167](https://github.com/gordolio/Trio/compare/29245e95d3143902474aa3f14812bed8c71418ce...643df19d9fbf7e872e9178e8be4a16ae2fc972c2)

## Build Metadata

- Source workflow: [26323684147](https://github.com/gordolio/Trio/actions/runs/26323684147)
- Previous built commit: [`fd9ca10fd06cf8af9e2a6a0e10ba7708c15a3da6`](https://github.com/gordolio/Trio/commit/fd9ca10fd06cf8af9e2a6a0e10ba7708c15a3da6)
- Current built commit: [`0bb688841620824a10f203cc90ce09ca3dcec824`](https://github.com/gordolio/Trio/commit/0bb688841620824a10f203cc90ce09ca3dcec824)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.1.0`, prompt `2`
