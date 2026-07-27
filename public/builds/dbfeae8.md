# Trio Build dbfeae8

Built 2026-07-23T17:43:18.000Z from `9477cc7..dbfeae8`.

## Highlights

- **Switch AI to OpenRouter and stop uploading IPAs**
  - AI-assisted carb estimation and food image analysis now run through OpenRouter.
  - AI settings no longer let you pick or compare multiple providers and now show OpenRouter only.
  - The app checks for an OpenRouter API key (OpenRouterAPIKey) in the app config to enable AI features.
  - CI builds no longer upload IPA artifacts and now only publish build logs and symbol files.
  - [View source](https://github.com/gordolio/Trio/commit/85ad8005fe0617c6edc8a1c1679872a979088924)
- **Choose and compare AI providers**
  - You can choose which AI provider (OpenAI or Claude) powers AI-assisted carb entry.
  - A new Compare Providers setting shows each provider in its own tab so you can compare results.
  - When Compare is enabled, the selected provider runs first and other providers load when you open their tab.
  - The app now defaults to OpenAI as the selected AI provider.
  - [View source](https://github.com/gordolio/Trio/commit/dbfeae8894b0b6e8305ae35a63422cc634c10410)

## Internal and Build-System Changes

- **Preserve and upload release-note metadata**
  - The build now extracts the app's commit SHA and build date into a small release-notes file.
  - Builds will fail if the app does not contain exactly one BuildDetails.plist or has invalid metadata.
  - Only the release-notes metadata file is uploaded to CI artifacts instead of full build logs and symbol files.
  - Uploaded release-notes metadata is retained as an artifact for 90 days.
  - [View source](https://github.com/gordolio/Trio/commit/d769c589cf8e7de99a4c3296751ceeae39dfe7d6)

## Build Metadata

- Source workflow: [30029192525](https://github.com/gordolio/Trio/actions/runs/30029192525)
- Previous built commit: [`9477cc7ed6c3a8891ffea18de9b9def16b945ea9`](https://github.com/gordolio/Trio/commit/9477cc7ed6c3a8891ffea18de9b9def16b945ea9)
- Current built commit: [`dbfeae8894b0b6e8305ae35a63422cc634c10410`](https://github.com/gordolio/Trio/commit/dbfeae8894b0b6e8305ae35a63422cc634c10410)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
