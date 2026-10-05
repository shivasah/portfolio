# v111: restored Management Reports output comparison

## Requested change

- [x] Restore the section comparing the old and new finished report outputs.
- [x] Use the uploaded `Management Reports - legacy vs modern.html` comparison.
- [x] Place it after the final walkthrough and before the balancing act.
- [x] Retain the earlier comparison of the editor interfaces; the new section is about the outputs.

## Integration

- [x] Preserve the 6 legacy pages and 10 new report pages across 10 matched sections.
- [x] Preserve the supplied contents, charts, tables, numeric values and intentional empty legacy sections.
- [x] Use the portfolio fonts and colours for the section heading, explanations and controls.
- [x] Retain the report specimens' typography, rather than styling them as portfolio copy.
- [x] Keep matched pages aligned in one shared scrolling viewer.
- [x] Add sticky section buttons and column headings without overlap on small screens.
- [x] Add the comparison to the case-study section-progress navigation.
- [x] Keep page contents as native HTML/SVG, not flattened screenshots.
- [x] Add enlarged page reading, Fit page / Actual size, Escape / close, focus restoration and unique SVG IDs.
- [x] Keep the site's existing magnetic cursor visible in the enlarged reader's top layer.
- [x] Support reduced motion and show all report pages without JavaScript.
- [x] Allow scrolling to continue into the next page section at the viewer's bottom boundary.

## Preservation checks

- [x] Homepage and Agent Management are byte-identical to v110.
- [x] All existing Management Reports sections and footer are unchanged.
- [x] Both the walkthrough controller and its source assets are unchanged.
- [x] Metrics and their existing verification labels are unchanged.
- [x] No font files or embedded font payloads are bundled.
- [x] All three HTML pages remain at the ZIP root.

## Browser and file checks

- [x] Desktop 1440x960; tablet 1024x768; mobile 390x844 and 360x640.
- [x] All ten section buttons select and align the correct pair at every tested size.
- [x] All sixteen page-enlargement buttons open and close correctly.
- [x] Keyboard navigation, focus restoration, normal-motion and reduced-motion behavior.
- [x] Touch-capable mobile: section selection, page enlargement, actual size and close.
- [x] No-JavaScript pages render with the enhancement-only controls hidden.
- [x] No page-width overflow, missing local references, new duplicate IDs or JavaScript errors.
- [x] Source-content text match, JavaScript syntax and ZIP integrity.

Tests used offline Chromium with local resources fulfilled from disk and external requests blocked.
Live hosting, real webfont loading, Safari and Firefox were not tested in this update.
The comparison is a presentation of the supplied example, not a verification of its financial data.
