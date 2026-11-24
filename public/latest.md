# Trio Build 9f8982f

Built 2026-11-24T22:55:00.000Z from `633836f..9f8982f`.

## Highlights

- **Show IOB on Live Activity widget**
  - The Live Activity widget now displays IOB (insulin on board) with its unit.
  - Numbers and labels now scale to fit different display sizes, including Apple Watch and CarPlay.
  - [View source](https://github.com/nightscout/Trio/pull/1484)
- **Consistent IOB display and rounding**
  - IOB (insulin on board) now displays consistently with up to two decimals and halves rounded away from zero.
  - Small negative IOB values now show as 0 and VoiceOver/readouts use the word "units" instead of the letter "U".
  - [View source](https://github.com/nightscout/Trio/pull/1731)
- **Fix 12/24h time and date formatting**
  - Times and dates now follow your 12/24h preference and are consistent. SMBs now show the off time range.
  - [View source](https://github.com/nightscout/Trio/pull/1760)
- **Blacklist can target branch or commit SHA**
  - Blacklist entries can now target a branch and commit SHA as well as a version.
  - When a matching blacklist entry includes one, the "Update Required" alert can show its optional message.
  - [View source](https://github.com/nightscout/Trio/pull/1798)
- **Restore space in duration labels**
  - Duration labels now include a space between number and unit (e.g. 90 min).
  - This appears in time spans and time-ago labels throughout the app.
  - [View source](https://github.com/nightscout/Trio/pull/1790)

## Interface Improvements

- **Fix five typos in app text**
  - Corrected spelling mistakes in five English strings shown in the app.
  - You will see the corrected spellings in various settings and explanatory text within the app.
  - [View source](https://github.com/nightscout/Trio/pull/1799)

## Internal and Build-System Changes

- **Use Xcode 27 runners for macOS builds**
  - Builds and unit tests now run on Xcode 27 macOS runners.
  - CI runs should start sooner and tests use the iPhone 17 iOS 27 simulator.
  - [View source](https://github.com/nightscout/Trio/pull/1804)
- **Xcode project reorganized to folders**
  - The Xcode project was reorganized to use folders and unused files were removed.
  - There should be no change to app functionality for users.
  - [View source](https://github.com/nightscout/Trio/pull/1805)
- **Restore missing logging shim to fix tests**
  - No visible change in the Trio app.
  - Unit tests were fixed so developers can run the algorithm test suite again.
  - [View source](https://github.com/nightscout/Trio/pull/1807)

## Build Metadata

- Source workflow: [45500857259](https://github.com/gordolio/Trio/actions/runs/45500857259)
- Previous built commit: [`633836f5dc10e91f1f8da64287cbc83066f84445`](https://github.com/gordolio/Trio/commit/633836f5dc10e91f1f8da64287cbc83066f84445)
- Current built commit: [`9f8982fc1a8c3b540b6b6d288fd0c9f2034b57d3`](https://github.com/gordolio/Trio/commit/9f8982fc1a8c3b540b6b6d288fd0c9f2034b57d3)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `7`
