# v110: Management Reports refinements and replacement walkthrough

Base: v109. Final-flow source: the latest `Monthly financial summary - building a report(2).html` upload. The `(1)` and `(2)` uploads have identical bytes; `(2)` is recorded as the source.

## Final-flow replacement

- [x] Replace the earlier rendering code and assets with the latest upload's selected-template state, resize handle/drag behaviour, text-block hover and slower preview scrolling.
- [x] Preserve the seven stages: template, cover, financials, KPIs, live-number commentary, preview, publish/send.
- [x] Retain the earlier request to defer the AI-generation beat; act 4 stops after resizing the KPI.
- [x] Put the persistent Emily/James scenario above the UI; show a short white paragraph beside the screen on desktop, as in Agent Management.
- [x] Use the portfolio page's scroll position, not the standalone demo's global scroll snap.
- [x] Preserve previous/next controls and seven direct chapter buttons.
- [x] Decode the views before displaying them and prepare transient patch/hover assets. Keep a small view cache rather than decoding all of the source's approximately 143.1 million image pixels at once.
- [x] Use a new `assets/reports/report-flow-v110/` path, avoiding stale player assets.
- [x] Regenerate seven fallback stills from the updated renderer.

## Global cursor

- [x] Replace overlapping scribbles and heavy outlines with one grey/white circle.
- [x] Use an orange/grey centre dot.
- [x] Turn the two-colour split with pointer travel; retain magnetic targeting and press feedback.
- [x] Apply on the homepage and both case-study pages.
- [x] Keep a native cursor on touch/reduced-motion devices and native dialogs.

## Management Reports: numbered feedback

1. [x] Remove the repeated long usage disclaimer.
2. [x] Remove repeated per-card illustrative-value text. A short `Usage figures: sample data` marker remains for the invented usage figures; the 47 research sessions remain distinguished as confirmed.
3. [x] Give the doctor's note a handwritten treatment. [ ] Exact Lastoria webfont match: the supplied preloader has only signature outlines. The page uses local Lastoria when installed, otherwise fixed vector handwriting. No font binaries are included.
4. [x] Remove the `06` persona section label, keeping the main heading `Two people, one document`.
5. [x] Put Emily's three tasks on taped sticky notes.
6. [x] Match Emily/James name sizes and give their editor/reader subtitles a lower hierarchy.
7. [x] Replace the July-December row with a timeline and parallel July-November research band. Do not invent session counts per month.
8. [x] Add the uploaded legacy editor screenshot. Use an actual supplied walkthrough still for the new-editor comparison.
9. [x] Make `Design system partnership` an h1.
10. [x] Shorten the prose and add a schematic of QuickBooks foundations, the report builder and reusable shared patterns.
11. [x] Remove the repeated five-zone text after the supplied layout image. Remove the redundant unfilled early/settled sketch pair; keep that optional material in the backlog.
12. [x] Make the three date explorations smaller and place them in a controlled carousel. Support buttons, keyboard, touch and enlargement; show all three without JavaScript.
13. [x] Use the Agent Management-style scenario/screen layout for the final experience.
14. [x] Remove `14 - The balancing act`.
15. [x] Remove its image placeholder.
16. [x] Put Must have and Sequenced on sticky notes.
17. [x] Give coherence a stronger heading and four notes covering cross-surface patterns, the existing token audit, review checkpoints and content design.
18. [x] Make `Impact` an h1 without a serial number.
19. [x] Remove the repeated long disclaimer from Impact; retain the short sample-data marker.
20. [x] Put 9%, 32% and 72% on sticky notes; reveal definitions on hover, keyboard focus or tap without moving neighbours.
21. [ ] Before/after increases are not fabricated. The user-supplied 2.5% refers to customer adoption; 9%, 32% and 72% have different event denominators. Like-for-like legacy funnel measurements are needed before a lift can be shown.
22. [x] Add the migration bottleneck: different architectures prevented a seamless transfer of saved legacy reports, increasing the effort of switching; propose migration as part of onboarding.
23. [x] Rebuild the report-tools strip from the supplied upload, with the portfolio typography and no demo playback controls. Its source is identical to the earlier strip; playback now stops requesting frames offscreen.
24. No instruction was supplied.

## Preserved

- Homepage project order, books, experiments, photographs, hero, portrait and links.
- Agent Management laptop/installation animations and content.
- Footer widths, both case-study links, email and copy controls.
- The Management Reports health chapter timing and April hold, except for the note lettering.
- Previously deferred AI-summary and epilogue work in `MANAGEMENT-REPORTS-TODO.md`.

## Verification

- All seven updated acts completed at normal speed, with all displayed images decoded and no JavaScript errors.
- Reverse chapter selection and rapid cancellation/reselection completed correctly.
- The host's seven scroll stops selected the matching child acts.
- Desktop 1440x900, tablet 768x1024, phones 390x844 and 360x640: no horizontal document overflow; the pinned scenario, screen, copy and controls fit inside the viewport.
- Carousel next/previous/direct selection, image enlargement, funnel hover/tap, equal persona typography, strip visibility behaviour, reduced-motion and no-JavaScript screens checked.
- Cursor colours and operation checked on all three pages.
- Syntax, local runtime references, IDs, source-asset hashes and ZIP integrity checked.

Environment: offline Chromium using in-memory HTML and embedded local assets. Managed browser navigation prevented a local HTTP/file navigation test. No security settings were changed. Live hosting, Safari and external webfonts were not tested. These checks are not a guarantee against every browser-specific issue.
