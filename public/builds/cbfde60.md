# Trio Build cbfde60

Built 2026-10-17T00:57:25.000Z from `b9ad530..cbfde60`.

## Highlights

- **Lock-screen widget redesign and font options**
  - You can now add and reorder lock-screen widgets using drag-and-drop instead of tap-to-add/remove.
  - The Detailed lock-screen layout gains a new double-width glucose widget that occupies two configuration slots.
  - The Simple lock-screen widget exposes font face and font size options and shows a preview in its configuration screen.
  - Font choices for the Simple widget are included in the Live Activity state so changes apply to the lock-screen activity.
  - [View source](https://github.com/nightscout/Trio/pull/1566)
- **Remote meal edit and delete commands**
  - Trio can accept remote delete\_meal and edit\_meal commands to remove or replace logged meals.
  - An edit operation deletes the old meal and recreates it, so the meal receives a new id.
  - Remote actions wait for Nightscout, Health and Tidepool updates and report Nightscout failures in the command ack.
  - Meals that include fat/protein but lack the shared fpuID are rejected for remote changes with a clear message.
  - [View source](https://github.com/nightscout/Trio/pull/1579)
- **Improved Pod connections and Libre CGM info**
  - Trio can connect to InPlay pods in the background on iPhone 16 and 17e.
  - Trio gives up faster when a pod cannot be reached to avoid long hangs.
  - Trio stops sending pod state updates once pod deactivation starts.
  - Pod alert acknowledgments are saved earlier so they persist across sessions.
  - LibreLoop now records Libre 3 sensor events, tags backfilled readings, reports paired sensor model, and shows an in-app.
  - [View source](https://github.com/nightscout/Trio/pull/1639)
- **Glucose Bobble uses a black background**
  - Glucose Bobble contact images now always use a black background.
  - This prevents the bobble's white text from being hidden on watchOS.
  - Other contact images continue to use the background you selected.
  - [View source](https://github.com/gordolio/Trio/commit/8d814494048a8827546678390891ad90ee7e61f3)

## Build Metadata

- Source workflow: [38987193603](https://github.com/gordolio/Trio/actions/runs/38987193603)
- Previous built commit: [`b9ad530e633e9de452b6016b1ae6ca0388807057`](https://github.com/gordolio/Trio/commit/b9ad530e633e9de452b6016b1ae6ca0388807057)
- Current built commit: [`cbfde6099b3ef0b5bac97a2df7f141e10f0d6fa8`](https://github.com/gordolio/Trio/commit/cbfde6099b3ef0b5bac97a2df7f141e10f0d6fa8)
- Provenance model: `openai/gpt-5-mini`
- Generator: `0.3.1`, prompt `6`
