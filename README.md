# Shiva Sah portfolio: v112

Open `index.html` after extracting this complete static website. All three HTML
pages are at the ZIP root; keep their CSS, JavaScript and assets alongside them.

## This update

Management Reports now opens with option B from the supplied hero options:
QuickBooks, Excel, Word and email fold into one report, followed by the builder.
The hero uses the portfolio's existing font tokens, responsive native text,
local scroll progress, a reduced-motion composition and a no-JavaScript fallback.
It does not import the demo's font setup or include its option switch.

Management Reports is enabled in the menu on every page and in the homepage
case-study card. The menus follow the existing card order: Agent Management,
Management Reports, then Domain-Centric Views, which remains Adding soon.

The asset audit removes 78 unused files (11.71 MB), reducing the assets folder
from 394 to 316 files. Active laptop frames 000 through 078 in both quality tiers,
report animations, static fallbacks and all gallery photos are retained unchanged.
The rest of the case-study content, sample-data labels and research-verification
backlog are preserved. Management Reports retains its existing noindex/nofollow
setting; enabling a link does not change search-engine indexing.

## Deployment cleanup

Uploading the new files over a GitHub repository will not remove old assets.
Use `ASSET-AUDIT-v112.md` for the exact paths to delete, or replace the website
files with this cleaned folder while preserving the repository configuration
and Git history. No server-side build step is required.

`V112-CHANGE-CHECKLIST.md`, `V112-QA-SUMMARY.json`, `V112-STATIC-CHECKS.json` and
`ASSET-AUDIT-v112.json` document the changes and checks. Browser tests were
isolated and offline; live hosting, Safari and external fonts were not tested.
No font files are bundled.

---

# Historical build notes (retained for context)

# v111: restored Management Reports output comparison

Start with `index.html`. The ZIP contains all three portfolio pages at the root.

The new `management-reports.html#output-comparison` section is immediately after
**The final experience**, before **The balancing act**. The earlier legacy-editor
comparison is retained; this section compares the finished report outputs.

It integrates the supplied *Management Reports: legacy vs modern* HTML with
6 legacy pages and 10 new pages, matched across 10 section headings. Both sides
scroll together. Section buttons, sticky column headings and an enlarged-page
reader support mouse, keyboard and touch. The report contents remain native
HTML/SVG, including charts and tables, rather than flattened screenshots.

The interface uses the portfolio's typography and colours. The report specimens
retain their own typography. No font files are bundled. Normal deployments load
the referenced webfonts; the site retains system-font fallbacks.

`REPORT-OUTPUT-COMPARISON.json` records the source and page map.
`V111-CHANGE-CHECKLIST.md` and `V111-QA-SUMMARY.json` record this update's checks.
The homepage, Agent Management and existing motion files are unchanged from v110.

---

# Shiva Sah portfolio: v109

Complete static portfolio based on v108. This build completes the paused Management
Reports revision and the follow-up request with the period explorations and supplied
seven-act report-building walkthrough. No build step or server-side code is required.

The ZIP root contains `index.html`, `agent-management.html` and
`management-reports.html`, plus the required CSS, JavaScript and `assets/`.
Keep that folder structure intact when deploying. Extract the ZIP before opening
`index.html`. An HTTP server may be used for local review.

## What changed

Management Reports now uses the supplied editor-layout sketch and all three supplied
period explorations. The period explanation focuses on the report's default date
range and explicit saved-report exceptions; its unfilled prototype link is removed.
The new seven-act walkthrough retains the supplied animation and automatically plays
the act selected by page scroll, then holds. Its narrative follows the actual demo:
template, cover, financials, KPI customisation, live-number writing, preview and
publish/send. The AI-generation action at the end of the source's fourth act is deferred.

AI-summary content and the optional epilogue have moved into
`MANAGEMENT-REPORTS-TODO.md`. Related AI-summary research, lifecycle, release and
influence wording has also been removed from the current page. The financial-report
summary may still be visible as document content within the supplied screenshots;
there is no AI-generation demonstration or claim in the current story.

The three research-table feedback cells are editable draft syntheses, not recorded
verbatims. Two native text note cards replace the unfilled research-image slots.
A draft customer-quote placeholder explains the time-period expectation. All of
these invented wording examples remain visibly labelled as drafts.

The requested text cleanup, simpler builder/editor headings, h4 Why it mattered
label, lifecycle spacing and editor-zone descriptions are included. Editable em
dashes across the website have been replaced with semicolons. Original text baked
into uploaded photographs and product screenshots is not modified.

## Metrics: illustrative, not verified

The homepage card, At a glance and Impact use matching values:

- 219.4K report saves: fictional layout value.
- 162.6K publish/send/export events: fictional layout value, scaled from the earlier
  ratio (38.4 / 51.8) times 219.4 and rounded to one decimal.
- 72% created-to-distributed: fictional rate for the draft; not derived from the
  event totals and not a measure of customer adoption.
- 47 FMHs: user-confirmed, with 19 business owners and 28 accountants.

The 2.5% legacy customer-adoption baseline was supplied by the owner. It is not
compared directly with a report-distribution rate because their denominators differ.
Visible illustrative labels remain in the relevant metric areas. Replace the fictional
values with verified analytics before presenting them as actual product results.
`REPORTS-METRICS.json` records these values and their status.

## Motion and accessibility

`management-report-flow.js` owns only the report walkthrough's scroll track.
The isolated player is `assets/reports/report-flow/player.html`, with 56 extracted
local WebP assets. Assets are decoded on demand; only a few recent views are retained
instead of decoding every full-length report image on startup. There are no new font
files, libraries, analytics or third-party animation dependencies.

Scrolling back selects the earlier chapter and replays it. The seven chapter buttons
also work with a keyboard. Playback stops offscreen, when the tab is hidden, and when
the site menu opens. Reduced-motion settings, very short viewports and no-JavaScript
visitors get seven static finished screens with the same descriptions. Image links
open an enlarged native dialog with Close/Escape and return focus; without JavaScript
they link directly to the original image.

## Preserved from v108

The full-width footers, two case-study links, email/copy button, high-contrast cursor,
bookshelf controls, compact experiment cards, eleven-photo Beyond the work section,
preloader and Agent Management laptop/final flow remain. Agent Management has only
punctuation changes in this version.

Homepage order: Agent Management, Management Reports, Domain-Centric Views.
Management Reports is linked from its homepage card and all three footers. Its
existing noindex setting is retained. Domain-Centric Views still says Adding soon.

## Owner follow-ups

`MANAGEMENT-REPORTS-TODO.md` holds the deferred AI-summary and epilogue copy, metric
verification and research-wording checks. `MANAGEMENT-REPORTS-ASSETS.md` lists the
remaining visual gaps; `MANAGEMENT-REPORTS-ASSET-MANIFEST.json` tracks active slots.

The Blue in Green still needs a reading URL. Social profile URLs in `site-config.js`
remain owner-supplied fields; no personal profile URLs have been guessed. The internal
cash-flow dashboard remains unlinked and does not fetch or expose internal data.

## Validation

See `V109-CHANGE-CHECKLIST.md`. Browser checks use offline Chromium with local assets
inlined in a test document; this environment blocks browser navigation to HTTP/file
URLs. Live hosting, external webfonts, Safari and third-party link destinations were
not tested. This package changes no GitHub repository by itself.

V106 through V108 checklists are historical records. `V108-PHOTO-MAP.json` still
represents the current gallery. No font files are distributed.


## v110
This build includes the replacement Management Reports flow and the accompanying cursor/content/layout refinements. See V110-CHANGE-CHECKLIST.md and MANAGEMENT-REPORTS-TODO.md. Keep the three HTML files at the root and upload the complete assets directory with the CSS/JS files; the replacement player is under assets/reports/report-flow-v110/. Usage figures marked sample data are not verified business results.
