# v107 change checklist

## Homepage

| Requested item | Implementation / check |
| --- | --- |
| Remove section color changes on scroll | Removed the interpolation controller and injected spacers; compared computed backgrounds at work, writing, experiments and Beyond the work. |
| Use the uploaded images | All ten local WebP images load and decode; complete image bounds are retained. |
| Accurate event descriptions | Uses owner-provided descriptions and the supplied poster labels; no unsupported workshop dates or presenter names added. |
| More space around flying cards | Separate inset orbit viewport leaves quiet space above and below the cards. |
| Visiting faculty credit | Both hero animation and accessible text retain NID Andhra Pradesh only. |
| Photo interaction quality | Each of the ten cards opens, fits the viewport, and closes with Escape; the selected card sits in front and is rendered at reading resolution. |

### Photo mapping

| Supplied image | Card / description |
| --- | --- |
| Avantika.jpeg | Designing conversations, Avantika University. |
| Design like.jpeg | Design like a detective, online University of Washington talk during Protothon '25. |
| Think like.png | Think like a product designer, online University of Washington talk during Protothon '26. |
| REVA uni.jpeg | Judging REVA University's UX design hackathon. |
| Sweden.jpeg | Presenting the group's work at Campus Varnamo, Sweden. |
| Level up your port.jpeg | Online portfolio discussion session. |
| Live session.jpeg | Online UX talk, including habituation. |
| UX Switch.jpeg | Online UX AMA for architecture students. |
| India HCI.jpeg | Cultural sensitivity through speculative design workshop, co-led with two other presenters. |
| PhillyCHI.jpeg | Guest judging, PhillyCHI Design Slam. |

Protothon judging is mentioned separately, without re-labeling the PhillyCHI photo.

## Agent Management

| Requested item | Implementation / check |
| --- | --- |
| Smaller responsibility text | Introductory paragraph is 19-25px, responsive. |
| ZFI image must not move on accordion open | Top-aligned evidence column; dimensions reserved; desktop document and viewport positions are unchanged on open/close. |
| Remove Guided installation caption | Deleted from markup. |
| Remove Learning from ZFI card numbers | Deleted just these number badges; other narrative steps are retained. |
| See why bottom border | Explicit four-sided border, visible overflow, bottom clearance; collapsed border is inside the sticky viewport. |
| See why grows section without moving content | Disclosure height expands both scene and containing track; card progress excludes this added height. Heading/card positions tested before and after open. |
| Decision 5 black background | Section and immediate content field resolve to #000. |
| COP copy closer to UI | 24px layout gap plus removal of blank padding at the top of the source image's presentation. No source image edits. |
| Learning section 120vh | Computed minimum section height checked at desktop and phone sizes. |
| Horizontal rough arrows | Existing diagonal image is rotated to a horizontal direction; image file remains unchanged. |

## Management Reports

| Requested item | Implementation / check |
| --- | --- |
| Remove At a glance event count and TODO lines | Removed their markup wrapper. |
| Slower, smoother analogy | About 4.6 seconds per transition; each stop remains sticky, finishes and pauses. Forward/reverse movement and April hold checked. |
| Remove Pause motion buttons | Removed the two remaining persona controls; no case-study Pause motion button remains. |
| Two people, one document | Replaced the former Emily/James editor/output heading. |
| North Star outer card has no color or stroke | Background transparent; border and shadow removed. Internal capability sticky notes remain. |
| Horizontal rough arrows | Same adjustment as Agent Management. |
| Remove 16 - What design influenced | Section label removed; heading and content retained. |
| Equal learning sticky heights | All four notes have matching heights; opening does not resize the note or its neighbors. |
| Footer matches Agent Management | Raw markup is identical. Desktop and mobile computed geometry and typography were compared. |

## Regression and packaging

- All three root HTML pages retained, with Management Reports unlinked from public navigation.
- Laptop styles/controller, city controller and install-flow controller are byte-for-byte unchanged.
- 223 laptop, install-flow and persona asset files match the v106 baseline.
- No font binaries or embedded font payloads are packaged.
- External and inline JavaScript syntax checks pass.
- Local resource references, same-page links, unique IDs and ARIA references pass.
- Browser checks use offline Chromium with packaged local resources and fallback fonts.
- Reduced-motion and no-JavaScript photo-grid fallbacks preserve all ten images.
- Live deployment, network webfonts and Safari were not tested.
- ZIP integrity checked after packaging; this build was not pushed to GitHub.
