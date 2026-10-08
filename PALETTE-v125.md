# v125 colour system

The portfolio uses warm limestone, olive, moss and burnt clay. The semantic
rules are in `portfolio-earth.css`, loaded after the existing component styles.
Legacy palette literals in decorative CSS, SVG and canvas code have matching values.

| Role | Colour | Hex |
| --- | --- | --- |
| Main surface | Warm limestone | `#F3F0E7` |
| Secondary surface | Pale stone | `#E4DFD2` |
| Primary text | Olive charcoal | `#292E26` |
| Secondary text on limestone | Weathered olive | `#666C5E` |
| Primary controls / secondary text on coloured paper | Deep moss | `#4F6248` |
| Editorial accent | Burnt clay | `#9C4E3B` |
| Dark surfaces | Forest charcoal | `#252F29` |
| Soft notes / inverse interactive emphasis | Sage | `#D7DECD` |
| Soft notes | Oat | `#E6D8B8` |

## Roles

Moss is used for primary controls and active interface states. Clay highlights
editorial content and decorative motion. Forest surfaces carry limestone text and
sage focus/hover states. Notes use sage, oat, stone, or forest rather than saturated
orange/yellow. Secondary text on stone/sage/oat uses moss to improve contrast.

The header/menu uses a light wordmark on the forest menu and a dark wordmark in the
light floating pill. Cursor size, motion and magnetic behaviour are unchanged;
its grey/white pair is now weathered olive/limestone, with a clay centre accent.

## Artwork boundaries

Product screenshots, Cisco interface SVGs, the QuickBooks report pages and the
report-player frame images retain their native colours. Gallery photographs and the
portrait are unchanged. The portrait section retains its photographic dark backdrop.

Only the outer backdrop pixels of the three homepage case-study thumbnails were
changed to pale stone. Their product-interface areas are protected, and the images
were saved losslessly at the original dimensions. The existing filenames are retained;
resource references use v125 cache keys.

Decorative pencil illustrations, the city metaphor, health metaphor, preloader,
homepage hero accents and report-tool strip use the portfolio palette. No new
libraries, fonts or remote services were introduced.

## Preserved behaviour and content

Page wording, navigation URLs, fonts, heading sizes, layout dimensions and component
placement are unchanged. The homepage's one-second holds and 35-second full loop are
preserved. The Management Reports first-screen opacity fix and animated seven-act
player are retained.

## Verification scope

Local Chromium renders at 1440 x 1000 and 390 x 844 were checked. Before/after
section dimensions and heading dimensions matched in that renderer. Menus, principle
hover, first-frame visibility, the first report act, menu suspension/resumption and
hero holds were exercised. All 45 JavaScript syntax checks passed, with no missing
direct local resources, duplicate IDs or broken local anchors on the main pages.

External webfonts could not load in the test environment, so visual tests used the
configured fallbacks. Live hosting, external links and Safari were not tested.
This is not a claim of a full accessibility certification.
