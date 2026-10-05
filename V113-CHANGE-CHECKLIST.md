# v113: Management Reports motion repair

## Fixed

- [x] Keep the original seven-act animation, not a series of changing posters.
- [x] Start an act when the animation screen is substantially visible.
- [x] Observe the screen as well as the long sticky track so upstream layout changes do not leave playback idle.
- [x] Suspend the active animation clock when offscreen, when a menu/dialog blocks the page, or while the tab is hidden.
- [x] Resume an interrupted act without marking it completed or jumping to its endpoint.
- [x] Load the lightweight player eagerly and repeat its startup handshake until ready.
- [x] Keep the initial poster for loading only; do not swap it on every chapter selection.
- [x] Display an explicit retry state on loading failure, not a silent slideshow.
- [x] Provide Replay step and replay when the active chapter marker is selected.
- [x] Keep motion on normal short/landscape screens; do not force a static fallback based on height.
- [x] Respect reduced-motion preferences by default and allow an explicit opt-in to playback.
- [x] Preserve the seven-step no-JavaScript and print fallbacks.
- [x] Update parent/player cache keys to v113.

## Preserved

- [x] Management Reports landing animation, wording and layout.
- [x] Existing persona/scenario text and scroll chapter sequence.
- [x] Deferred AI-generation action remains deferred.
- [x] Legacy/new report-output comparison.
- [x] Homepage, Agent Management and active navigation links.
- [x] All 58 motion-image bytes and the asset cleanup from v112.

## Tested

- [x] Seven complete acts, with multiple measured intermediate states while page scroll is fixed.
- [x] Interrupted chapter pauses and resumes without skipping.
- [x] Replay, rapid chapter changes and reverse chapter selection.
- [x] An error leaves a visible Retry animation control, not a silent poster sequence.
- [x] Motion at 1440x900, 390x844, 768x1024, 844x390 and 360x640.
- [x] Reduced-motion static default and explicit motion opt-in.
- [x] Seven readable no-JavaScript steps.
- [x] 29 external JavaScript files and 16 inline scripts pass syntax checks.
- [x] Local resource references and exact v112-to-v113 changed-file list.

See V113-QA-SUMMARY.json for recorded act states and viewport checks. Browser
verification used injected local bytes with no network; live hosting, Safari
and external webfonts were not tested. The complete website's unrelated long
animations were preserved by byte comparison, not rerun end to end.
