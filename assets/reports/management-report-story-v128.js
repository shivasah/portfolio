/* Management reports motion story. No dependencies or external requests. */
(() => {
  'use strict';
  if (customElements.get('management-report-story')) return;
  const CSS = ":host {\n  display: block;\n  color: var(--mr-fg, #f5f4ef);\n  background: var(--mr-bg, #141516);\n  font-family: var(--mr-font, inherit);\n  --ease: cubic-bezier(.22,1,.36,1);\n  --paper: var(--mr-paper, #f5f4ef);\n  --p-ink: var(--mr-paper-ink, #222522);\n  --p-muted: var(--mr-paper-muted, #62665f);\n  --p-line: var(--mr-paper-line, #d7dad2);\n  --p-fill: var(--mr-paper-fill, #e6e9e1);\n  --accent: var(--mr-accent, #e2e4dd);\n  --line: var(--mr-line, #353737);\n  --muted: var(--mr-muted, #a9aaa6);\n  --fg: var(--mr-fg, #f5f4ef);\n  --bg: var(--mr-bg, #141516);\n  --pad: clamp(24px, 4.5vw, 76px);\n  contain: style;\n  container-type: inline-size;\n  container-name: mr-story;\n  line-height: 1.2;\n  text-align: left;\n}\n*, *::before, *::after { box-sizing: border-box; }\nbutton, a { -webkit-tap-highlight-color: transparent; }\nbutton { font: inherit; }\nbutton:focus-visible, a:focus-visible, summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 6px; }\nbutton:disabled { opacity: .3; cursor: default; }\nbutton { cursor: pointer; }\n.story { position: relative; }\n.stage { position: sticky; top: var(--mr-sticky-top, 0px); height: calc(100svh - var(--mr-sticky-top, 0px)); min-height: 640px; padding: 0 var(--pad); display: flex; flex-direction: column; overflow: clip; }\n.stage-inner { max-width: 1440px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; flex: 1; min-height: 0; }\n.topbar { min-height: 92px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid var(--line); }\n.identity { display: flex; align-items: center; gap: 13px; font-size: 14px; letter-spacing: -.02em; }\n.identity strong { font-weight: 600; }\n.identity .divider { height: 14px; width: 1px; background: var(--line); margin: 0 3px; }\n.identity span { color: var(--muted); }\n.brand-symbol { width: 29px; height: 29px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--muted); border-radius: 50%; }\n.brand-symbol svg { width: 17px; height: 17px; }\n.top-right { display: flex; gap: 22px; align-items: center; }\n.mode { font-size: 12px; color: var(--muted); }\n.count { font-size: 13px; font-variant-numeric: tabular-nums; display: flex; gap: 8px; }\n.count .total { color: var(--muted); }\n.body { display: grid; grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr); gap: 2.5%; align-items: center; flex: 1; min-height: 0; padding: 28px 0 20px; }\n.copy { align-self: center; padding-bottom: 15px; position: relative; }\n.kicker { display: flex; align-items: center; gap: 9px; font-size: 12px; color: var(--muted); margin: 0 0 26px; }\n.kicker b { width: 7px; height: 7px; background: var(--accent); border-radius: 100%; }\nh2 { font-family: var(--mr-heading-font, var(--mr-font, inherit)); font-size: clamp(38px,4.15cqi,68px); font-weight: 500; letter-spacing: -.055em; line-height: 1.035; margin: 0 0 28px -.04em; text-wrap: balance; max-width: 12ch; }\n.description { color: var(--muted); font-size: clamp(16px,1.23vw,19px); line-height: 1.65; max-width: 35ch; margin: 0; }\n.takeaway { margin-top: 38px; display: flex; align-items: flex-start; gap: 11px; max-width: 37ch; font-size: 13px; line-height: 1.6; }\n.takeaway svg { width: 18px; height: 18px; flex: 0 0 18px; margin-top: 1px; }\n.copy-panel { display: none; }\n.copy-panel.active { display: block; }\n.visual { position: relative; height: min(575px,66svh); min-height: 465px; perspective: 1300px; }\n.visual-label { position: absolute; bottom: 8px; left: 50%; translate: -50% 0; font-size: 11px; letter-spacing: .02em; white-space: nowrap; color: var(--muted); }\n.scene { position: absolute; inset: 0; opacity: 0; visibility: hidden; pointer-events: none; }\n.scene.active { visibility: visible; opacity: 1; }\n.paper { background: var(--paper); color: var(--p-ink); border: 1px solid var(--p-line); border-radius: 12px; box-shadow: 0 25px 65px #0002, 0 3px 12px #0001; position: absolute; padding: 26px 28px; }\n.paper p, .paper h3, .paper h4 { margin: 0; }\n.paper svg { display: block; }\n.report { width: 374px; height: 424px; left: 50%; top: 49%; translate: -50% -50%; }\n.doc-top { display: flex; align-items: center; gap: 12px; padding-bottom: 19px; border-bottom: 1px solid var(--p-line); }\n.doc-icon { display: flex; align-items: center; justify-content: center; border: 1px solid var(--p-line); border-radius: 8px; width: 34px; height: 39px; flex: 0 0 34px; }\n.doc-icon svg { width: 21px; height: 21px; }\n.doc-top h3 { font-size: 17px; letter-spacing: -.035em; font-weight: 650; line-height: 1.2; }\n.doc-top small { display: block; font-size: 10px; color: var(--p-muted); margin-top: 6px; }\n.doc-number { margin-left: auto; font-size: 10px; color: var(--p-muted); }\n.wave { height: 84px; margin-top: 17px; position: relative; }\n.wave svg { width: 100%; height: 100%; overflow: visible; }\n.graph-grid { stroke: var(--p-line); stroke-width: 1; fill: none; }\n.graph-line { stroke: var(--p-ink); stroke-width: 2.3; fill: none; stroke-linejoin: round; stroke-linecap: round; }\n.wave-dot { fill: var(--p-ink); stroke: var(--paper); stroke-width: 3; }\n.micro { color: var(--p-muted); font-size: 9px; letter-spacing: .025em; }\n.health-rows { margin-top: 12px; }\n.health-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 12px; border-top: 1px solid var(--p-line); }\n.row-name { font-size: 12px; }\n.value { font-size: 23px; font-weight: 500; letter-spacing: -.045em; font-variant-numeric: tabular-nums; }\n.unit { font-size: 10px; font-weight: 400; color: var(--p-muted); letter-spacing: 0; margin-left: 5px; }\n.doc-footer { display: flex; justify-content: space-between; border-top: 1px solid var(--p-line); margin-top: 11px; padding-top: 12px; color: var(--p-muted); font-size: 9px; }\n.floating-tag { position: absolute; display: flex; align-items: center; gap: 9px; border: 1px solid var(--line); background: var(--bg); padding: 11px 16px; border-radius: 30px; font-size: 12px; box-shadow: 0 5px 16px #0001; }\n.floating-tag svg { width: 17px; height: 17px; }\n.measure-tag { left: 3%; top: 15%; rotate: -6deg; }\n.context-tag { right: 0%; bottom: 14%; rotate: 4deg; }\n.tick-circle { width: 21px; height: 21px; display: inline-flex; flex: 0 0 21px; align-items: center; justify-content: center; border: 1px solid currentColor; border-radius: 100%; }\n.tick-circle svg { width: 12px; height: 12px; }\n.previous { width: 286px; height: 355px; left: 6%; top: 13%; rotate: -8deg; box-shadow: 0 10px 35px #0001; }\n.previous .doc-top { gap: 9px; }\n.previous h3 { font-size: 15px; }\n.previous .health-row { padding: 19px 0; }\n.previous .row-name { font-size: 10px; }\n.previous .value { font-size: 18px; }\n.previous .faint-line { margin-top: 20px; height: 4px; width: 76%; background: var(--p-line); }\n.comparison-report { left: 60%; top: 44%; scale: .92; rotate: 3deg; }\n.comparison-card { width: 333px; height: auto; padding: 18px 20px; left: 4%; bottom: 7%; rotate: -2deg; box-shadow: 0 18px 35px #0003; }\n.card-eyebrow { font-size: 9px; color: var(--p-muted); margin-bottom: 10px !important; }\n.comparison-title { font-size: 14px; font-weight: 600; letter-spacing: -.025em; }\n.comparison-columns { display: grid; grid-template-columns: 1fr 24px 1fr; align-items: center; gap: 10px; margin: 14px 0; }\n.comparison-columns .reading { font-size: 25px; letter-spacing: -.04em; }\n.comparison-columns small { display: block; font-size: 10px; color: var(--p-muted); margin-top: 3px; }\n.comparison-columns svg { width: 23px; height: 23px; }\n.interval { position: relative; margin-top: 4px; height: 14px; display: flex; align-items: center; }\n.interval::before { content: ''; height: 1px; background: var(--p-muted); width: 100%; }\n.range-band { position: absolute; height: 9px; left: 21%; right: 13%; background: var(--p-fill); border: 1px solid var(--p-line); border-radius: 2px; }\n.range-dot { position: absolute; left: 50%; height: 9px; width: 9px; border-radius: 50%; background: var(--p-ink); }\n.range-label { color: var(--p-muted); font-size: 9px; margin-top: 4px !important; }\n.receded { left: 39%; top: 44%; rotate: -8deg; scale: .91; }\n.care-note { width: 311px; min-height: 310px; right: 0%; top: 34%; rotate: 4deg; padding: 24px; box-shadow: 0 20px 45px #0003; }\n.note-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--p-line); padding-bottom: 15px; margin-bottom: 18px; }\n.note-top > svg { width: 24px; height: 24px; }\n.note-top h3 { font-size: 17px; font-weight: 600; letter-spacing: -.03em; }\n.note-top small { display: block; font-size: 10px; margin-top: 4px; color: var(--p-muted); }\n.care-line { display: flex; align-items: flex-start; gap: 11px; margin: 18px 0; font-size: 12px; line-height: 1.4; }\n.care-line .tick-circle { width: 18px; height: 18px; flex-basis: 18px; }\n.note-sign { border-top: 1px solid var(--p-line); padding-top: 13px; margin-top: 18px; font-size: 11px; color: var(--p-muted); display: flex; align-items: center; gap: 7px; }\n.note-sign svg { width: 15px; height: 15px; }\n.care-tag { left: 8%; top: 12%; }\n.business { height: 478px; }\n.business .doc-top h3 { font-size: 16px; }\n.metric-heading { font-size: 9px; margin-top: 19px !important; color: var(--p-muted); }\n.revenue-block { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: 8px; }\n.revenue-block .value { font-size: 35px; }\n.revenue-block .value span { font-size: 23px; }\n.revenue-change { font-size: 10px; color: var(--p-muted); padding-bottom: 6px; }\n.revenue-chart { height: 95px; margin-top: 7px; }\n.revenue-chart svg { width: 100%; height: 100%; }\n.chart-area { fill: var(--p-fill); }\n.chart-target { stroke: var(--p-muted); stroke-width: 1; stroke-dasharray: 4 5; }\n.chart-key { display: flex; gap: 14px; font-size: 8px; color: var(--p-muted); margin-top: 2px; }\n.chart-key span { display: flex; align-items: center; gap: 4px; }\n.chart-key i { width: 12px; height: 1px; background: var(--p-ink); }\n.chart-key .dashed { background: none; border-top: 1px dashed var(--p-muted); }\n.kpi-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--p-line); margin-top: 18px; padding-top: 15px; gap: 15px; }\n.kpi-grid > div + div { border-left: 1px solid var(--p-line); padding-left: 16px; }\n.kpi-grid .row-name { font-size: 10px; color: var(--p-muted); }\n.kpi-grid .value { display: block; font-size: 26px; margin-top: 5px; }\n.kpi-grid small { display: block; color: var(--p-muted); margin-top: 5px; font-size: 9px; }\n.statement-list { display: flex; gap: 5px; margin-top: 18px; }\n.statement-list span { display: inline-flex; align-items: center; gap: 4px; padding: 5px 6px; border: 1px solid var(--p-line); border-radius: 4px; font-size: 8px; }\n.statement-list svg { width: 10px; height: 10px; }\n.business-tag { right: -1%; top: 15%; rotate: 5deg; }\n.target-tag { left: 0%; bottom: 15%; rotate: -4deg; }\n.equivalence { position: absolute; left: 50%; translate: -50% 0; top: 0; display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 10px; white-space: nowrap; }\n.equivalence svg { width: 17px; height: 17px; }\n.accountant-paper { left: 35%; top: 43%; scale: .9; rotate: -7deg; }\n.accountant-note { width: 326px; padding: 24px; right: -1%; top: 27%; rotate: 3deg; box-shadow: 0 20px 45px #0003; }\n.accountant-note .note-top { margin-bottom: 15px; }\n.note-quote { font-size: 21px; font-weight: 500; letter-spacing: -.04em; line-height: 1.2; margin-bottom: 16px !important; }\n.underlined { background: linear-gradient(transparent 82%,var(--p-line) 82%); }\n.note-explanation { font-size: 12px; line-height: 1.65; color: var(--p-muted); }\n.note-focus { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--p-line); }\n.note-focus small { color: var(--p-muted); font-size: 9px; display: block; margin-bottom: 6px; }\n.note-focus p { font-size: 12px; line-height: 1.5; }\n.comment-tag { left: 0; top: 10%; rotate: -5deg; }\n.action-paper { width: 385px; min-height: 358px; left: 50%; top: 41%; translate: -50% -50%; padding: 28px; }\n.action-paper .note-top { margin-bottom: 5px; }\n.action-row { display: flex; gap: 13px; align-items: center; padding: 20px 0; border-bottom: 1px solid var(--p-line); }\n.action-row:last-of-type { border-bottom: 0; padding-bottom: 0; }\n.action-row strong { display: block; font-size: 13px; font-weight: 600; }\n.action-row small { display: block; color: var(--p-muted); font-size: 10px; margin-top: 5px; }\n.action-row .action-num { font-size: 10px; color: var(--p-muted); margin-left: auto; }\n.next-review { position: absolute; left: 50%; translate: -50% 0; bottom: 8%; display: flex; align-items: center; gap: 12px; background: var(--bg); border: 1px solid var(--line); border-radius: 12px; width: 320px; padding: 14px 18px; }\n.next-review > svg { width: 26px; height: 26px; }\n.next-review strong { display: block; font-size: 12px; font-weight: 500; }\n.next-review small { display: block; color: var(--muted); font-size: 10px; margin-top: 4px; }\n.loop-arrow { position: absolute; width: 95px; height: 196px; right: 0%; bottom: 14%; color: var(--muted); }\n.loop-arrow svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.4; }\n.final-tag { left: 1%; top: 5%; rotate: -5deg; }\n.controls { border-top: 1px solid var(--line); padding: 22px 0 20px; }\n.steps { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }\n.step-btn { background: none; border: 0; border-top: 2px solid var(--line); border-radius: 0; text-align: left; color: var(--muted); padding: 15px 0 10px; min-height: 59px; display: flex; align-items: baseline; gap: 9px; position: relative; transition: color .25s, translate .3s var(--ease); }\n.step-btn::before { content: ''; position: absolute; top: -2px; left: 0; width: 100%; height: 2px; background: var(--fg); transform-origin: left; transform: scaleX(0); transition: transform .65s var(--ease); }\n.step-btn[aria-current=step] { color: var(--fg); }\n.step-btn[aria-current=step]::before, .step-btn.completed::before { transform: scaleX(1); }\n.step-btn.completed::before { opacity: .4; }\n.step-btn:hover { color: var(--fg); translate: 0 -3px; }\n.step-btn:active { translate: 0 0; }\n.step-num { font-size: 10px; opacity: .7; font-variant-numeric: tabular-nums; }\n.step-label { font-size: 12px; }\n.bottom-line { margin-top: 10px; display: flex; align-items: center; justify-content: space-between; min-height: 32px; gap: 16px; }\n.scroll-hint { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 8px; }\n.scroll-hint svg { width: 15px; height: 15px; }\n.utilities { display: flex; align-items: center; gap: 8px; }\n.utility { display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: transparent; color: var(--fg); border: 1px solid var(--line); border-radius: 30px; padding: 7px 12px; font-size: 11px; min-height: 34px; transition: background .2s, translate .3s var(--ease); }\n.utility svg { width: 13px; height: 13px; }\n.utility:hover:not(:disabled) { background: var(--line); translate: 0 -2px; }\n.utility:active:not(:disabled) { translate: 0 0; }\n.utility.round { width: 36px; padding: 6px; }\n.waypoints { margin-top: calc(-100svh + var(--mr-sticky-top,0px)); position: relative; pointer-events: none; }\n.waypoint { height: 110svh; }\n.sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }\n.transcript { max-width: 1440px; margin: 0 auto; padding: 34px var(--pad) 46px; border-top: 1px solid var(--line); }\n.transcript summary { color: var(--muted); font-size: 13px; cursor: pointer; width: fit-content; padding: 10px 0; }\n.transcript summary:hover { color: var(--fg); }\n.transcript-content { max-width: 760px; padding-top: 24px; }\n.transcript h3 { font-size: 22px; line-height: 1.3; letter-spacing: -.025em; font-weight: 500; margin: 28px 0 10px; }\n.transcript p { color: var(--muted); line-height: 1.7; font-size: 16px; margin: 0 0 16px; }\n.transcript .disclaimer { font-size: 12px; }\n:host([capture]) .stage { height: 100svh; min-height: 0; }\n:host([capture]) .waypoints, :host([capture]) .transcript { display: none; }\n:host([capture]) .utility, :host([capture]) .scroll-hint { visibility: hidden; }\n:host([capture]) .stage { padding-left: 58px; padding-right: 58px; }\n:host([capture]) .topbar { min-height: 78px; }\n:host([capture]) .visual { min-height: 0; height: 510px; }\n:host([capture]) .controls { padding-top: 20px; padding-bottom: 15px; }\n:host([capture]) .bottom-line { display: none; }\n:host([capture]) h2 { font-size: 54px; }\n:host([capture]) .body { padding: 14px 0; }\n:host([capture]) .description { font-size: 17px; }\n:host([capture]) .takeaway { margin-top: 30px; }\n:host([capture]) .scene { scale: .94; }\n:host([capture]) .equivalence { display: none; }\n:host([capture]) .accountant-note { top: 20%; }\n:host([capture]) .step-btn::before { transition: none; }\n@media (min-width: 1600px) {\n  .visual { scale: 1.07; }\n}\n@media (max-width: 1100px) and (min-width: 701px) {\n  :host { --pad: 30px; }\n  .body { grid-template-columns: .8fr 1.2fr; gap: 1%; }\n  h2 { font-size: 45px; }\n  .visual { scale: .87; transform-origin: center; margin: 0 -22px; }\n  .description { font-size: 16px; }\n  .takeaway { font-size: 12px; max-width: 28ch; }\n  .identity .divider, .identity .subtitle { display: none; }\n}\n@media (max-width: 700px) {\n  :host { --pad: 22px; }\n  .stage { min-height: 710px; }\n  .topbar { min-height: 61px; gap: 10px; }\n  .identity { font-size: 12px; gap: 8px; }\n  .identity .divider, .identity .subtitle, .mode { display: none; }\n  .brand-symbol { width: 24px; height: 24px; }\n  .brand-symbol svg { width: 14px; height: 14px; }\n  .count { font-size: 11px; }\n  .body { display: flex; flex-direction: column; align-items: stretch; padding: 22px 0 2px; gap: 18px; justify-content: flex-start; }\n  .copy { padding: 0; align-self: stretch; }\n  .kicker { font-size: 10px; margin-bottom: 13px; gap: 7px; }\n  .kicker b { width: 5px; height: 5px; }\n  h2 { font-size: clamp(32px,8.8vw,44px); max-width: 15ch; line-height: 1.04; letter-spacing: -.048em; margin-bottom: 14px; }\n  h2 br { display: none; }\n  .description { font-size: 14px; line-height: 1.55; max-width: 46ch; }\n  .takeaway { display: none; }\n  .visual { height: auto; min-height: 300px; max-height: 390px; flex: 1 1 340px; width: 100%; margin: 0 auto; max-width: 430px; }\n  .visual-label { font-size: 9px; bottom: -2px; }\n  .paper { padding: 17px 20px; border-radius: 9px; }\n  .report { width: 257px; height: 281px; top: 48%; }\n  .doc-top { gap: 9px; padding-bottom: 12px; }\n  .doc-top h3 { font-size: 13px; }\n  .doc-top small { font-size: 8px; margin-top: 4px; }\n  .doc-icon { width: 28px; height: 32px; flex-basis: 28px; border-radius: 6px; }\n  .doc-icon svg { width: 17px; height: 17px; }\n  .doc-number { font-size: 8px; }\n  .wave { height: 49px; margin-top: 9px; }\n  .health-rows { margin-top: 7px; }\n  .health-row { padding: 8px 0; }\n  .row-name { font-size: 10px; }\n  .value { font-size: 19px; }\n  .unit { font-size: 8px; margin-left: 3px; }\n  .doc-footer { font-size: 8px; padding-top: 9px; margin-top: 6px; }\n  .floating-tag { font-size: 9px; padding: 7px 10px; gap: 5px; }\n  .floating-tag svg { width: 12px; height: 12px; }\n  .measure-tag { left: -3%; top: 8%; }\n  .context-tag { right: -2%; bottom: 13%; }\n  .previous { width: 206px; height: 248px; left: 1%; top: 10%; }\n  .previous .health-row { padding: 14px 0; }\n  .previous .row-name { font-size: 9px; }\n  .previous .value { font-size: 15px; }\n  .previous h3 { font-size: 11px; }\n  .previous .faint-line { margin-top: 16px; }\n  .comparison-report { left: 60%; top: 46%; scale: .86; }\n  .comparison-card { width: 230px; padding: 13px 15px; left: 0; bottom: 5%; }\n  .card-eyebrow { font-size: 8px; margin-bottom: 7px !important; }\n  .comparison-title { font-size: 12px; }\n  .comparison-columns { margin: 9px 0; gap: 4px; }\n  .comparison-columns .reading { font-size: 23px; }\n  .comparison-columns small { font-size: 8px; }\n  .range-label { font-size: 8px; }\n  .interval { height: 10px; }\n  .receded { top: 43%; left: 35%; scale: .86; }\n  .care-note { width: 229px; min-height: 231px; top: 25%; right: -2%; padding: 17px; }\n  .note-top { padding-bottom: 12px; margin-bottom: 11px; }\n  .note-top h3 { font-size: 14px; }\n  .note-top small { font-size: 8px; }\n  .note-top > svg { width: 19px; height: 19px; }\n  .care-line { font-size: 10px; margin: 13px 0; gap: 8px; }\n  .care-line .tick-circle { width: 15px; height: 15px; flex-basis: 15px; }\n  .tick-circle svg { width: 10px; height: 10px; }\n  .note-sign { font-size: 9px; margin-top: 12px; padding-top: 10px; }\n  .care-tag { left: 0%; top: 5%; }\n  .business { height: 310px; top: 48%; }\n  .business .doc-top h3 { font-size: 12px; }\n  .metric-heading { font-size: 8px; margin-top: 10px !important; }\n  .revenue-block { margin-top: 5px; }\n  .revenue-block .value { font-size: 25px; }\n  .revenue-block .value span { font-size: 17px; }\n  .revenue-change { font-size: 8px; padding-bottom: 4px; }\n  .revenue-chart { height: 56px; margin-top: 4px; }\n  .chart-key { font-size: 7px; gap: 10px; }\n  .kpi-grid { margin-top: 11px; padding-top: 9px; gap: 10px; }\n  .kpi-grid .row-name { font-size: 8px; }\n  .kpi-grid .value { font-size: 21px; margin-top: 4px; }\n  .kpi-grid small { font-size: 7px; margin-top: 3px; }\n  .kpi-grid > div + div { padding-left: 12px; }\n  .statement-list { margin-top: 11px; gap: 3px; }\n  .statement-list span { font-size: 6px; padding: 4px 5px; }\n  .statement-list svg { width: 7px; height: 7px; }\n  .business .doc-footer { display: none; }\n  .business-tag { top: 5%; right: -3%; }\n  .target-tag { bottom: 9%; left: -3%; }\n  .equivalence { display: none; }\n  .accountant-paper { top: 45%; left: 30%; scale: .86; }\n  .accountant-note { width: 264px; top: 11%; right: -1%; padding: 18px; }\n  .note-quote { font-size: 19px; margin-bottom: 11px !important; }\n  .note-explanation { font-size: 11px; line-height: 1.55; }\n  .note-focus { margin-top: 11px; padding-top: 10px; }\n  .note-focus small { font-size: 8px; }\n  .note-focus p { font-size: 11px; }\n  .accountant-note .note-sign { display: none; }\n  .comment-tag { top: 5%; left: 0; }\n  .action-paper { width: 281px; min-height: 248px; top: 41%; padding: 20px; }\n  .action-row { gap: 9px; padding: 15px 0; }\n  .action-row strong { font-size: 11px; }\n  .action-row small { font-size: 9px; margin-top: 3px; }\n  .action-row .action-num { font-size: 9px; }\n  .action-row .tick-circle { width: 18px; height: 18px; flex-basis: 18px; }\n  .next-review { width: 243px; padding: 11px 14px; bottom: 4%; gap: 9px; border-radius: 9px; }\n  .next-review strong { font-size: 10px; }\n  .next-review small { font-size: 8px; }\n  .next-review > svg { width: 21px; height: 21px; }\n  .loop-arrow { width: 47px; height: 145px; right: -3%; bottom: 10%; }\n  .final-tag { top: 0; left: -2%; }\n  .controls { padding: 16px 0 12px; }\n  .steps { gap: 7px; }\n  .step-btn { min-height: 42px; padding: 10px 0 5px; justify-content: center; }\n  .step-label { display: none; }\n  .step-num { font-size: 11px; }\n  .bottom-line { margin-top: 4px; gap: 7px; }\n  .scroll-hint { font-size: 9px; gap: 5px; }\n  .scroll-hint svg { width: 12px; height: 12px; }\n  .utility { min-height: 34px; font-size: 10px; padding: 6px 9px; white-space: nowrap; }\n  .play { width: 34px; padding: 6px; }\n  .play span { display: none; }\n  .utility.round { width: 34px; }\n  .utilities { gap: 5px; }\n  .waypoint { height: 115svh; }\n  .transcript { padding: 24px 22px 36px; }\n}\n@media (max-width: 700px) and (min-height: 860px) {\n  .body { justify-content: flex-start; gap: 24px; padding-top: 30px; }\n  .visual { flex-basis: 370px; max-height: 420px; }\n  .report { top: 48%; }\n}\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }\n}\n:host([static]) .stage { position: relative; height: auto; min-height: 0; }\n:host([static]) .body { padding: 48px 0; }\n:host([static]) .waypoints { display: none; }\n:host([static]) .controls { display: none; }\n:host([static]) .transcript details > summary { display: none; }\n:host([static]) .transcript-content { padding-top: 0; }\n@media (max-height: 620px) and (min-width: 701px) {\n  .stage { min-height: 620px; }\n}\n\n/* Adapt to the embedding column as well as the device viewport. */\n@container mr-story (min-width: 701px) and (max-width: 1100px) {\n  :host { --pad: 30px; }\n  .body { grid-template-columns: .8fr 1.2fr; gap: 1%; }\n  h2 { font-size: 45px; }\n  .visual { scale: .87; transform-origin: center; margin: 0 -22px; }\n  .description { font-size: 16px; }\n  .takeaway { font-size: 12px; max-width: 28ch; }\n  .identity .divider, .identity .subtitle { display: none; }\n\n  .stage { padding-inline: 30px; }\n}\n@container mr-story (max-width: 700px) {\n  :host { --pad: 22px; }\n  .stage { min-height: 710px; }\n  .topbar { min-height: 61px; gap: 10px; }\n  .identity { font-size: 12px; gap: 8px; }\n  .identity .divider, .identity .subtitle, .mode { display: none; }\n  .brand-symbol { width: 24px; height: 24px; }\n  .brand-symbol svg { width: 14px; height: 14px; }\n  .count { font-size: 11px; }\n  .body { display: flex; flex-direction: column; align-items: stretch; padding: 22px 0 2px; gap: 18px; justify-content: flex-start; }\n  .copy { padding: 0; align-self: stretch; }\n  .kicker { font-size: 10px; margin-bottom: 13px; gap: 7px; }\n  .kicker b { width: 5px; height: 5px; }\n  h2 { font-size: clamp(32px,8.8vw,44px); max-width: 15ch; line-height: 1.04; letter-spacing: -.048em; margin-bottom: 14px; }\n  h2 br { display: none; }\n  .description { font-size: 14px; line-height: 1.55; max-width: 46ch; }\n  .takeaway { display: none; }\n  .visual { height: auto; min-height: 300px; max-height: 390px; flex: 1 1 340px; width: 100%; margin: 0 auto; max-width: 430px; }\n  .visual-label { font-size: 9px; bottom: -2px; }\n  .paper { padding: 17px 20px; border-radius: 9px; }\n  .report { width: 257px; height: 281px; top: 48%; }\n  .doc-top { gap: 9px; padding-bottom: 12px; }\n  .doc-top h3 { font-size: 13px; }\n  .doc-top small { font-size: 8px; margin-top: 4px; }\n  .doc-icon { width: 28px; height: 32px; flex-basis: 28px; border-radius: 6px; }\n  .doc-icon svg { width: 17px; height: 17px; }\n  .doc-number { font-size: 8px; }\n  .wave { height: 49px; margin-top: 9px; }\n  .health-rows { margin-top: 7px; }\n  .health-row { padding: 8px 0; }\n  .row-name { font-size: 10px; }\n  .value { font-size: 19px; }\n  .unit { font-size: 8px; margin-left: 3px; }\n  .doc-footer { font-size: 8px; padding-top: 9px; margin-top: 6px; }\n  .floating-tag { font-size: 9px; padding: 7px 10px; gap: 5px; }\n  .floating-tag svg { width: 12px; height: 12px; }\n  .measure-tag { left: -3%; top: 8%; }\n  .context-tag { right: -2%; bottom: 13%; }\n  .previous { width: 206px; height: 248px; left: 1%; top: 10%; }\n  .previous .health-row { padding: 14px 0; }\n  .previous .row-name { font-size: 9px; }\n  .previous .value { font-size: 15px; }\n  .previous h3 { font-size: 11px; }\n  .previous .faint-line { margin-top: 16px; }\n  .comparison-report { left: 60%; top: 46%; scale: .86; }\n  .comparison-card { width: 230px; padding: 13px 15px; left: 0; bottom: 5%; }\n  .card-eyebrow { font-size: 8px; margin-bottom: 7px !important; }\n  .comparison-title { font-size: 12px; }\n  .comparison-columns { margin: 9px 0; gap: 4px; }\n  .comparison-columns .reading { font-size: 23px; }\n  .comparison-columns small { font-size: 8px; }\n  .range-label { font-size: 8px; }\n  .interval { height: 10px; }\n  .receded { top: 43%; left: 35%; scale: .86; }\n  .care-note { width: 229px; min-height: 231px; top: 25%; right: -2%; padding: 17px; }\n  .note-top { padding-bottom: 12px; margin-bottom: 11px; }\n  .note-top h3 { font-size: 14px; }\n  .note-top small { font-size: 8px; }\n  .note-top > svg { width: 19px; height: 19px; }\n  .care-line { font-size: 10px; margin: 13px 0; gap: 8px; }\n  .care-line .tick-circle { width: 15px; height: 15px; flex-basis: 15px; }\n  .tick-circle svg { width: 10px; height: 10px; }\n  .note-sign { font-size: 9px; margin-top: 12px; padding-top: 10px; }\n  .care-tag { left: 0%; top: 5%; }\n  .business { height: 310px; top: 48%; }\n  .business .doc-top h3 { font-size: 12px; }\n  .metric-heading { font-size: 8px; margin-top: 10px !important; }\n  .revenue-block { margin-top: 5px; }\n  .revenue-block .value { font-size: 25px; }\n  .revenue-block .value span { font-size: 17px; }\n  .revenue-change { font-size: 8px; padding-bottom: 4px; }\n  .revenue-chart { height: 56px; margin-top: 4px; }\n  .chart-key { font-size: 7px; gap: 10px; }\n  .kpi-grid { margin-top: 11px; padding-top: 9px; gap: 10px; }\n  .kpi-grid .row-name { font-size: 8px; }\n  .kpi-grid .value { font-size: 21px; margin-top: 4px; }\n  .kpi-grid small { font-size: 7px; margin-top: 3px; }\n  .kpi-grid > div + div { padding-left: 12px; }\n  .statement-list { margin-top: 11px; gap: 3px; }\n  .statement-list span { font-size: 6px; padding: 4px 5px; }\n  .statement-list svg { width: 7px; height: 7px; }\n  .business .doc-footer { display: none; }\n  .business-tag { top: 5%; right: -3%; }\n  .target-tag { bottom: 9%; left: -3%; }\n  .equivalence { display: none; }\n  .accountant-paper { top: 45%; left: 30%; scale: .86; }\n  .accountant-note { width: 264px; top: 11%; right: -1%; padding: 18px; }\n  .note-quote { font-size: 19px; margin-bottom: 11px !important; }\n  .note-explanation { font-size: 11px; line-height: 1.55; }\n  .note-focus { margin-top: 11px; padding-top: 10px; }\n  .note-focus small { font-size: 8px; }\n  .note-focus p { font-size: 11px; }\n  .accountant-note .note-sign { display: none; }\n  .comment-tag { top: 5%; left: 0; }\n  .action-paper { width: 281px; min-height: 248px; top: 41%; padding: 20px; }\n  .action-row { gap: 9px; padding: 15px 0; }\n  .action-row strong { font-size: 11px; }\n  .action-row small { font-size: 9px; margin-top: 3px; }\n  .action-row .action-num { font-size: 9px; }\n  .action-row .tick-circle { width: 18px; height: 18px; flex-basis: 18px; }\n  .next-review { width: 243px; padding: 11px 14px; bottom: 4%; gap: 9px; border-radius: 9px; }\n  .next-review strong { font-size: 10px; }\n  .next-review small { font-size: 8px; }\n  .next-review > svg { width: 21px; height: 21px; }\n  .loop-arrow { width: 47px; height: 145px; right: -3%; bottom: 10%; }\n  .final-tag { top: 0; left: -2%; }\n  .controls { padding: 16px 0 12px; }\n  .steps { gap: 7px; }\n  .step-btn { min-height: 42px; padding: 10px 0 5px; justify-content: center; }\n  .step-label { display: none; }\n  .step-num { font-size: 11px; }\n  .bottom-line { margin-top: 4px; gap: 7px; }\n  .scroll-hint { font-size: 9px; gap: 5px; }\n  .scroll-hint svg { width: 12px; height: 12px; }\n  .utility { min-height: 34px; font-size: 10px; padding: 6px 9px; white-space: nowrap; }\n  .play { width: 34px; padding: 6px; }\n  .play span { display: none; }\n  .utility.round { width: 34px; }\n  .utilities { gap: 5px; }\n  .waypoint { height: 115svh; }\n  .transcript { padding: 24px 22px 36px; }\n\n  .stage { padding-inline: 22px; }\n}\n\n/* Portfolio styling lives inside the shadow root, so unrelated v126 CSS is untouched. */\n:host { --pad:clamp(24px,5vw,76px); color-scheme:light; }\n.stage { padding-top:80px; padding-bottom:12px; min-height:0; overflow:clip; }\n.topbar { min-height:54px; flex-shrink:0; }\n.identity { font-family:var(--mr-heading-font);font-size:16px; }\n.identity strong { font-weight:600; }\n.brand-symbol { border-color:var(--mr-action);color:var(--mr-action); }\n.body { column-gap:5%;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);padding-block:22px 18px; }\nh2 { font-size:clamp(40px,4.2cqi,66px);line-height:1.04;letter-spacing:-.04em;max-width:13ch; }\n.description { font-size:clamp(16px,1.25vw,18px);line-height:1.6;max-width:36ch; }\n.takeaway { margin-top:26px;font-size:14px;line-height:1.5; }\n.takeaway>svg,.note-top>svg,.note-sign>svg,.doc-icon { color:var(--mr-accent); }\n.kicker { margin-bottom:20px; }\n.kicker b { background:var(--mr-accent); }\n.visual { height:min(560px,61svh);min-height:440px; }\n.paper { border-color:var(--p-line);border-radius:8px;box-shadow:0 14px 34px rgba(41,46,38,.12),0 2px 6px rgba(41,46,38,.06); }\n.previous { background:var(--mr-stone); }\n.care-note { background:var(--mr-oat); }\n.accountant-note { background:var(--mr-sage); }\n.care-note,.accountant-note { --p-muted:var(--mr-action);--p-line:rgba(41,46,38,.25); }\n.doc-top h3,.note-top h3 { font-family:var(--mr-heading-font);font-weight:600; }\n.graph-line { stroke:var(--mr-action); }\n.wave-dot,.range-dot { fill:var(--mr-accent); }\n.chart-area,.range-band { fill:var(--mr-sage);background:var(--mr-sage); }\n.graph-grid { opacity:.55; }\n.tick-circle { color:var(--mr-action); }\n.note-quote { font-family:var(--mr-heading-font);font-size:24px; }\n.underlined { background:linear-gradient(transparent 84%,var(--mr-oat) 84%); }\n.floating-tag { color:var(--mr-action);background:var(--paper);border-color:var(--p-line);box-shadow:0 3px 10px rgba(41,46,38,.06); }\n.floating-tag>svg { color:var(--mr-accent); }\n.next-review { background:var(--mr-stone);color:var(--p-ink);border-color:var(--p-line); }\n.next-review small { color:var(--mr-action); }\n.loop-arrow { color:var(--mr-action); }\n.visual-label { color:var(--muted);font-size:11px; }\n.controls { padding:16px 0 10px;flex-shrink:0; }\n.step-btn { font-family:var(--mr-font); }\n.step-btn[aria-current=step] { color:var(--mr-action); }\n.step-btn::before { background:var(--mr-action); }\n.step-num { opacity:1; }\n.utility { min-height:40px;border-color:var(--mr-action);color:var(--mr-action);font-family:var(--mr-font);font-size:12px; }\n.utility svg { width:16px;height:16px; }\n.utility.round { width:40px; }\n.utility:hover:not(:disabled) { color:var(--paper);background:var(--mr-action);translate:0 -2px; }\n.utility:active:not(:disabled) { translate:0 0; }\n.utility:disabled { opacity:.38; }\nbutton:focus-visible,a:focus-visible,summary:focus-visible { outline:2px solid var(--mr-action);outline-offset:4px; }\n.transcript h3 { font-family:var(--mr-heading-font); }\n.transcript summary { color:var(--mr-action);font-family:var(--mr-font);min-height:44px; }\n@media(min-width:701px) and (max-height:780px) {\n .stage { padding-top:68px;padding-bottom:6px; }\n .topbar { min-height:42px; }\n .body { padding-block:8px; }\n .visual { min-height:420px;height:460px;scale:.9;transform-origin:center; }\n h2 { font-size:clamp(38px,4vw,54px);margin-bottom:18px; }\n .takeaway { margin-top:18px;font-size:12px; }\n .controls { padding-block:10px 6px; }\n .step-btn { min-height:40px;padding-top:9px;padding-bottom:8px; }\n .bottom-line { margin-top:5px; }\n}\n@media(max-width:700px) {\n .stage { min-height:0;padding-top:68px;padding-inline:22px;padding-bottom:8px; }\n .topbar { min-height:44px; }\n .identity { font-size:14px; }\n .body { gap:14px;padding-block:18px 8px; }\n .copy { padding:0; }\n .kicker { margin-bottom:10px;font-size:11px; }\n h2 { font-size:clamp(32px,8.8cqi,40px);max-width:16ch;margin-bottom:12px; }\n .description { font-size:14px;line-height:1.5;max-width:44ch; }\n .visual { min-height:300px;height:auto;max-height:375px;flex:1 1 310px; }\n .note-quote { font-size:21px; }\n .controls { padding:10px 0 6px; }\n .step-btn { min-height:40px;padding:9px 0 6px; }\n .bottom-line { flex-wrap:wrap;gap:8px; }\n .scroll-hint { display:none; }\n .utilities { width:100%;justify-content:flex-end; }\n .utility { min-height:40px;font-size:11px; }\n .utility.round,.play { width:40px; }\n .visual-label { font-size:9px;bottom:-2px; }\n}\n/* Short windows and reduced motion get full-height content, not clipped controls. */\n:host([static]) .stage { padding-top:72px;position:relative;height:auto;min-height:0; }\n:host([static]) .body { padding-block:28px; }\n:host([static]) .controls { display:block; }\n:host([static]) .scroll-hint,:host([static]) .play,:host([static]) .replay,:host([static]) .mode { display:none; }\n:host([static]) .visual { height:540px;min-height:440px;scale:1; }\n:host([static]) .transcript details>summary { display:block; }\n:host([static]) .takeaway { display:flex; }\n@media(max-width:700px) {\n :host([static]) .visual { height:345px;min-height:345px;flex:0 0 345px; }\n :host([static]) .takeaway { display:none; }\n :host([static]) .body { padding-block:20px; }\n}\n/* Keep short-window chapter choices above the document, where they stay discoverable. */\n:host([static]) .topbar { order:0; }\n:host([static]) .controls { order:1;border-top:0;border-bottom:1px solid var(--line);margin-top:12px; }\n:host([static]) .body { order:2; }\n@media(max-width:700px) {\n .accountant-paper { left:36%; }\n}\n\n/* v130: portfolio-first presentation, with scrolling kept intact */\n.topbar, .kicker, .controls { display:none!important; }\n.stage { min-height: 560px; }\n.body { padding: clamp(26px,4vw,54px) 0; }\n@container mr-story (max-width: 720px) {\n .stage { min-height: 680px; }\n .body { padding: 18px 0 28px; }\n}\n@media (max-height: 650px) and (min-width: 721px) {\n .stage { min-height: 490px; }\n .visual { min-height: 350px; height: 55svh; }\n}\n";
  const ICONS = {
    pulse: '<path d="M2 12h4l3-7 4 14 3-7h6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    document: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
    bars: '<path d="M5 20v-7m7 7V4m7 16V9M2 20h20"/>',
    capsule: '<path d="M8.5 4.5a5 5 0 0 1 7 7l-4 4a5 5 0 0 1-7-7zM7 7l7 7"/>',
    pen: '<path d="m5 15-1 5 5-1L20 8l-4-4L5 15zm9-9 4 4M4 22h16"/>',
    loop: '<path d="M20 7v5h-5M4 17v-5h5M5.3 7.5A8 8 0 0 1 19.6 10M4.4 14A8 8 0 0 0 18.7 16.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    play: '<path d="m8 5 11 7-11 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    bulb: '<path d="M8 15a7 7 0 1 1 8 0v3H8zM9 22h6M8 18h8"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.document}</svg>`;
  const check = () => `<span class="tick-circle">${icon('check')}</span>`;
  const tag = (cls, name, text) => `<div class="floating-tag ${cls}" data-reveal>${icon(name)}<span>${text}</span></div>`;
  const STEPS = [
    {
        "label": "Vitals",
        "phase": "The health report",
        "title": "Start with your<br> check-up.",
        "text": "Your health report puts your heart rate, blood pressure and blood glucose in one place.",
        "takeaway": "These are the readings your doctor will review.",
        "icon": "pulse"
    },
    {
        "label": "Compare",
        "phase": "The health report",
        "title": "Compare it with<br> last time.",
        "text": "Your doctor compares these readings with your previous check-up and the clinical reference ranges.",
        "takeaway": "Here, the pulse is 72, compared with 78 before.",
        "icon": "arrow"
    },
    {
        "label": "Care plan",
        "phase": "The doctor's interpretation",
        "title": "Your doctor<br> explains the results.",
        "text": "They consider your medical context and recommend treatment, including medicine when needed.",
        "takeaway": "A follow-up checks how you're doing.",
        "icon": "plus"
    },
    {
        "label": "Business vitals",
        "phase": "The management report",
        "title": "Now look at<br> the business.",
        "text": "A management report brings financial statements and KPIs together. It compares this period with previous results and the budget, using relevant benchmarks where needed.",
        "takeaway": "Revenue is up 20%, though it is still below budget.",
        "icon": "bars"
    },
    {
        "label": "Commentary",
        "phase": "The accountant's interpretation",
        "title": "The accountant<br> explains why.",
        "text": "Revenue rose 20%, while gross margin fell by 6 percentage points. The accountant's commentary puts those changes in context and identifies what needs attention.",
        "takeaway": "The note calls for a review of pricing and costs, plus unpaid invoices.",
        "icon": "pen"
    },
    {
        "label": "Decisions",
        "phase": "The owner's decisions",
        "title": "The owner<br> chooses what to do.",
        "text": "The owner uses the accountant's advice to decide which actions to take first. Next period's report helps them check progress and adjust the plan.",
        "takeaway": "In this example, collections need attention.",
        "icon": "loop"
    }
];
  const healthReport = (cls='') => `<div class="paper report ${cls}" data-sheet>
    <div class="doc-top"><span class="doc-icon">${icon('plus')}</span><div><h3>Health report</h3><small>Your latest check-up</small></div><span class="doc-number">01</span></div>
    <div class="wave"><svg viewBox="0 0 318 80"><path class="graph-grid" d="M0 20h318M0 40h318M0 60h318M53 0v80M106 0v80M159 0v80M212 0v80M265 0v80"/><path class="graph-line" data-draw d="M0 43H36L48 42L56 35L65 49L76 8L87 72L98 41L110 43H150L162 42L170 35L179 49L190 8L201 72L212 41L224 43H280L291 36L301 43H318"/><circle class="wave-dot" cx="318" cy="43" r="4" data-reveal/></svg></div>
    <div class="health-rows">
      <div class="health-row" data-reveal><span class="row-name">Heart rate</span><strong class="value">72<span class="unit">bpm</span></strong></div>
      <div class="health-row" data-reveal><span class="row-name">Blood pressure</span><strong class="value">118/78<span class="unit">mmHg</span></strong></div>
      <div class="health-row" data-reveal><span class="row-name">Blood glucose</span><strong class="value">90<span class="unit">mg/dL</span></strong></div>
    </div><div class="doc-footer"><span>Readings from this check-up</span><span>Illustrative</span></div>
  </div>`;
  const businessReport = (cls='') => `<div class="paper report business ${cls}" data-sheet>
    <div class="doc-top"><span class="doc-icon">${icon('bars')}</span><div><h3>Management report</h3><small>This reporting period</small></div><span class="doc-number">01</span></div>
    <p class="metric-heading">REVENUE</p><div class="revenue-block"><strong class="value">$120<span>k</span></strong><span class="revenue-change">+20% vs. prior period</span></div>
    <div class="revenue-chart"><svg viewBox="0 0 318 90"><path class="graph-grid" d="M0 20h318M0 45h318M0 70h318"/><path class="chart-area" data-reveal d="M0 71L45 67L90 52L135 60L180 36L225 44L270 27L318 22V90H0Z"/><path class="chart-target" d="M0 13H318"/><path class="graph-line" data-draw d="M0 71L45 67L90 52L135 60L180 36L225 44L270 27L318 22"/><circle class="wave-dot" data-reveal cx="318" cy="22" r="4"/></svg></div>
    <div class="chart-key"><span><i></i>Actual $120k</span><span><i class="dashed"></i>Budget $125k</span></div>
    <div class="kpi-grid"><div data-reveal><span class="row-name">Gross margin</span><strong class="value">32%</strong><small>Prior 38% &nbsp; / &nbsp; Budget 40%</small></div><div data-reveal><span class="row-name">Receivables</span><strong class="value">$45k</strong><small>Prior $30k &nbsp; / &nbsp; Target $30k</small></div></div>
    <div class="statement-list" data-reveal><span>${icon('document')}Profit &amp; loss</span><span>${icon('document')}Balance sheet</span><span>${icon('document')}Cash flow</span></div>
    <div class="doc-footer"><span>Financial statements + KPIs</span><span>Illustrative</span></div>
  </div>`;
  const scenes = () => [
    `${healthReport()}${tag('measure-tag','pulse',"Your latest readings")}`,
    `<div class="paper previous" data-sheet><div class="doc-top"><div><h3>Previous check-up</h3><small>At your last check-up</small></div></div><div class="health-row"><span class="row-name">Heart rate</span><span class="value">78<span class="unit">bpm</span></span></div><div class="health-row"><span class="row-name">Blood pressure</span><span class="value">122/80</span></div><div class="faint-line"></div><div class="faint-line" style="width:55%"></div></div>${healthReport('comparison-report')}<div class="paper comparison-card" data-float><p class="card-eyebrow">Previous and latest</p><p class="comparison-title">Heart rate</p><div class="comparison-columns"><div><span class="reading">78</span><small>Previous pulse</small></div>${icon('arrow')}<div><span class="reading">72</span><small>Latest pulse</small></div></div><div class="interval" data-reveal><span class="range-band"></span><span class="range-dot"></span></div><p class="range-label">Clinical reference range (schematic)</p></div>`,
    `${healthReport('receded')}<div class="paper care-note" data-float><div class="note-top"><div><h3>A care plan</h3><small>From your doctor</small></div>${icon('plus')}</div><div class="care-line" data-reveal>${check()}<span>Consider your<br> medical context.</span></div><div class="care-line" data-reveal>${check()}<span>Recommend treatment,<br> including medicine if needed.</span></div><div class="care-line" data-reveal>${check()}<span>Arrange a follow-up<br> to check your progress.</span></div><div class="note-sign" data-reveal>${icon('pen')}Your doctor</div></div>${tag('care-tag','capsule',"Your doctor's recommendations")}`,
    `<div class="equivalence" data-reveal>${icon('heart')}Health report ${icon('arrow')} Management report ${icon('bars')}</div>${businessReport()}${tag('business-tag','bars',"This period's results")}${tag('target-tag','arrow',"Previous results and budget")}`,
    `${businessReport('accountant-paper')}<div class="paper accountant-note" data-float><div class="note-top"><div><h3>The accountant\u2019s note</h3><small>Summary &amp; commentary</small></div>${icon('pen')}</div><p class="note-quote" data-reveal>Gross margin fell<br> to <span class="underlined">32%.</span></p><p class="note-explanation" data-reveal>Revenue rose 20%, but gross margin fell 6 percentage points. Receivables increased from $30k to $45k.</p><div class="note-focus" data-reveal><small>What needs attention</small><p>Review pricing and costs.<br> Check outstanding invoices.</p></div><div class="note-sign" data-reveal>${icon('pen')}Your accountant</div></div>${tag('comment-tag','bulb',"The accountant's explanation")}`,
    `<div class="paper action-paper" data-sheet><div class="note-top"><div><h3>The owner\u2019s next actions</h3><small>Informed by the management report</small></div>${icon('check')}</div><div class="action-row" data-reveal>${check()}<div><strong>Prioritise collections</strong><small>Review outstanding invoices.</small></div><span class="action-num">01</span></div><div class="action-row" data-reveal>${check()}<div><strong>Review pricing and costs</strong><small>Understand the margin change.</small></div><span class="action-num">02</span></div><div class="action-row" data-reveal>${check()}<div><strong>Plan cash commitments</strong><small>Decide what the business can fund.</small></div><span class="action-num">03</span></div></div><div class="loop-arrow"><svg viewBox="0 0 95 196"><path data-draw d="M7 10C110 10 90 168 18 170M24 163l-8 7 8 7"/></svg></div><div class="next-review" data-float>${icon('loop')}<div><strong>Check the next report</strong><small>Check progress and adjust the plan.</small></div></div>${tag('final-tag','arrow',"The owner's priorities")}`
  ];
  const transcript = () => `<details><summary>Read the complete explanation</summary><div class="transcript-content">${STEPS.map((s,i)=>`<h3>${i+1}. ${s.title.replace('<br> ',' ')}</h3><p>${s.text} ${s.takeaway}</p>`).join('')}<h3>The example behind the animation</h3><p>This business made $120,000 in revenue, up from $100,000 in the previous period. Its budget was $125,000. Gross margin fell from 38% to 32%, against a 40% budget. Receivables rose from $30,000 to $45,000; the company's target is $30,000. The accountant's note points out the margin change and the increase in unpaid invoices. The owner uses that advice to choose actions and checks progress in the next report.</p><p class="disclaimer">All readings, figures and targets are illustrative. Clinical reference ranges depend on the test and medical context. The reference interval graphic is schematic, not a clinical scale. This analogy is not medical or financial advice. Business targets shown are fictional company targets, not universal standards.</p></div></details>`;

  class ManagementReportStory extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'});
      this.step = -1;
      this.animations = [];
      this.captureMode = false;
      this.playTimer = null;
      this.pending = null;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    }
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.explicitStatic = this.hasAttribute('static');
      this.shadowRoot.innerHTML = `<style>${CSS}</style><section class="story" aria-label="Management reports, explained through a health report"><div class="stage"><div class="stage-inner"><header class="topbar"><div class="identity"><span class="brand-symbol">${icon('pulse')}</span><strong>Management reports</strong><span class="divider"></span><span class="subtitle">The health report analogy</span></div><div class="top-right"><span class="mode">Scroll to explore</span><span class="count" aria-hidden="true"><span class="current">01</span><span class="total">/ 06</span></span></div></header><div class="body"><div class="copy">${STEPS.map((s,i)=>`<div class="copy-panel" data-copy="${i}" aria-hidden="true"><p class="kicker"><b aria-hidden="true"></b>${s.phase}</p><h2>${s.title}</h2><p class="description">${s.text}</p><div class="takeaway">${icon(s.icon)}<span>${s.takeaway}</span></div></div>`).join('')}</div><div class="visual" aria-hidden="true">${scenes().map((s,i)=>`<div class="scene" data-scene="${i}">${s}</div>`).join('')}<div class="visual-label">Illustrative data &middot; a visual analogy</div></div></div><footer class="controls"><nav class="steps" aria-label="Story steps">${STEPS.map((s,i)=>`<button class="step-btn" data-go="${i}" aria-label="Step ${i+1}: ${s.label}"><span class="step-num">0${i+1}</span><span class="step-label">${s.label}</span></button>`).join('')}</nav><div class="bottom-line"><span class="scroll-hint">${icon('down')}<span>Scroll for the next step.</span></span><div class="utilities"><button class="utility replay" aria-label="Replay this step">${icon('loop')}<span>Replay</span></button><button class="utility play" aria-label="Play all six steps">${icon('play')}<span>Play all</span></button><button class="utility round prev" aria-label="Previous step">${icon('back')}</button><button class="utility round next" aria-label="Next step">${icon('arrow')}</button></div></div></footer></div></div><div class="waypoints" aria-hidden="true">${STEPS.map((_,i)=>`<div class="waypoint" data-waypoint="${i}"></div>`).join('')}</div><div class="sr" aria-live="polite" aria-atomic="true"></div></section><div class="transcript">${transcript()}</div>`;
      this.q = (s) => this.shadowRoot.querySelector(s);
      this.qa = (s) => [...this.shadowRoot.querySelectorAll(s)];
      this.inheritTheme();
      this.configureMotion();
      this.shadowRoot.addEventListener('click', this.onClick = (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        if (button.matches('[data-go]')) { this.stop(); this.jump(Number(button.dataset.go)); }
        if (button.matches('.prev')) { this.stop(); this.jump(this.step-1); }
        if (button.matches('.next')) { this.stop(); this.jump(this.step+1); }
        if (button.matches('.replay')) { this.stop(); this.show(this.step, {replay:true}); }
        if (button.matches('.play')) { this.playTimer ? this.stop() : this.play(); }
      });
      this.onManual = () => { if(this.playTimer) this.stop(); };
      this.addEventListener('wheel', this.onManual, {passive:true});
      this.addEventListener('touchstart', this.onManual, {passive:true});
      this.onKey = (e) => {
        if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)) this.stop();
      };
      this.addEventListener('keydown', this.onKey);
      this.onPreference = () => this.configureMotion();
      this.reduced.addEventListener('change', this.onPreference);
      this.onResize = () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => this.configureMotion(), 120);
      };
      window.addEventListener('resize', this.onResize, {passive:true});
      this.themeObserver = new MutationObserver(() => this.inheritTheme());
      this.themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
      if (document.body) this.themeObserver.observe(document.body,{attributes:true,attributeFilter:['class','style','data-theme']});
      if(this.parentElement && this.parentElement!==document.body) this.themeObserver.observe(this.parentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
      this.show(0,{instant:true});
      this.onVisibility = () => this.syncSuspension();
      document.addEventListener('visibilitychange', this.onVisibility);
      this.menuObserver = new MutationObserver(() => this.syncSuspension());
      this.menuObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
      this.visibilityObserver = new IntersectionObserver(entries => {
        this.inView = entries[0].isIntersecting;
        this.syncSuspension();
      },{threshold:0});
      this.inView = false;
      this.visibilityObserver.observe(this.q('.stage'));
      this.syncSuspension();
      this.closest('#background')?.setAttribute('data-story-ready','true');
      this.dispatchEvent(new CustomEvent('story-ready',{bubbles:true,composed:true}));
    }
    shortViewport() {
      return innerHeight < (this.getBoundingClientRect().width <= 700 ? 770 : 710);
    }
    syncSuspension() {
      const suspend = document.hidden || document.body.classList.contains('menu-open') || this.inView === false;
      if (suspend === this.suspended) return;
      this.suspended = suspend;
      if (suspend) {
        this.stop();
        this.animations.forEach(a => { if(a.playState === 'running') {a.pause();a._resumeForPortfolio=true;} });
      } else {
        this.animations.forEach(a => { if(a._resumeForPortfolio && !this.reduced.matches) {a.play();a._resumeForPortfolio=false;} });
      }
    }
    configureMotion() {
      this.observer?.disconnect();
      this.stop();
      const shortViewport = this.shortViewport();
      this.isStatic = this.reduced.matches || shortViewport || this.explicitStatic;
      if (this.isStatic) {
        this.setAttribute('static','');
        this.q('details').open = true;
        this.show(Math.max(0,this.step),{instant:true,replay:true});
        return;
      }
      this.removeAttribute('static');
      this.observer = new IntersectionObserver(entries => {
        if (this.captureMode || this.playTimer || this.jumpLock) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index=Number(entry.target.dataset.waypoint);
            if (!this.initialEntrySeen && index===0 && this.step===0) {
              const line=this.q('[data-scene="0"] [data-draw]');
              const length=line.getTotalLength();
              this.animate(line,[{strokeDasharray:`${length} ${length}`,strokeDashoffset:length},{strokeDasharray:`${length} ${length}`,strokeDashoffset:0}],{duration:1100,easing:'ease-in-out'});
            }
            this.initialEntrySeen=true;
            this.show(index);
          }
        }
      }, {root:null,rootMargin:`-${Math.round(innerHeight*.48)}px 0px -${Math.round(innerHeight*.48)}px 0px`,threshold:0});
      this.qa('.waypoint').forEach(el => this.observer.observe(el));
    }
    inheritTheme() {
      if(this.getAttribute('theme')==='preview') {
        const preview = {'bg':'#141516','fg':'#f5f4ef','muted':'#a9aaa6','line':'#353737','accent':'#e2e4dd','paper':'#f5f4ef','paper-ink':'#222522','paper-muted':'#62665f','paper-line':'#d7dad2','paper-fill':'#e6e9e1','font':'Arial, Helvetica, sans-serif'};
        for(const [k,v] of Object.entries(preview)) this.style.setProperty(`--mr-${k}`,v);
        return;
      }
      // Resolve colours with the browser; explicit --mr-* values on an ancestor take precedence.
      const parent = this.parentElement || document.body;
      // Remove only values generated by this component. User-authored host or
      // ancestor CSS variables remain authoritative, including on theme changes.
      this.generatedTheme ||= new Map();
      for (const [key,value] of this.generatedTheme) {
        if (this.style.getPropertyValue(key) === value) this.style.removeProperty(key);
      }
      this.generatedTheme.clear();
      const hostTokens = getComputedStyle(this);
      const overrides = {};
      for(const name of ['bg','fg','accent','muted','line','paper','paper-ink','paper-muted','paper-line','paper-fill','font','heading-font']) {
        overrides[name] = hostTokens.getPropertyValue(`--mr-${name}`).trim();
      }
      const inherited = getComputedStyle(parent);
      const parse = (v) => {
        if(!v || !CSSSupport(v)) return null;
        const c=document.createElement('span');c.style.color=v;c.style.display='none';parent.append(c);
        const s=getComputedStyle(c).color;c.remove();
        const nums=s.match(/[\d.]+/g)?.map(Number);
        if(!nums || nums.length<3) return null;
        if(s.startsWith('color(')) return null;
        return nums.slice(0,3);
      };
      function CSSSupport(v){return window.CSS.supports('color',v)}
      let bg = null;
      for(let p=parent;p;p=p.parentElement){
        const value=getComputedStyle(p).backgroundColor;
        if(value!=='transparent' && value!=='rgba(0, 0, 0, 0)'){bg=parse(value);if(bg)break;}
      }
      bg=bg||[255,255,255];
      const fg=parse(inherited.color)||[25,25,25];
      const mix=(a,b,t)=>a.map((v,i)=>Math.round(v*(1-t)+b[i]*t));
      const rgb=(c)=>`rgb(${c.join(', ')})`;
      const luminance=(c)=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
      const dark=luminance(bg)<.35;
      const paper=dark?mix(bg,fg,.95):mix(bg,fg,.025);
      const paperInk=dark?mix(bg,[0,0,0],.1):fg;
      let accent=null;
      for(const key of ['--accent','--color-accent','--accent-color','--primary','--primary-color','--color-primary','--link-color']) {
        const value=inherited.getPropertyValue(key).trim()||getComputedStyle(document.documentElement).getPropertyValue(key).trim();
        const candidate=parse(value);
        if(candidate) {accent=candidate;break;}
      }
      if(!accent){
        const link=parent.querySelector('a:not([aria-hidden="true"])')||document.querySelector('main a, article a');
        if(link)accent=parse(getComputedStyle(link).color);
      }
      accent=accent||fg;
      // Do not use a low-contrast sampled link colour for interactive focus indicators.
      const ratio=(Math.max(luminance(accent),luminance(bg))+.05)/(Math.min(luminance(accent),luminance(bg))+.05);
      if(ratio<3)accent=fg;
      const vars={'bg':rgb(bg),'fg':rgb(fg),'accent':rgb(accent),'muted':rgb(mix(bg,fg,.68)),'line':rgb(mix(bg,fg,.2)),'paper':rgb(paper),'paper-ink':rgb(paperInk),'paper-muted':rgb(mix(paperInk,paper,.30)),'paper-line':rgb(mix(paperInk,paper,.83)),'paper-fill':rgb(mix(paperInk,paper,.93)),'font':inherited.fontFamily};
      const heading=parent.querySelector('h1,h2,h3');
      if(heading)vars['heading-font']=getComputedStyle(heading).fontFamily;
      for(const [key,value] of Object.entries(vars)){
        if (overrides[key]) continue;
        const token=`--mr-${key}`;
        this.style.setProperty(token,value);
        this.generatedTheme.set(token,value);
      }
    }
    animate(el,frames,options={}) {
      const a=el.animate(frames,{duration:680,easing:'cubic-bezier(.22,1,.36,1)',fill:'both',...options});
      this.animations.push(a);
      return a;
    }
    show(index,{instant=false,replay=false,paused=false}={}) {
      index=Math.max(0,Math.min(STEPS.length-1,Math.floor(index)));
      if(index===this.step && !replay) return;
      this.animations.forEach(a=>a.cancel());this.animations=[];
      clearTimeout(this.pending);
      const previous=this.step;
      const direction=index>=previous?1:-1;
      this.step=index;
      const active=this.q(`[data-scene="${index}"]`);
      this.qa('.scene').forEach(el=>el.classList.remove('active'));
      this.qa('.copy-panel').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-hidden','true')});
      active.classList.add('active');
      const copy=this.q(`[data-copy="${index}"]`);
      copy.classList.add('active');copy.setAttribute('aria-hidden','false');
      this.q('.current').textContent=`0${index+1}`;
      this.qa('[data-go]').forEach((el,i)=>{
        el.removeAttribute('aria-current');if(i===index)el.setAttribute('aria-current','step');
        el.classList.toggle('completed',i<index);
      });
      this.q('.prev').disabled=index===0;
      this.q('.next').disabled=index===STEPS.length-1;
      this.q('.sr').textContent=`Step ${index+1} of 6. ${STEPS[index].title.replace('<br> ',' ')}`;
      const caption=index===1?'Illustrative readings. Reference interval is schematic.': 'Illustrative data \u00b7 a visual analogy';
      this.q('.visual-label').textContent=caption;
      this.q('.scroll-hint span').textContent=index===5?'Scroll on to continue the case study.':'Scroll for the next step.';
      if(!instant && !this.isStatic && !this.reduced.matches){
        const outgoing=previous>=0 && previous!==index?this.q(`[data-scene="${previous}"]`):null;
        const turn=previous===2 && index===3 || previous===3 && index===2;
        if(outgoing){
          outgoing.classList.add('active');
          this.animate(outgoing,[{opacity:1,transform:'translateY(0) rotateY(0)'},{opacity:0,transform:turn?`translateY(0) rotateY(${-70*direction}deg)`:`translateY(${-14*direction}px) scale(.975)`}],{duration:turn?440:290,easing:'ease-in'});
        }
        this.animate(active,[{opacity:0,transform:turn?`translateY(0) rotateY(${65*direction}deg)`:`translateY(${20*direction}px) scale(.97)`},{opacity:1,transform:'translateY(0) rotateY(0) scale(1)'}],{delay:turn?240:100,duration:turn?860:720});
        this.animate(copy,[{opacity:0,transform:`translateY(${12*direction}px)`},{opacity:1,transform:'translateY(0)'}],{duration:560,delay:120});
        active.querySelectorAll('[data-sheet]').forEach((el,i)=>this.animate(el,[{transform:`translateY(${18*direction}px)`,opacity:.6},{transform:'translateY(0)',opacity:1}],{duration:780,delay:180+i*80}));
        active.querySelectorAll('[data-float]').forEach((el,i)=>this.animate(el,[{transform:'translateY(32px) scale(.93)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{duration:760,delay:390+i*90}));
        active.querySelectorAll('[data-reveal]').forEach((el,i)=>this.animate(el,[{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:460,delay:340+i*65}));
        active.querySelectorAll('[data-draw]').forEach((el,i)=>{
          const length=el.getTotalLength();
          this.animate(el,[{strokeDasharray:`${length} ${length}`,strokeDashoffset:length},{strokeDasharray:`${length} ${length}`,strokeDashoffset:0}],{duration:1000,delay:330+i*80,easing:'ease-in-out'});
        });
        // All animations share the document timeline. No independent scroll or RAF loop.
        const origin=document.timeline.currentTime;
        this.animations.forEach(a=>{a.startTime=origin;if(paused){a.pause();a.currentTime=0;}});
        if(!paused)this.pending=setTimeout(()=>{if(outgoing)outgoing.classList.remove('active')},1450);
      }
      this.dataset.chapter = String(index+1);
      if(this.suspended)this.animations.forEach(a=>{a.pause();a._resumeForPortfolio=true;});
      this.dispatchEvent(new CustomEvent('story-step',{detail:{step:index,label:STEPS[index].label},bubbles:true,composed:true}));
    }
    jump(index) {
      index=Math.max(0,Math.min(5,index));
      this.show(index);
      if(this.captureMode||this.isStatic)return;
      this.jumpLock=true;
      const waypoint=this.q(`[data-waypoint="${index}"]`);
      const rect=waypoint.getBoundingClientRect();
      // Position the chosen chapter at the viewport midpoint, without nested scrolling.
      const stickyTop=parseFloat(getComputedStyle(this).getPropertyValue('--mr-sticky-top'))||0;
      const sectionTop=window.scrollY+this.q('.story').getBoundingClientRect().top-stickyTop;
      window.scrollTo({top:Math.max(0,sectionTop,window.scrollY+rect.top+rect.height*.32-innerHeight*.5),behavior:this.reduced.matches?'instant':'smooth'});
      clearTimeout(this.unlockTimer);
      this.unlockTimer=setTimeout(()=>{this.jumpLock=false},850);
    }
    play() {
      if(this.isStatic)return;
      this.stop();
      this.captureMode=false;
      this.q('.play').innerHTML=`${icon('pause')}<span>Pause</span>`;
      this.q('.play').setAttribute('aria-label','Pause automatic preview');
      this.q('.mode').textContent='Playing the story';
      this.show(0,{replay:true});
      this.jump(0);
      this.playTimer=setInterval(()=>{
        if(this.step===5){this.stop();return;}
        this.jump(this.step+1);
      },6500);
    }
    stop() {
      if(this.playTimer){clearInterval(this.playTimer);this.playTimer=null;}
      if(!this.hasAttribute('capture'))this.captureMode=false;
      const play=this.shadowRoot?.querySelector('.play');
      if(play){play.innerHTML=`${icon('play')}<span>Play all</span>`;play.setAttribute('aria-label','Play all six steps');}
      const mode=this.shadowRoot?.querySelector('.mode');
      if(mode)mode.textContent='Scroll to explore';
    }
    /** Deterministic visual preview: seconds 0..39. Useful for video rendering. */
    seek(seconds) {
      this.captureMode=true;
      this.setAttribute('capture','');
      const index=Math.min(5,Math.floor(Math.max(0,seconds)/6.5));
      const local=Math.max(0,seconds-index*6.5);
      if(this.captureStep!==index){
        if(index>0)this.show(index-1,{instant:true,replay:true});
        this.show(index,{replay:true,paused:true});
        this.captureStep=index;
      }
      this.animations.forEach(a=>{a.pause();a.currentTime=local*1000;});
      const outgoing=index>0?this.q(`[data-scene="${index-1}"]`):null;
      if(outgoing)outgoing.classList.toggle('active',local<1.45);
      this.q('.mode').textContent='The health report analogy';
    }
    disconnectedCallback() {
      this.stop();this.observer?.disconnect();this.themeObserver?.disconnect();
      this.menuObserver?.disconnect();this.visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange',this.onVisibility);
      clearTimeout(this.resizeTimer);
      this.animations.forEach(a=>a.cancel());
      clearTimeout(this.pending);clearTimeout(this.unlockTimer);
      this.reduced.removeEventListener('change',this.onPreference);
      window.removeEventListener('resize',this.onResize);
      this.removeEventListener('wheel',this.onManual);
      this.removeEventListener('touchstart',this.onManual);
      this.removeEventListener('keydown',this.onKey);
      this.shadowRoot.removeEventListener('click',this.onClick);
      this.initialized=false;
    }
  }
  customElements.define('management-report-story',ManagementReportStory);
})();
