# Shiva Sah - portfolio v87

GitHub Pages-ready static portfolio. Deploy the contents of this folder at the repository root; the homepage is `index.html`.

## Pages

- `index.html`: homepage, selected work, notes and essays, experiments, approach and contact.
- `agent-management.html`: Agent Management case study, including the new scroll-driven city analogy.
- `management-reports.html`: unlinked work-in-progress page. Management Reports still displays **Adding soon** on the homepage and in the menu. An unlinked HTML page is not access-controlled.
- Domain-Centric Views remains **Adding soon**; its case-study page is not included.

## v87: bookshelf and experiments polish

The bookshelf and project sections remain. The standalone section labels have
been removed; menus and chapter-rail labels are now **Notes & essays** and
**Experiments**. The Agent Management footer says **Essays & research**.
Existing `#writing` and `#vibes` anchors and configuration keys remain unchanged,
so previously saved links still work.

Selected books now move ahead of the other spines in the actual 3D scene, not
just to a larger z-index. When closed, a cover rotates spine-first before it
returns to its slot. Conflicting historical z-index overrides were removed.
The Read now control remains above the books.

The experiments keep a fixed neutral background. The shared page-wide orange
scroll blend has been removed; the closing manifesto owns a static orange
surface instead. Typography, pill buttons, hero animation, magnetic cursor,
Agent Management city sequence, and project destinations are unchanged.

### Cash Flow dashboard preview: capture still needed

**The actual dashboard screenshot is not included.** No accessible dashboard
capture or export was supplied; the localhost URL belongs to the owner's
computer. The existing labelled workflow illustration remains visible. No
private records or invented dashboard visuals were added.

A non-clickable two-fold preview is ready in `cashflow-preview.js` and
`portfolio-polish.css`. To activate it:

1. Export a sanitized image containing exactly the first two screenfuls of the
   dashboard. Redact names, private feedback, identifiers and internal URLs as
   appropriate. Do not include the rest of a long dashboard in this image.
2. Save it as `assets/cashflow-first-two-folds.webp` (PNG/JPEG/AVIF also work).
3. Set `cashflowPreview.imagePath` in `site-config.js` to that local asset path.
   Update its `alt` text to describe the sanitized capture.

The preview crops to one fold and pans to the second, pauses briefly, and returns
to the top on a 24-second repeating cycle. It pauses on hover, keyboard focus,
when offscreen, and when the browser tab is hidden. There is an explicit
Pause/Play control. Reduced-motion preference starts with a static first fold;
manual playback is still available. Missing/invalid captures leave the workflow
illustration intact. No internal dashboard link or localhost request is made.

### Checks for this edit

- JavaScript syntax and all local HTML asset references pass.
- Local in-memory browser rendering: no JavaScript errors at desktop and mobile
  widths; no horizontal page overflow in the checked layouts.
- Book cover hit tests: 20/20 tested interior points belong to the selected book,
  on desktop and mobile; the v86 desktop baseline passed only 8/20 points.
- Close/return animation, publication filter, menu toggle position and labels
  pass. The orange transition is absent from the generated scroll transitions.
- Optional image panning, pause/resume, reduced-motion and offscreen suspension
  were tested with a synthetic geometric image. That fixture is NOT shipped and
  was NOT represented as the actual dashboard.
- The two external live website embeds were not reverified in this edit.

## v86: public experiments restored

The homepage's experiments section is restored between the bookshelf and the manifesto, at `index.html#vibes`. The shared menu on all three pages now links to it. The three projects are Letterwave, Squarekin, and Cash Flow Feedback.

Letterwave and Squarekin have separate public Explore links (new tabs) and lazy, view-only live website embeds. The preview itself is also a link. The iframe has no pointer or keyboard interaction, so it does not capture page scrolling. Website typography is isolated inside the frame; the portfolio keeps its own Cabinet Grotesk / Syne font tokens and existing pill-button styles. No font binaries, external app source, or external app styles have been copied into this build.

Frames load only near the section and are removed offscreen or when the browser tab is hidden. A Pause preview button removes the frame. Reduced-motion/data-saving settings use an illustrated cover until Load live preview is explicitly selected. No-JavaScript, offline and network-failure states retain clearly labelled project illustrations and working external links. The Squarekin illustration includes an ordinary QR linking to Squarekin; it is not an export or screenshot of Squarekin's QR artwork.

**Live-preview verification limitation:** the public pages were read using web retrieval, but this build environment blocks browser navigation to these hosts. The actual live embeds could not be visually verified here. Frame lifecycle, responsive scaling, controls and failure handling are tested with local browser fixtures; the covers are not presented as screenshots. Deployed embeds depend on the destination sites allowing iframe embedding. Cross-origin CSP/X-Frame-Options refusals cannot reliably be detected from the parent; the separate Explore links always remain available.

Cash Flow Feedback is a non-clickable internal-project card. Its graphic is explicitly a workflow illustration, not a dashboard screenshot. It contains only the owner's supplied workflow: UserVoice feedback -> Slack integration -> internal dashboard, five updates a day while the laptop is on. No feedback records, fabricated metrics, internal routes, or localhost URL are included. A real dashboard preview needs an owner-supplied sanitized screenshot.

Project descriptions are based on the owner's brief. Public preview targets:
- https://letterwave.vercel.app/
- https://squarekin.vercel.app/

Public source pages additionally describe URL-contained letters without a message database (Letterwave), and offline use and multiple export formats (Squarekin). No backend or security audit was performed.

Files added: `vibe-codes.css`, `vibe-codes.js`, `assets/vibe-codes-preview.svg`, `assets/vibe-squarekin-code.svg`.
Menu copies are updated in `index.html`, `agent-management.html`, and `management-reports.html`. The section label and thumbnail are defined in `app.js`. Modified script and stylesheet references use `?v=87` in the current build to refresh cached files.

The homepage hero, magnetic cursor, menu-to-close control, and scroll-driven Agent Management city sequence are unchanged. Management Reports and Domain-Centric Views remain Adding soon / unlinked.

## v85: scroll-driven city analogy

Replaces the separate city introduction and three static illustrations with the supplied Intelligent intersection canvas animation. The existing wording is retained.

The story pins to the viewport. Native scrolling advances through clouds, city, congestion and camera deployment, with matching text overlays. Scrolling back reverses the sequence. At the end, the camera stays at the intersection while traffic, signals and camera scans continue moving. Scrolling farther releases the pin into the next section. The final scene does not restart the cloud descent.

The ending includes a small portfolio-styled Pause motion / Resume motion control. A keyboard-only Skip city story link bypasses the sequence. Reduced-motion and no-JavaScript views show a still with all narrative text instead of requiring animation.

Files for this section:

- `agent-management.html`: the four text overlays inside `#background`.
- `agent-city-story.css`: responsive composition, typography, pin height and fallback layout.
- `agent-city-story.js`: the supplied scene renderer, cached scroll frames and final live hold.
- `assets/agent-city-motion-still.webp`: static fallback captured from the actual animation.

The section is 650svh (6.5 viewport heights): 450svh for the scroll-controlled narrative, 100svh for the pinned ending, and the final 100svh for leaving the section. To adjust pacing, change the enhanced section height in `agent-city-story.css`; the controller derives the timeline distance from the rendered section and stage sizes.

Homepage hero behaviour, shared magnetic cursor, menu-to-close transformation, fonts and existing page content outside the city analogy remain from v84d. Agent Management now clips inherited horizontal artwork overflow without creating a nested vertical scroll container, so the pinned view stays aligned on mobile.
