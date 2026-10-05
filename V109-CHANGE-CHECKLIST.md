# v109: Management Reports revision checklist

This build combines the paused Management Reports edits with the follow-up period
explorations and final-experience HTML. Base: the complete v108 portfolio.

## Paused request completed

- [x] Removed the long next-generation Management Reports hook beneath the hero.
- [x] Updated the requested draft usage figures to 219.4K saves, 162.6K publish/send/export events and 72% created-to-distributed. They are visibly labelled illustrative, not verified analytics.
- [x] Kept the confirmed 47 FMHs and participant mix: 19 business owners and 28 accountants.
- [x] Added the supplied 2.5% legacy customer-adoption context without presenting it as comparable to report-distribution rate.
- [x] Changed Why it mattered to an h4 label and removed its 05 prefix.
- [x] Replaced the research-table TODOs with realistic, explicitly draft feedback summaries.
- [x] Removed the saved-custom-report-period research row.
- [x] Removed the exact former Illustrative example, not a participant quote text; replacement invented wording is labelled as draft, not a real quotation.
- [x] Replaced the two unfilled research-image slots with editable taped text notes.
- [x] Increased spacing below the lifecycle scope explanation before the release cards.
- [x] Replaced editable em dashes with semicolons across all three pages and their text assets. Text embedded in supplied images is unchanged.
- [x] Removed the 09 Learning from legacy label.
- [x] Simplified the builder heading to Building a report editor for QuickBooks.
- [x] Simplified Decision 02 to Bring numbers and commentary into one editor.
- [x] Installed the supplied editor sketch. Descriptions now acknowledge all five zones shown, including the footer.

## Follow-up request completed

- [x] Used all three original period-exploration screenshots, without cropping or re-creating their UI.
- [x] Put explanations beside each screenshot on desktop and underneath on smaller screens.
- [x] Added click-to-enlarge image dialogs with keyboard Close/Escape and focus return.
- [x] Refocused the period story on using the report period by default and making saved-date exceptions explicit.
- [x] Removed the unfilled period-prototype link and final-pattern placeholder.
- [x] Added a draft customer-quote placeholder about expecting added numbers to match the report period. No real participant attribution is invented.
- [x] Removed the dedicated AI-summary section and its related research/lifecycle/release/influence story from the current page.
- [x] Preserved the AI-summary chapter and restoration tasks in MANAGEMENT-REPORTS-TODO.md.
- [x] Removed the optional epilogue and saved its copy and restoration tasks in the same Markdown backlog.
- [x] Replaced final-flow placeholders with the supplied seven-act HTML animation.
- [x] Updated the acts to template, cover, financials, KPIs, live-number writing, preview, publish/send.
- [x] Omitted the AI-generation action at the end of act 4; its current ending is the resized KPI card.
- [x] Kept scroll-based act selection, sticky presentation, complete chapter playback and held endings.
- [x] Kept earlier-chapter navigation when scrolling upward. It replays the selected chapter rather than reversing each animation frame.
- [x] Synchronized homepage, At a glance and Impact usage values and illustrative status.

## Runtime and asset checks

- [x] Every one of the seven original-adapted acts played to completion in Chromium using its actual timing.
- [x] Forward chapter selection tested through all seven acts; reverse selection tested back through acts 6, 3 and 1.
- [x] Animation end states verified: vp3, 6, 8, 15, 27, 28, vp30.
- [x] Readable static seven-screen fallback tested for reduced-motion and no-JavaScript visitors.
- [x] Menu opening and closing tested after the new walkthrough.
- [x] Image dialog opening and Escape closing tested.
- [x] Walkthrough image and description fit inside 1440x900, 1366x768, 768x1024, 390x844 and 360x640 viewports.
- [x] No horizontal page overflow at those tested sizes.
- [x] Homepage card contains matching 219.4K, 162.6K, 72% and 47 values.
- [x] Final browser run reported zero JavaScript page errors.
- [x] All inline and external JavaScript passes syntax checks.
- [x] No duplicate IDs or missing local file/anchor references in the static audit.
- [x] Three exploration images and editor sketch are byte-for-byte copies of the supplied images.
- [x] The new player has 56 original extracted WebP assets and seven rendered static end-state images.
- [x] No font files or embedded font binaries are distributed.
- [x] Agent Management matches v108 apart from requested punctuation changes and cache-version updates.

## Testing scope

Browser navigation to HTTP and file URLs is blocked in this environment. Runtime
checks used offline Chromium documents with the actual local CSS, JavaScript and
image assets inlined by the test harness. External webfonts were unavailable; browser
fallback fonts were used. Live deployment, Safari, third-party destinations and the
normal file-URL path were not tested. No changes were pushed to GitHub.

## Still awaiting owner content

Six unrelated image slots remain: hero/device, legacy comparison, new-editor
comparison, early canvas sketches, settled layout and balancing-act illustration.
See MANAGEMENT-REPORTS-ASSETS.md for paths. Fictional metrics and draft research
wording must be verified or retain their visible labels before public use.
