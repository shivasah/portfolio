# Asset audit: v112

## Result

- Original assets: 394 files; 37,985,795 bytes.
- Retained assets: 316 files; 26,280,349 bytes.
- Removed assets: 78 files; 11,705,446 bytes (11.71 MB).
- Asset-folder reduction: 30.8%.

## How usage was checked

The audit starts from index.html, agent-management.html and management-reports.html. It follows their local CSS, JavaScript, SVG and helper HTML. It checks HTML sources, responsive image sets, CSS URLs, image paths in scripts and configuration, and image maps. Documentation and unreferenced legacy code are not active entry points. Referenced maps are retained conservatively, even for paths not exercised in a browser test.

The laptop controller constructs frame paths. Its current FINAL_FRAME is 78, so all frames 000 through 078 are retained in both standard and retina tiers. Frames 079 through 104 had already been excluded from playback to prevent the cropped final zoom, and are removed here. The source controller is unchanged.

Every retained asset is byte-identical to the corresponding v111 asset. The original v111 ZIP is not modified.

## Preserved

- Both active laptop quality tiers and the starting posters.
- Agent Management scroll-flow SVGs and the city-animation still.
- Management Reports player assets, static fallback screens, health-note SVGs and helper HTML.
- All eleven Beyond the work images, existing previews, thumbnails, diagrams and wordmarks.

## Removed paths

| Path | Bytes | Reason |
| --- | ---: | --- |
| `assets/admin-adnan-v63.webp` | 32,162 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-camera.webp` | 786,332 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-city.webp` | 813,676 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-hero-macbook-v75.png` | 945,789 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-junction.webp` | 798,606 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-laptop/frames/retina/frame-079.webp` | 194,454 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-080.webp` | 194,244 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-081.webp` | 195,110 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-082.webp` | 196,022 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-083.webp` | 194,114 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-084.webp` | 194,532 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-085.webp` | 196,132 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-086.webp` | 194,380 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-087.webp` | 195,026 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-088.webp` | 193,904 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-089.webp` | 195,828 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-090.webp` | 192,876 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-091.webp` | 195,212 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-092.webp` | 196,138 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-093.webp` | 194,424 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-094.webp` | 191,516 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-095.webp` | 191,276 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-096.webp` | 190,358 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-097.webp` | 190,470 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-098.webp` | 185,794 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-099.webp` | 187,034 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-100.webp` | 186,322 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-101.webp` | 187,932 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-102.webp` | 190,518 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-103.webp` | 192,454 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/retina/frame-104.webp` | 189,020 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-079.webp` | 88,556 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-080.webp` | 88,074 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-081.webp` | 87,842 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-082.webp` | 88,638 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-083.webp` | 88,340 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-084.webp` | 88,202 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-085.webp` | 84,448 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-086.webp` | 89,324 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-087.webp` | 89,140 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-088.webp` | 87,770 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-089.webp` | 88,152 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-090.webp` | 88,084 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-091.webp` | 87,280 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-092.webp` | 86,646 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-093.webp` | 85,568 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-094.webp` | 83,452 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-095.webp` | 83,088 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-096.webp` | 82,748 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-097.webp` | 81,932 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-098.webp` | 79,860 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-099.webp` | 79,952 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-100.webp` | 80,454 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-101.webp` | 77,682 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-102.webp` | 82,880 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-103.webp` | 84,302 | Outside the active laptop frame range. |
| `assets/agent-laptop/frames/standard/frame-104.webp` | 79,962 | Outside the active laptop frame range. |
| `assets/agent-laptop/manifest.json` | 2,096 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-laptop/poster-retina.webp` | 189,020 | Unreferenced by the live pages and their dependencies. |
| `assets/agent-laptop/poster-standard.webp` | 79,962 | Unreferenced by the live pages and their dependencies. |
| `assets/current-entity.webp` | 36,682 | Unreferenced by the live pages and their dependencies. |
| `assets/current-list.webp` | 29,946 | Unreferenced by the live pages and their dependencies. |
| `assets/feedback-entity.webp` | 3,244 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-01.webp` | 94,102 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-02.webp` | 102,688 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-03.webp` | 27,560 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-04.webp` | 46,104 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-05.webp` | 32,838 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-06.webp` | 31,758 | Unreferenced by the live pages and their dependencies. |
| `assets/flow-07.webp` | 62,422 | Unreferenced by the live pages and their dependencies. |
| `assets/project-placeholder-01.svg` | 904 | Unreferenced by the live pages and their dependencies. |
| `assets/prototype-02.webp` | 42,710 | Unreferenced by the live pages and their dependencies. |
| `assets/prototype-03.webp` | 36,334 | Unreferenced by the live pages and their dependencies. |
| `assets/question-doodle.webp` | 143,704 | Unreferenced by the live pages and their dependencies. |
| `assets/sketch-01.webp` | 53,078 | Unreferenced by the live pages and their dependencies. |
| `assets/sketch-02.webp` | 66,766 | Unreferenced by the live pages and their dependencies. |
| `assets/sketch-03.webp` | 22,836 | Unreferenced by the live pages and their dependencies. |
| `assets/vibe-squarekin-code.svg` | 6,661 | Unreferenced by the live pages and their dependencies. |

## Updating an existing GitHub repository

This is a complete cleaned build. Copying or uploading new files over an existing repository does not delete old files. Remove the paths in the table above from the existing repository as part of the update. Retain repository configuration and its Git history.

ASSET-AUDIT-v112.json also contains the complete retained-file list, reference sources and dynamic-path rules.
