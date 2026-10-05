# v108 change checklist

## Homepage

- [x] Add the supplied Voice User Interface Design workshop poster to Beyond the work.
- [x] Fade in the preloader; prevent incomplete artwork, header and page content from flashing at startup.
- [x] Show Agent Management's initial and final time-to-value values.
- [x] Correct the installation metric label to measured install time, with both initial and final values.
- [x] Put Agent Management first, Management Reports second, Domain-Centric Views third.
- [x] Remove Domain-Centric Views' KPIs and show Adding soon instead.
- [x] Replace Management Reports' card metrics with specific existing usage/research/parity figures.
- [x] Show Read now and Back to shelf when a book is selected.
- [x] Keep resting and opened books clear of the shelf bottom and right boundary.
- [x] Remove both the "A musical letter..." and "Two to try..." introductory lines.
- [x] Reduce experiment-card size; reveal the detailed explanation through a click-to-open dialog.
- [x] Remove Beyond the work's upper-left label (the central heading remains).
- [x] Increase the animated Beyond the work section's height and vertical space by 1.5x.
- [x] Remove its gesture instruction and Pause motion control while retaining the orbit/selection behavior.
- [x] Replace the approach statement with the exact requested ambiguity/assumptions statement.
- [x] Use the supplied turtleneck portrait with a dark section and soft edge blending.

## Footers and shared interactions

- [x] Fix the inherited second grid column: the case-study footer's top and bottom span the full viewport width.
- [x] Link to Agent Management and Management Reports in every page footer.
- [x] Add sah.shiva@gmail.com directly after GitHub, in matching styling.
- [x] Add an explicit email copy button, temporary Copied feedback and an accessible status message.
- [x] Reset old success feedback before each new copy attempt; never show success after denied copying.
- [x] Retain a selection-based fallback for environments where Clipboard API access is unavailable.
- [x] Give the magnetic cursor both dark and light outlines on all three pages.

## Latest Agent Management corrections

- [x] Attribute the emergency holiday work to customers' employees, not AppDynamics teams.
- [x] Replace the specified city-sentence em dash with a semicolon.
- [x] Remove the enclosing low-fidelity iteration cards; outline each screen in black.
- [x] Show the explanation next to each screen; stack naturally on small screens.
- [x] Remove both Installation complete labels from the embedded flow artwork.
- [x] Preserve the final-flow scroll controller, laptop sequence and existing case-study text elsewhere.

## Verification record

- First-paint test: main content and header hidden; signature wrapper opacity zero before the fade.
- Work stack: three cards appear in the requested order, all controls fit at 360 x 640.
- Book test: all seven selections open; six supplied reading URLs match their entries; Back to shelf closes.
- Shelf: positive lower/right clearance for every resting spine at tested desktop/mobile sizes.
- Tool dialogs: open, Escape close and focus return checked; three compact cards use the retained content.
- Gallery: eleven cards, including the new workshop; keyboard select/close and responsive open-card fit checked.
- Footer: full top/bottom widths on all three pages; both case-study links and configured email present.
- Copy: success, fallback success and denied-copy feedback paths checked with controlled responses.
- Case-study regression: laptop 0 -> intermediate -> 78 -> 0; final flow still updates from scroll.
- Reduced-motion/touch views on all three pages: no page errors in the checks.
- No new JavaScript syntax errors, missing direct local HTML references or duplicate static IDs.
- ZIP contains index.html, agent-management.html and management-reports.html at root.

### Known limitations, not silently invented

- The Blue in Green has no supplied online reading destination. Its reading control is unavailable with a note.
- Existing social buttons still use their v107 destinations; no personal profile URLs were invented.
- Offline Chromium/local-asset checks are not live hosting or Safari tests. External webfonts and websites were not verified.
- No original laptop frames, case-study performance measurements, persona artwork or other evidence were replaced with invented material.
