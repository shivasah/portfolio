(()=>{
'use strict';

const A = {"card": "frame-card.webp", "cardSel": "frame-cardSel.webp", "ch10": "frame-ch10.webp", "ch11": "frame-ch11.webp", "ch12": "frame-ch12.webp", "ch13": "frame-ch13.webp", "ch14": "frame-ch14.webp", "ch15": "frame-ch15.webp", "ch17": "frame-ch17.webp", "ch18": "frame-ch18.webp", "ch19": "frame-ch19.webp", "ch20": "frame-ch20.webp", "ch21": "frame-ch21.webp", "ch22": "frame-ch22.webp", "ch23": "frame-ch23.webp", "ch24": "frame-ch24.webp", "ch25": "frame-ch25.webp", "ch26": "frame-ch26.webp", "ch27": "frame-ch27.webp", "ch28": "frame-ch28.webp", "ch4": "frame-ch4.webp", "ch5": "frame-ch5.webp", "ch6": "frame-ch6.webp", "ch7": "frame-ch7.webp", "ch8": "frame-ch8.webp", "ch9": "frame-ch9.webp", "cv10": "frame-cv10.webp", "cv11": "frame-cv11.webp", "cv12": "frame-cv12.webp", "cv14": "frame-cv14.webp", "cv15": "frame-cv15.webp", "cv17": "frame-cv17.webp", "cv18": "frame-cv18.webp", "cv19": "frame-cv19.webp", "cv20": "frame-cv20.webp", "cv21": "frame-cv21.webp", "cv22": "frame-cv22.webp", "cv23": "frame-cv23.webp", "cv24": "frame-cv24.webp", "cv25": "frame-cv25.webp", "cv26": "frame-cv26.webp", "cv27": "frame-cv27.webp", "cv28": "frame-cv28.webp", "cv4": "frame-cv4.webp", "cv5": "frame-cv5.webp", "cv6": "frame-cv6.webp", "cv7": "frame-cv7.webp", "cv8": "frame-cv8.webp", "cv9": "frame-cv9.webp", "hovBS": "frame-hovBS.webp", "hovRev": "frame-hovRev.webp", "hovTB": "frame-hovTB.webp", "modal": "frame-modal.webp", "toast": "frame-toast.webp", "vp1": "frame-vp1.webp", "vp2": "frame-vp2.webp", "vp3": "frame-vp3.webp", "vp30": "frame-vp30.webp"};
const M = {"vp1": {"w": 1440, "h": 960}, "vp2": {"w": 1440, "h": 960}, "vp3": {"w": 1440, "h": 960}, "toast": {"x": 448, "y": 14, "w": 566, "h": 60}, "card": {"x": 224.0, "y": 610.5, "w": 319.5, "h": 93.0}, "f4": {"cw": 996, "y0": 100.0, "ch": 800.0, "void": "#ffffff"}, "f5": {"cw": 996, "y0": 100.0, "ch": 800.0, "void": "#ffffff"}, "f6": {"cw": 996, "y0": 100.0, "ch": 800.0, "void": "#ffffff"}, "f7": {"cw": 996, "y0": 100.0, "ch": 4000.0, "void": "#ffffff"}, "f8": {"cw": 996, "y0": 100.0, "ch": 5392.307692307692, "void": "#ffffff"}, "f10": {"cw": 996, "y0": 4740.0, "ch": 660.0, "void": "#ffffff"}, "f11": {"cw": 996, "y0": 4737.692307692308, "ch": 664.6153846153846, "void": "#ffffff"}, "f12": {"cw": 996, "y0": 4740.0, "ch": 800.0, "void": "#ffffff"}, "f13": {"cw": 996, "y0": 4740.0, "ch": 800.0, "void": "#ffffff"}, "f14": {"cw": 996, "y0": 4741.538461538461, "ch": 923.8461538461538, "void": "#ffffff"}, "f15": {"cw": 996, "y0": 5011.538461538461, "ch": 653.8461538461538, "void": "#ffffff"}, "f17": {"cw": 996, "y0": 5010.0, "ch": 800.0, "void": "#ffffff"}, "f18": {"cw": 996, "y0": 5010.7692307692305, "ch": 1151.5384615384614, "void": "#ffffff"}, "f19": {"cw": 996, "y0": 5502.307692307692, "ch": 660.0, "void": "#ffffff"}, "f20": {"cw": 996, "y0": 5502.307692307692, "ch": 680.0, "void": "#ffffff"}, "f21": {"cw": 996, "y0": 5498.461538461538, "ch": 792.3076923076923, "void": "#ffffff"}, "f22": {"cw": 996, "y0": 5500.7692307692305, "ch": 802.3076923076923, "void": "#ffffff"}, "f23": {"cw": 996, "y0": 5500.7692307692305, "ch": 802.3076923076923, "void": "#ffffff"}, "f24": {"cw": 996, "y0": 5502.307692307692, "ch": 660.0, "void": "#ffffff"}, "f25": {"cw": 996, "y0": 5502.307692307692, "ch": 660.0, "void": "#ffffff"}, "f26": {"cw": 996, "y0": 5500.7692307692305, "ch": 681.5384615384615, "void": "#ffffff"}, "f27": {"cw": 996, "y0": 5474.615384615385, "ch": 682.3076923076923, "void": "#ffffff"}, "f28": {"cw": 1440, "y0": 100.0, "ch": 8920.76923076923, "void": "#ffffff"}, "modal": {"x": 142, "y": 74, "w": 1153, "h": 802}, "hovBS": {"x": 1018.4615384615385, "y": 377.6923076923077, "w": 325.38461538461536, "h": 23.076923076923077}, "hovRev": {"x": 1018.4615384615385, "y": 466.15384615384613, "w": 325.38461538461536, "h": 23.076923076923077}, "hovTB": {"x": 1019, "y": 198, "w": 325, "h": 23}, "cardSel": {"x": 224.0, "y": 610.5, "w": 319.5, "h": 93.0}};



const $ = s => document.querySelector(s);
const views = $('#views'), fx = $('#fx'), cam = $('#cam'), cur = $('#cursor'), curSvg = cur.querySelector('svg');
const reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');
let REDUCED=reducedQuery.matches;
const el = (cls, tag='div') => { const e=document.createElement(tag); if(cls) e.className=cls; return e; };
const img = src => { const i=new Image(); i.src=src; i.decoding='sync'; i.draggable=false; i.alt=''; return i; };
const css = (e, o) => { for (const k in o) e.style[k] = typeof o[k]==='number' ? o[k]+'px' : o[k]; return e; };

/* ---------- easing ---------- */
function bez(x1,y1,x2,y2){
  const cx=3*x1, bx=3*(x2-x1)-cx, ax=1-cx-bx, cy=3*y1, by=3*(y2-y1)-cy, ay=1-cy-by;
  const sx=t=>((ax*t+bx)*t+cx)*t, sy=t=>((ay*t+by)*t+cy)*t, dx=t=>(3*ax*t+2*bx)*t+cx;
  return x=>{ if(x<=0) return 0; if(x>=1) return 1; let t=x; for(let i=0;i<6;i++){ const d=dx(t); if(Math.abs(d)<1e-6) break; t-=(sx(t)-x)/d; } return sy(Math.min(1,Math.max(0,t))); };
}
const E = { ui:bez(.4,0,.2,1), out:bez(0,0,.2,1), move:bez(.55,0,.25,1), cam:bez(.65,0,.25,1), scroll:bez(.6,0,.2,1) };

/* ---------- active-time clock / cancellation ----------
   v113: hiding the player suspends the clock; it never applies a chapter end.
   Each tween counts only visible playback time. This also protects typing,
   camera moves and report scrolling when a menu or another tab is opened. */
const CANCEL = Symbol('cancel');
const newRun = () => ({ c:false, pend:[], wake:new Set(), images:[] });
let RUN = newRun();
const chk = r => { if (r.c) throw CANCEL; };
const canAdvance = () => visible && !document.hidden;
function wakeRun(){
  if (!canAdvance()) return;
  const jobs=[...RUN.wake];RUN.wake.clear();jobs.forEach(job=>job());
  document.getAnimations().forEach(a=>{if(a.playState==='paused')a.play();});
}
function tween(dur, fn, ease=E.ui){
  const r=RUN;
  return new Promise((resolve,reject)=>{
    let elapsed=0,last=0,raf=0,done=false;
    const finish=error=>{
      if(done)return;done=true;
      if(raf)cancelAnimationFrame(raf);
      r.wake.delete(wake);
      const i=r.pend.indexOf(cancel);if(i!==-1)r.pend.splice(i,1);
      error?reject(error):resolve();
    };
    const cancel=()=>finish();
    const wake=()=>{
      if(done||r.c){finish();return;}
      last=performance.now();raf=requestAnimationFrame(tick);
    };
    const tick=now=>{
      raf=0;
      if(r.c){finish();return;}
      if(!canAdvance()){last=0;r.wake.add(wake);return;}
      if(last)elapsed+=Math.min(64,Math.max(0,now-last));
      last=now;
      const p=dur<=0?1:Math.min(1,elapsed/dur);
      try{fn(ease(p));}catch(error){finish(error);return;}
      if(p>=1)finish();else raf=requestAnimationFrame(tick);
    };
    r.pend.push(cancel);
    if(r.c)finish();else if(canAdvance())wake();else r.wake.add(wake);
  }).then(()=>chk(r));
}
function wait(ms){return tween(ms,()=>{},p=>p);}
addEventListener('unhandledrejection',e=>{if(e.reason===CANCEL)e.preventDefault();});

/* ---------- views ---------- */
// hybrid views reuse one frame's fixed chrome over another frame's canvas
const VIEWMAP = { '13x':{ch:'13', cv:'11'}, '15s':{ch:'15', cv:'17'} };
const cache = {};
function makeView(id){
  const v = el('view');
  if (id.startsWith('vp')) {
    const i = img(A[id]); i.className='full'; v.appendChild(i); v.setScroll = s => { v._s = s; };
  } else {
    const map = VIEWMAP[id] || {ch:id, cv:id};
    const m = M['f'+map.cv], cv = css(el('cv'), {width:m.cw}), ci = img(A['cv'+map.cv]);
    css(ci, {width:m.cw, height:m.ch}); cv.appendChild(ci); v.appendChild(cv);
    v.appendChild(el('fsh'));
    const ch = img(A['ch'+map.ch]); ch.className='full'; v.appendChild(ch);
    v.setScroll = s => { v._s = s; ci.style.transform = `translate3d(0,${(m.y0-107-s).toFixed(2)}px,0)`; };
  }
  v._id=id;v.setScroll(0);
  v.ready=Promise.all([...v.querySelectorAll('img')].map(i=>i.decode()));
  return v;
}
const getView = id => cache[id] || (cache[id] = makeView(id));
let curView = null;
async function show(id, s=0, {dur=240, dy=0}={}){
  const run=RUN;const v=getView(id);await v.ready;chk(run);v.setScroll(s);
  if (v === curView) return;
  css(v, {opacity: dur ? 0 : 1, transform: dy ? `translateY(${dy}px)` : ''});
  views.appendChild(v); curView = v;
  if (dur) await tween(dur, p => { v.style.opacity = p; if (dy) v.style.transform = `translateY(${dy*(1-p)}px)`; }, E.ui);
  [...views.children].forEach(c => { if (c !== v) c.remove(); });
  // Retain a short view cache; the supplied tall report would otherwise decode
  // over 140 million pixels at once inside an already image-rich portfolio.
  const old=Object.keys(cache).filter(k=>cache[k]!==curView);
  while(old.length>2){const k=old.shift();cache[k].remove();delete cache[k];}
}
async function scrollTo(s, dur, ease=E.scroll){
  const v = curView, s0 = v._s;
  await tween(dur, p => v.setScroll(s0 + (s-s0)*p), ease);
}
function patch(id, s, [x,y,w,h]){
  const v = makeView(id); v.setScroll(s); v.classList.add('patch');
  v.style.clipPath = `inset(${y}px ${1440-x-w}px ${960-y-h}px ${x}px)`;
  fx.appendChild(v); return v;
}
async function fadeOut(e, dur=200){ await tween(dur, p => e.style.opacity = 1-p); e.remove(); }
async function fadeIn(e, dur=200, dy=0){ css(e,{opacity:0}); fx.appendChild(e); await tween(dur, p => { e.style.opacity=p; if(dy) e.style.transform=`translateY(${dy*(1-p)}px)`; }, E.out); }
function imgEl(name, cls=''){
  const h = M[name], e = css(el(cls), {position:'absolute', left:h.x, top:h.y, width:h.w, height:h.h});
  const i = img(A[name]); css(i,{position:'absolute',left:0,top:0,width:'100%',height:'100%'}); e.appendChild(i);
  return e;
}

/* ---------- camera ---------- */
const camS = { z:1, cx:720, cy:480 };
function applyCam(){
  const {z,cx,cy} = camS;
  const tx = Math.min(0, Math.max(1440-1440*z, 720-cx*z)), ty = Math.min(0, Math.max(960-960*z, 480-cy*z));
  cam.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${z.toFixed(4)})`;
}
async function zoom(z, cx, cy, dur=900){
  const a = {...camS};
  await tween(dur, p => { camS.z=a.z+(z-a.z)*p; camS.cx=a.cx+(cx-a.cx)*p; camS.cy=a.cy+(cy-a.cy)*p; applyCam(); }, E.cam);
}

/* ---------- cursor ---------- */
const cs = { x:980, y:600 };
const placeCur = () => cur.style.transform = `translate(${cs.x.toFixed(2)}px,${cs.y.toFixed(2)}px)`;
async function move(x, y, {dur, onUpdate}={}){
  const x0=cs.x, y0=cs.y, dx=x-x0, dy=y-y0, d=Math.hypot(dx,dy);
  if (d < 1) return;
  dur = dur ?? Math.min(1000, 360 + d*0.4);
  const bow = Math.min(48, d*0.1) * (dx >= 0 ? 1 : -1), nx=-dy/d, ny=dx/d;
  const qx = x0+dx/2+nx*bow, qy = y0+dy/2+ny*bow;
  await tween(dur, p => { const q=1-p; cs.x=q*q*x0+2*q*p*qx+p*p*x; cs.y=q*q*y0+2*q*p*qy+p*p*y; placeCur(); onUpdate && onUpdate(cs.x, cs.y); }, E.move);
}
const pressTo = (k, dur=80) => tween(dur, p => curSvg.style.transform = `scale(${1+(k-1)*p})`);
async function press(){ ripple(); await pressTo(.86); }
async function release(){ const s=curSvg.style.transform.match(/[\d.]+/); const k0=s?+s[0]:1; await tween(110, p=>curSvg.style.transform=`scale(${k0+(1-k0)*p})`); }
async function click(){ await press(); await wait(50); await release(); }
function ripple(){
  const r = css(el('ripple'), {left:cs.x-22, top:cs.y-22});
  fx.appendChild(r);
  r.animate([{transform:'scale(.25)',opacity:1},{transform:'scale(1.15)',opacity:0}], {duration:520, easing:'cubic-bezier(0,0,.2,1)'}).onfinish = () => r.remove();
}

/* ---------- synthesized pieces ---------- */
const ICON = {
  bar:'<svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 13V8M8 13V3M13 13V6" stroke="#6b6c72" stroke-width="1.6" stroke-linecap="round"/></svg>',
  line:'<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 12l4-4 3 2 5-6" fill="none" stroke="#6b6c72" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  donut:'<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" fill="none" stroke="#6b6c72" stroke-width="2.4"/><path d="M8 3a5 5 0 0 1 5 5" fill="none" stroke="#0077c5" stroke-width="2.4"/></svg>'
};
function dropdown(x, y, w, items){
  const d = css(el('dd'), {left:x, top:y, width:w});
  d.items = items.map(([k,t]) => { const r=el('ddi'); r.innerHTML = ICON[k] + `<span>${t}</span>`; d.appendChild(r); return r; });
  return d;
}
function masks(rects){ return rects.map(([x,y,w,h]) => { const m=css(el('mask'),{left:x,top:y,width:w,height:h}); fx.appendChild(m); return m; }); }
async function typeIn(rects, speeds){
  const ms = masks(rects), caret = el('caret'); fx.appendChild(caret);
  for (let i=0; i<rects.length; i++){
    const [x,y,w,h] = rects[i], m = ms[i], n = Math.max(1, Math.round(w/7.4)), cps = speeds[i] ?? speeds[speeds.length-1];
    css(caret, {top:y+4, height:h-8, left:x});
    for (let k=1; k<=n; k++){
      const left = x + w*k/n;
      css(m, {left, width: x+w-left}); css(caret, {left});
      await wait(1000/cps * (0.55 + ((k*37)%10)/11));
    }
    m.remove();
  }
  caret.remove();
}
function skeleton(){
  // placeholder for the AI summary while it generates
  const s = css(el('skel'), {left:112, top:662, width:790, height:212});
  [[8,20,16,16,8],[30,23,120,10,4],[8,62,770,10,4],[8,82,520,10,4],[8,118,770,10,4],[8,138,740,10,4],[8,158,420,10,4]]
    .forEach(([x,y,w,h,r]) => s.appendChild(css(el('sb'), {left:x, top:y, width:w, height:h, borderRadius:r+'px'})));
  return s;
}
function addToast(instant){
  const t = imgEl('toast','toast');
  if (instant) { fx.appendChild(t); return t; }
  return fadeIn(t, 320, -18);
}

/* ---------- acts ---------- */
const END = [
  ['vp1', 0,      [980,600]],
  ['vp3', 0,      [760,560]],
  ['6',   0,      [1273,461]],
  ['8',   3560,   [560,520]],
  ['15',  4912.3, [911,712]],
  ['27',  5376.1, [780,440]],
  ['28',  8061,   [1000,640]],
  ['vp30',0,      [1181,827]]
];
function vp2Card(){
  const v = getView('vp2');
  if (!v._card){ v._sel = imgEl('cardSel'); v.appendChild(v._sel); v._card = imgEl('card'); v.appendChild(v._card); }
  return v._card;
}

const ACTS = {
  async 1(){
    vp2Card().style.opacity = 1; getView('vp2')._sel.style.opacity = 1;
    await wait(450);
    await move(1322, 130); await click();
    await show('vp2', 0, {dur:340, dy:22});
    await wait(380);
    await move(384, 656); await press();
    const card = vp2Card(); tween(160, p => card.style.opacity = 1-p);
    await release(); await wait(420);
    await move(1358, 926); await click();
    await show('vp3', 0, {dur:380});
    await move(760, 560, {dur:700});
    await wait(300);
  },
  async 2(){
    await wait(250);
    await move(520, 470); await click();
    await show('4', 0, {dur:160});
    await wait(380);
    // edit action appears above the selected cover
    await move(943, 130); await click();
    await show('5', 0, {dur:220});
    await Promise.all([ zoom(1.55, 1150, 460, 950), (async()=>{ await wait(250); await move(1273, 461, {dur:700}); })() ]);
    await wait(150); await click();
    await show('6', 0, {dur:420});
    await wait(550);
    await zoom(1, 720, 480, 950);
    await wait(500);
  },
  async 3(){
    await wait(250);
    await move(1408, 142); await click();
    await show('7', 0, {dur:220});
    await wait(300);
    // scroll to where the balance sheet belongs, under the P&L
    await move(560, 520, {dur:520});
    await scrollTo(3200, 1600);
    await wait(350);
    await move(1075, 390);
    const hb = imgEl('hovBS'); await fadeIn(hb, 120);
    await wait(260);
    await move(1310, 390, {dur:520}); await click();
    await show('8', 3200, {dur:280});
    fadeOut(hb, 160);
    await wait(500);
    await move(560, 520, {dur:520});
    await scrollTo(3560, 800);
    await wait(500);
  },
  async 4(){
    await scrollTo(4640, 950);
    await move(793, 592); await click();
    await show('10', 4640, {dur:220});
    await wait(250);
    await Promise.all([ zoom(1.3, 990, 470, 850), move(1174, 364, {dur:850}) ]);
    await click();
    const dd = dropdown(1036, 384, 300, [['bar','Bar chart'],['line','Line chart'],['donut','Donut chart']]);
    dd.items[1].classList.add('hov');
    await fadeIn(dd, 150, -4);
    await wait(250);
    await move(1110, 476, {dur:420});
    dd.items[1].classList.remove('hov'); dd.items[2].classList.add('hov');
    await wait(150); await click();
    const lbl = css(el('lbl'), {left:1040, top:352, width:150, height:24});
    lbl.innerHTML = ICON.donut + '<span>Donut chart</span>';
    fx.appendChild(lbl);
    fadeOut(dd, 120);
    await show('11', 4640, {dur:380});
    await wait(650);
    await zoom(1, 720, 480, 850);
    const menuCover = patch('11', 4640, [300, 748, 430, 145]);
    await move(506, 735);
    await show('12', 4640, {dur:160});
    await wait(250); await click();
    await fadeOut(menuCover, 160);
    await wait(300);
    await move(583, 849); await click();
    lbl.remove();
    await show('13x', 4640, {dur:240});
    await wait(300);
    // add the Revenue KPI with a click, same as the balance sheet
    await move(1110, 478);
    const hr = imgEl('hovRev'); await fadeIn(hr, 120);
    await wait(260);
    await move(1310, 478, {dur:500}); await click();
    await show('14', 4642, {dur:220});
    fadeOut(hr, 160);
    await wait(250);
    await move(560, 560, {dur:500});
    await scrollTo(4912.3, 750);
    await wait(250);
    // resize the card to full width: the wide card is revealed as the edge is dragged
    await move(353, 712); await press();
    const wide = patch('15', 4912.3, [107, 482, 256, 258]);
    const band = patch('15', 4912.3, [107, 440, 256, 42]);   // hides the action bar while dragging
    const rz = css(el('rz'), {left:107, top:486, width:256, height:234}); fx.appendChild(rz);
    rz.innerHTML = '<svg viewBox="0 0 14 14"><g transform="translate(0.5 0.5)" fill="none" stroke="#1c4770" stroke-width="1.4" stroke-linecap="round"><path d="M4.6 0A4.6 4.6 0 0 1 0 4.6"/><path d="M8.4 0A8.4 8.4 0 0 1 0 8.4"/></g></svg>';
    await move(911, 712, {dur:950, onUpdate:x => {
      const w = Math.max(256, Math.min(812, x+9-107)), wb = Math.min(w, 690);
      wide.style.clipPath = `inset(482px ${1440-107-w}px ${960-740}px 107px)`;
      band.style.clipPath = `inset(440px ${1440-107-wb}px ${960-482}px 107px)`;
      css(rz, {width:w});
    }});
    await release();
    rz.remove(); wide.remove();
    await show('15', 4912.3, {dur:0});
    await fadeOut(band, 220);
    await wait(450);
    // AI generation remains deferred in MANAGEMENT-REPORTS-TODO.md.
    await wait(650);
  },
  async 5(){
    await wait(200);
    await move(1408, 142); await click();
    await show('17', 4910, {dur:220});
    await wait(300);
    await move(1110, 210);
    const ht = imgEl('hovTB'); await fadeIn(ht, 120);
    await wait(250);
    await move(1309, 210, {dur:450}); await click();
    await show('18', 4911.5, {dur:200});
    fadeOut(ht, 160);
    await move(520, 470, {dur:600});
    await scrollTo(5403, 900);
    await zoom(1.6, 500, 610, 900);
    await move(300, 600, {dur:420});
    await show('19', 5403, {dur:0});
    await typeIn([[114, 551, 178, 27]], [16]);
    await wait(250);
    await move(581, 522); await click();
    await show('20', 5403.8, {dur:130});
    await wait(250);
    await move(560, 670); await click();
    await show('21', 5399.9, {dur:130});
    await wait(500);
    await show('22', 5402.5, {dur:100});
    await wait(350);
    await move(328, 631); await click();
    await show('23', 5402.5, {dur:130});
    await wait(380);
    await move(335, 669); await click();
    await show('24', 5403, {dur:150});
    await wait(300);
    const rects = [[424,552,448,25],[113,576,410,21],[113,605,792,23],[113,627,792,21],[113,646,340,23]];
    await move(560, 720, {dur:500});
    await show('25', 5403, {dur:0});
    await typeIn(rects, [30, 30, 85]);
    await wait(400);
    await move(780, 440); await click();
    await show('26', 5401.5, {dur:220});
    const sh = [[281,554,143,22],[527,554,83,22]].map(([x,y,w,h]) => { const s=css(el('shim'),{left:x,top:y,width:w,height:h}); fx.appendChild(s); return s; });
    await wait(1100);
    await show('27', 5376.1, {dur:320});
    sh.forEach(s => s.remove());
    await wait(700);
    await zoom(1, 720, 480, 950);
    await wait(350);
  },
  async 6(){
    await wait(200);
    await move(590, 927); await click();
    await show('28', 0, {dur:420});
    await wait(500);
    await move(720, 520, {dur:600});
    await scrollTo(8061, 7000, bez(.4,0,.25,1));
    await wait(350);
    await move(1000, 640, {dur:500});
  },
  async 7(){
    await wait(200);
    await move(1367, 926); await click();
    const scrim = el('scrim'), modal = imgEl('modal','modal');
    css(scrim,{opacity:0}); css(modal,{opacity:0}); fx.appendChild(scrim); fx.appendChild(modal);
    await tween(280, p => { scrim.style.opacity=p; modal.style.opacity=p; modal.style.transform=`translateY(${(1-p)*14}px) scale(${.985+.015*p})`; }, E.out);
    await wait(250);
    await move(489, 242); await wait(260);
    await move(489, 320); await wait(220);
    await move(470, 724); await wait(220);
    await move(1181, 827); await click();
    await tween(180, p => { modal.style.opacity=1-p; modal.style.transform=`scale(${1-.015*p})`; });
    await show('vp30', 0, {dur:380});
    await tween(160, p => scrim.style.opacity = 1-p);
    scrim.remove(); modal.remove();
    await wait(200);
    await addToast(false);
    await wait(1200);
  }
};


/* The portfolio owns scrolling. The player animates the selected act and holds. */
function applyEnd(n){
 fx.innerHTML='';views.innerHTML='';curView=null;
 camS.z=1;camS.cx=720;camS.cy=480;applyCam();curSvg.style.transform='';
 const [id,s,[x,y]]=END[n];const v=getView(id);
 css(v,{opacity:1,transform:''});v.setScroll(s);views.appendChild(v);curView=v;
 cs.x=x;cs.y=y;placeCur();if(n===7)addToast(true);
}
let playing=0,shown=0,started=false,visible=false,requested=1,allowMotion=false;
let pendingReplay=false;
function notify(state,n=requested,detail){
 parent.postMessage({type:'report-flow-state',version:113,act:n,state,...(detail?{detail}: {})},'*');
}
function ready(){parent.postMessage({type:'report-flow-ready',version:113,acts:7},'*');}
function stop(){
 const old=RUN;old.c=true;[...old.pend].forEach(f=>f());old.pend=[];old.wake.clear();
 for(const a of document.getAnimations())a.cancel();playing=0;
}
function suspend(){
 if(playing){
  document.getAnimations().forEach(a=>{if(a.playState==='running')a.pause();});
  notify('suspended',playing);
 }
}
async function setStill(n){
 stop();const r=newRun();RUN=r;
 try{await getView(END[n][0]).ready;chk(r);applyEnd(n);shown=n;notify('paused',Math.max(1,n));}
 catch(e){if(e!==CANCEL){console.error('Report walkthrough:',e);notify('error',Math.max(1,n),'A report image could not load.');}}
}
async function go(n,instant=false,replay=false){
 n=Math.min(7,Math.max(1,Math.round(Number(n)||1)));requested=n;
 if(replay)pendingReplay=true;
 if(!started)return;
 if(instant||(REDUCED&&!allowMotion)){pendingReplay=false;await setStill(n);return;}
 if(!canAdvance())return;
 const restart=pendingReplay;pendingReplay=false;
 if(n===playing&&!restart){wakeRun();notify('playing',n);return;}
 if(n===shown&&!playing&&!restart){notify('paused',n);return;}
 stop();const r=newRun();RUN=r;playing=n;notify('loading',n);
 try{
  await getView(END[n-1][0]).ready;chk(r);
  const extra={1:['card','cardSel'],3:['hovBS'],4:['hovRev','cv15','ch15'],5:['hovTB'],7:['modal','toast']}[n]||[];
  r.images=extra.map(k=>img(A[k]));await Promise.all(r.images.map(i=>i.decode()));chk(r);
  if(n===1){const c=vp2Card();await Promise.all([...c.parentNode.querySelectorAll('img')].map(i=>i.decode()));chk(r);}
  applyEnd(n-1);shown=-1;notify(canAdvance()?'playing':'suspended',n);
  await ACTS[n]();chk(r);
  // The act has finished. Decode its endpoint before revealing the final still.
  await getView(END[n][0]).ready;chk(r);
  applyEnd(n);shown=n;playing=0;r.images=[];notify('paused',n);
 }catch(e){
  if(e!==CANCEL&&!r.c){
   console.error('Report walkthrough:',e);stop();shown=-1;
   notify('error',n,'A report image could not load. Retry the animation.');
  }
 }
}
addEventListener('message',event=>{
 if(event.source!==parent||!event.data||typeof event.data!=='object')return;
 const d=event.data;
 if(d.type==='report-flow-ping'&&started)ready();
 if(d.type==='report-flow-motion')allowMotion=Boolean(d.allowMotion);
 if(d.type==='report-flow-visible'){
  visible=Boolean(d.visible);
  if(!visible)suspend();
  else if(started){wakeRun();go(requested);}
 }
 if(d.type==='report-flow-go')go(d.act,Boolean(d.instant),Boolean(d.replay));
});
reducedQuery.addEventListener('change',e=>{
 REDUCED=e.matches;
 if(started){if(REDUCED&&!allowMotion)setStill(requested);else go(requested);}
});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)suspend();else if(visible&&started){wakeRun();go(requested);}
});
addEventListener('pagehide',stop);
const screenEl=$('#screen'),stageEl=$('#stage');
function resize(){stageEl.style.transform=`scale(${screenEl.clientWidth/1440})`;}
if('ResizeObserver' in window)new ResizeObserver(resize).observe(screenEl);
addEventListener('resize',resize);resize();
window.ReportFlow={
 get state(){return{version:113,started,playing,shown,requested,visible,
  suspended:Boolean(playing&&!canAdvance()),view:curView?curView._id:null,
  cursor:{...cs},camera:{...camS},canvasScroll:curView?curView._s:0,
  reduced:REDUCED,allowMotion};},
 still(n){requested=Math.min(7,Math.max(0,Number(n)||0));return setStill(requested);},
 go(n){visible=true;return go(n);},
 replay(){visible=true;return go(requested,false,true);}
};
(async()=>{
 try{
  const opening=getView('vp1');await opening.ready;
  views.appendChild(opening);opening.style.opacity='.001';
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  applyEnd(0);shown=0;started=true;$('#loading')?.remove();ready();if(visible)go(requested);
 }catch(e){console.error(e);if($('#loading'))$('#loading').textContent='The report images could not load.';notify('error');}
})();
})();
