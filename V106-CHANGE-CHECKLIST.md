# v106 - Requested-change checklist

Base: v105. Scope: Agent Management only.

| Requested change | Implemented | Recheck |
| --- | --- | --- |
| Replace final-flow screens with the uploaded HTML | Original source SVG drawing states, cursor movement, row selection, Java selection, CSV upload, attributes and installation progress are integrated | 28 source layers; every one of the 29 original timeline cues visited and asserted |
| Retain scroll triggers | One pinned case-study timeline, eight existing narrative beats, reversible scrolling | Forward and reverse at desktop/tablet/mobile widths; manual next/previous and Home/End |
| Keep only grey descriptions, now white | Original eight paragraphs unchanged; no orange labels or per-step headings remain | Paragraph equality against v105; computed text colour rgb(255, 255, 255) |
| Six sections each 100vh | Min-height 100vh with small-viewport support; grows if content needs space | All six are 900px at a 1440x900 viewport; each is at least the viewport height at every tested size |
| Remove Pause motion buttons | Removed from city and Admin Adnan on Agent Management | Zero matching controls in Agent Management; city motion still reaches its live ending |
| Replace old ZFI caption | Guided installation. Limited lifecycle coverage. | Old caption absent |
| Add ZFI information from screenshot | Context, installation-only scope, historical four-customer adoption, one-at-a-time installs, limited support, stronger competing solutions | Four limitations present inside the accordion, not shown while collapsed |
| Fix Learn more about ZFI collapsed state | Removed legacy minimum height and reserved content space | 58px closed; expands to content; returns to 58px |
| Center See why and fix its collapsed state | Centered width-constrained wrapper and compact summary | Center within 2px of viewport center; approximately 57px closed |
| Make COP black | Section, grid, copy and media containers set to #000 | Computed section background rgb(0, 0, 0) |

## Browser scenarios

Normal-motion viewports: 1440x900, 1366x768, 1280x720, 768x1024,
390x844, 360x640, 320x568, 844x390.
The flow stage, copy and controls fit within the sticky viewport at every size.

Reduced motion: 1440x900 and 390x844. No sticky scroll trap, no animated cursor;
all eight source-based still states can be selected with the controls.

No JavaScript: 390x844. All eight source SVG fallback screens load with their
original descriptions. Both native accordions open and close.

Additional interaction checks: all 29 source timeline cues; progress fill/count;
no movement after scroll settles; reverse scrolling; previous/next; keyboard
Home/End; rapid repeated accordion toggles; no null references after removing
motion buttons; no page-script exceptions in the tested scenarios.

## Package checks

- All three root HTML files are included.
- Homepage and Management Reports are unchanged from v105.
- Laptop CSS/JS and both Retina/standard frame sets are unchanged.
- Existing persona artwork and its shared CSS/JS are unchanged.
- All literal local HTML asset references resolve.
- Eight generated fallback SVGs parse as XML.
- No duplicate IDs in the Agent Management document or source template.
- All project JavaScript and inline page scripts pass syntax checks.
- No font files or embedded font payloads are packaged.
- ZIP integrity is checked after packaging.

## Test limits

Tests used the complete page and packaged resources in an offline Chromium
fixture, not a hosted site. External webfonts were unavailable, so visual checks
used the existing fallback fonts. No live deployment or Safari test is claimed.

## Source provenance

Flow: owner-supplied Agent Management - Install flow (scroll motion).html.
ZFI content: owner-supplied screenshot image(6).png, treated as historical project
context, not a newly verified market comparison.
