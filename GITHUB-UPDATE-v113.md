# GitHub update: v112 to v113

This patch fixes the Management Reports final-experience animation. It is an
incremental update to v112, not a standalone website. A repository running an
older version should use the complete v113 portfolio instead.

## Exactly five website files

| Action | Repository path | Purpose |
| --- | --- | --- |
| Replace | `management-reports.html` | Loads the fixed player and controls, with updated cache versions. |
| Replace | `management-report-flow.js` | Connects scroll chapters to the actual animation and handles loading, visibility, replay and retry. |
| Add | `management-report-flow.css` | Styles the playback controls, retry state and short-screen motion layout. |
| Replace | `assets/reports/report-flow-v110/player.html` | Loads the corrected animation engine. |
| Replace | `assets/reports/report-flow-v110/player.js` | Plays the seven acts and suspends interrupted motion instead of jumping to a finished still. |

The `report-flow-v110` folder name is intentional. Keep this exact path; do not
rename it to v113. The folder's 58 existing WebP images and `player.css` are
unchanged and are not included in the patch.

```text
repository root/
  management-reports.html
  management-report-flow.js
  management-report-flow.css
  assets/
    reports/
      report-flow-v110/
        player.html
        player.js
```

## Using github.com

1. Extract `shiva-portfolio-v113-github-patch.zip` on your computer.
2. Open your portfolio repository at its root, where `index.html` is located.
3. Choose **Add file > Upload files**.
4. Drag the extracted patch's three top-level files and its **assets folder**
   into the upload area together. Do not drag the enclosing patch folder or the
   ZIP itself. The nested folder structure must stay intact.
5. Check that the upload contains exactly the five paths listed above.
6. Use the commit message `Restore Management Reports final-experience motion`.
   Commit on your deployment branch if permitted, or propose a branch and merge
   the pull request according to your repository's workflow.

No files need deleting. Do not delete or replace the rest of the assets folder.
No update to `index.html`, `agent-management.html`, the landing hero files,
comparison files or existing image files is needed for this v112-to-v113 fix.

## Check after deployment

Open `management-reports.html#solution`. Keep the page still after entering a
chapter; the animated cursor and interface should continue moving, then stop at
that chapter's endpoint. Scroll to enter the next chapter. **Replay step**
restarts the current one.

With an operating-system reduced-motion preference, the page defaults to static
steps. The **Play animated walkthrough** button explicitly opts into motion.
With JavaScript disabled, the seven static steps remain readable.

The parent page, controller and player use updated v113 cache keys. Refresh the
page after your hosting provider has deployed the commit.

## What is included in the downloads

- **Patch ZIP:** only the five required website files, in their exact paths.
- **Complete portfolio ZIP:** the entire v113 site, including all three main
  HTML pages and the unchanged v112 assets.
- **This document / V113 checklist / QA summary:** documentation only. These are
  optional for GitHub and are not required to activate the fix.

## Verification and limits

All seven acts were played to completion with scroll-driven selection in
Chromium; tests sampled multiple intermediate animation states at a fixed page
scroll position. Interruption/resume, replay, rapid forward/backward selection,
error feedback, four responsive sizes, reduced-motion opt-in and the
no-JavaScript fallback were checked. All 45 JavaScript syntax checks passed,
with no missing direct local HTML resources or motion-image files.

The tests injected the local site's files and images into an offline browser;
network navigation is restricted in the test environment. Live GitHub hosting,
Safari and external webfont loading were not tested.
