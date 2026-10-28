/* v132 - Visual-only hero. One persistent report. No scene swap, colour jump or scale cut. Living folio. Native, reversible, section-local motion.
   Keep this file in place of the old controller, not alongside it.
   No CDN, framework, font import, wheel interception or global style mutation. */
(() => {
 'use strict';
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const mix=(a,b,t)=>a+(b-a)*t;
 const seg=(v,a,b)=>clamp((v-a)/(b-a));
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const soft=t=>1-Math.pow(1-t,3);
 const CHANGES=[.16,.435,.715,.895];
 const PHRASES=["One report meant working across four tools.", "Bring the financials and commentary into one report.", "Arrange the report in QuickBooks.", "Update the period without rebuilding the report.", "Review the report, then send it."];
 const TITLES=['Scattered across four tools','Composed in one report','Management Reports editor with outline and live commentary','Figures refreshed for FY2026','Ready to preview, save and publish'];
 const originalThread=[180,100,414,3,737,86,705,239,677,391,470,306,436,432,401,561,166,659,112,497,60,330,469,176,700,554];
 const boundThread=[220,61,220,120,220,160,220,215,220,273,220,325,220,383,220,435,220,498,220,550,220,570,220,590,220,603];
 const MOBILE_SOURCES=[[168,112,-6,1.07],[268,287,5,1],[175,527,-5,1.03],[472,636,5,.84]];
 const SPECS=[
  {id:'mh-numbers',from:[52,156,-8,.97],to:[240,141,0,1],range:[.105,.265]},
  {id:'mh-chart',from:[413,244,8,.96],to:[240,277,0,1],range:[.145,.30]},
  {id:'mh-narrative',from:[70,446,-7,.97],to:[240,471,0,1],range:[.19,.34]},
  {id:'mh-send',from:[468,563,8,1],to:[420,621,0,.89],range:[.23,.375]}
 ];
 function init(root) {
  if(!root || root._mrHero) return root?root._mrHero:null;
  const oldHTML=root.innerHTML;
  // Enhance the supplied HTML in place; its no-JavaScript poster remains available.
  // Each moving fragment becomes its own composited SVG layer. This prevents
  // translating one sheet from repainting every text glyph in the whole scene.
  const art=root.querySelector('.mh-art');
  const originalSvg=art.querySelector('svg');
  const originalCamera=originalSvg.querySelector('#mh-camera');
  const canvas=document.createElement('div');canvas.className='mh-canvas';
  const camera=document.createElement('div');camera.id='mh-camera';
  const makeSvg=()=>{
   const el=document.createElementNS('http://www.w3.org/2000/svg','svg');
   el.setAttribute('viewBox','0 0 800 700');el.setAttribute('aria-hidden','true');
   el.setAttribute('focusable','false');el.classList.add('mh-layer-svg');return el;
  };
  const background=makeSvg(),foreground=makeSvg();
  background.append(originalSvg.querySelector('defs'));
  const fragments=[];
  [...originalCamera.children].forEach(node=>{
   if(node.classList.contains('mh-piece')){
    const wrap=document.createElement('div');wrap.id=node.id;wrap.className='mh-piece';
    const payload=document.createElement('div');payload.className='mh-payload';
    const svg=makeSvg();svg.classList.remove('mh-layer-svg');svg.classList.add('mh-fragment-svg');
    const width=node.id==='mh-send'?326:434;
    const height=node.id==='mh-chart'?292:node.id==='mh-numbers'?234:210;
    svg.setAttribute('viewBox',`-30 -70 ${width} ${height}`);
    svg.style.width=width+'px';svg.style.height=height+'px';
    [...node.querySelector('.mh-payload').children].forEach(child=>svg.append(child));
    payload.append(svg);wrap.append(payload);fragments.push(wrap);
   }else if(['mh-retained','mh-review'].includes(node.id))foreground.append(node);
   else background.append(node);
  });
  camera.append(background,...fragments,foreground);canvas.append(camera);
  originalSvg.replaceWith(canvas);
  root.classList.remove('is-enhanced','mr-landing--reduced');
  const elements=new Map([...root.querySelectorAll('[id]')].map(el=>[el.id,el]));
  const $=id=>elements.get(id);
  const pin=root.querySelector('.mh-pin');
  const layers=SPECS.map(s=>({...s,el:$(s.id),payload:$(s.id).querySelector('.mh-payload'),label:$(s.id).querySelector('.mh-source-label')}));
  const rolls=[...root.querySelectorAll('.mh-value-roll')];
  const bars=[...root.querySelectorAll('.mh-bar')];
  const product=root.querySelector('.mh-product');
  root.dataset.continuous='true';root.dataset.visualOnly='true';
  canvas.prepend(product);
  product.querySelector('.mh-ui-static-image')?.remove();
  const productFit=root.querySelector('.mh-product-fit');
  const productWindow=root.querySelector('.mh-product-window');
  const productUI=root.querySelector('.mh-product-ui');
  const periodMenu=root.querySelector('.mh-ui-period-menu');
  const periodFocus=root.querySelector('.mh-ui-focus--period');
  const publishFocus=root.querySelector('.mh-ui-focus--publish');
  const uiCursor=root.querySelector('.mh-ui-cursor');
  const values={rev:[9401025.73,13161226.04],gp:[8631736.73,12503154.02],gpm:[91.82,95],ni:[6508280.73,7419230.02],npm:[69.23,56.37],opex:[2124456,5084924],opr:[22.60,38.64],ocf:[1236544,-113707.12],cfm:[13.15,-.86],art:[3.11,1.13]};
  const money=v=>(v<0?'\u2212':'')+'$'+(Math.abs(v)>=1e6?(Math.abs(v)/1e6).toFixed(1)+'M':Math.round(Math.abs(v)/1e3)+'K');
  const fm={m:money,p:v=>(v<0?'\u2212':'')+Math.abs(v).toFixed(1)+'%',x:v=>v.toFixed(2)+'x'};
  let uiYear=-1,stageWidth=900;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const abort=new AbortController();
  let frameId=0,last=0,started=performance.now(),shown=0,target=0,mode='scroll';
  let pauseY=0,visible=true,off=false,narrow=false,active=-1,year=-1,geometry={top:0,travel:1};
  let menuPaused=document.body.classList.contains('menu-open');
  let reduced=motion.matches,pointer={x:0,y:0},mouse={x:0,y:0},introStart=performance.now();
  const attributes=new WeakMap(),styles=new WeakMap();
  const attr=(el,k,v)=>{if(!el)return;v=String(v);let cache=attributes.get(el);if(!cache){cache={};attributes.set(el,cache);}if(cache[k]!==v){el.setAttribute(k,v);cache[k]=v;}};
  const style=(el,k,v)=>{if(!el)return;v=String(v);let cache=styles.get(el);if(!cache){cache={};styles.set(el,cache);}if(cache[k]!==v){el.style[k]=v;cache[k]=v;}};
  const alpha=(el,a)=>style(el,'opacity',clamp(a).toFixed(4));
  const listen=(el,name,fn,options={})=>el.addEventListener(name,fn,{...options,signal:abort.signal});
  function fitMetricValues(){
   // Measure in SVG units, independent of viewport scale. Use one size for both
   // years so the number roll does not change typography mid-transition.
   rolls.forEach(group=>{
    const maxWidth=Number(group.dataset.maxWidth);
    const baseSize=Number(group.dataset.baseSize);
    if(!maxWidth||!baseSize)return;
    const texts=[...group.querySelectorAll('text')];
    texts.forEach(text=>{text.style.fontSize=baseSize+'px';});
    const widest=Math.max(1,...texts.map(text=>text.getComputedTextLength()));
    const size=baseSize*Math.min(1,(maxWidth-1)/widest);
    texts.forEach(text=>{text.style.fontSize=size.toFixed(3)+'px';});
   });
  }
  function updateGeometry(){
   fitMetricValues();
   narrow=pin.clientWidth<900 && pin.clientHeight>510;
   stageWidth=narrow?600:900;
   const height=740;
   const fit=Math.min(art.clientWidth/stageWidth,art.clientHeight/height);
   canvas.classList.toggle('is-narrow',narrow);
   root.dataset.narrow=String(narrow);
   style(canvas,'width',stageWidth+'px');style(canvas,'height',height+'px');
   style(canvas,'transform',`translate3d(${((art.clientWidth-stageWidth*fit)/2).toFixed(3)}px,${((art.clientHeight-height*fit)/2).toFixed(3)}px,0) scale(${fit.toFixed(6)})`);
   // Layout offsets exclude the site's incoming-page translate transform.
   // Measuring the transformed rect during the loader makes the last scene overshoot.
   let pageTop=0;
   for(let node=root;node;node=node.offsetParent)pageTop+=node.offsetTop;
   geometry={top:pageTop,travel:Math.max(1,root.offsetHeight-pin.clientHeight)};
   style(productFit,'transform','none');
   style(productWindow,'transform','none');
   // Header and report scale are fixed. Resize is the only operation that changes fit.
   uiYear=-1;
  }
  function scrollTarget(){return clamp((window.scrollY-geometry.top)/geometry.travel);}
  function caption(p){
   const chapter=CHANGES.filter(v=>p>=v).length;
   if(active!==chapter){
    active=chapter;
    $('mh-live').textContent=TITLES[chapter]+'. Illustrative data.';
    root.dataset.chapter=String(chapter+1);
    const phrase=root.querySelector('[data-hero-caption]');
    if(phrase)phrase.textContent=PHRASES[chapter];
   }
  }
  function render(p,time=0){
   const assembled=soft(seg(p,.07,.245));
   const gather=ease(seg(p,.10,.375));
   const refresh=ease(seg(p,.785,.833));
   const end=soft(seg(p,.91,.98));
   const idle=!reduced&&mode!=='pause'&&mode!=='manual'?(1-seg(p,.015,.10))*(1-soft(seg(time,1.5,3.5))):0;
   const look=idle*.6;
   const settle=ease(seg(p,.365,.495));
   // Only translation, never a zoom, a new document or an opacity hand-off.
   const camX=mix(narrow?-127:0,narrow?-193:-105,settle)+(mouse.x*look*5);
   const camY=28*settle+(mouse.y*look*4);
   style($('mh-camera'),'transform',`translate3d(${camX.toFixed(3)}px,${camY.toFixed(3)}px,0)`);
   alpha($('mh-registration'),.58*(1-soft(seg(p,.10,.42))));
   alpha($('mh-folio'),assembled);
   const folioLift=(1-assembled)*16;
   attr($('mh-folio'),'transform',`translate(0 ${folioLift.toFixed(3)}) rotate(${(-4*(1-gather)).toFixed(3)} 430 350)`);
   const points=originalThread.map((v,i)=>mix(narrow&&i%2===0?v*.73+8:v,boundThread[i],gather));
   // The loose connector becomes the bound edge of the same report.
   const d=`M${points[0].toFixed(2)} ${points[1].toFixed(2)}C${points.slice(2).map(v=>v.toFixed(2)).join(' ')}`;
   attr($('mh-binding'),'d',d);alpha($('mh-binding'),mix(.38,1,gather));
   attr($('mh-thread-start'),'cx',points[0]);attr($('mh-thread-start'),'cy',points[1]);
   attr($('mh-thread-end'),'cx',points[points.length-2]);attr($('mh-thread-end'),'cy',points[points.length-1]);
   alpha($('mh-binding-dots'),mix(.45,.9,gather));
   layers.forEach((s,i)=>{
    const t=ease(seg(p,...s.range));
    const from=narrow?MOBILE_SOURCES[i]:s.from;
    let x=mix(from[0],s.to[0],t)+Math.sin(t*Math.PI)*[9,-14,8,-9][i];
    let y=mix(from[1],s.to[1],t)-Math.sin(t*Math.PI)*[28,37,32,22][i];
    const angle=mix(from[2],s.to[2],t);
    let size=mix(from[3],s.to[3],t);
    if(i===3){
     const dock=ease(seg(p,.38,.60));
     x=mix(x,narrow?708:920,dock);y=mix(y,672,dock);size=mix(size,.27,dock);
     alpha(s.el,1-soft(seg(p,.565,.625)));
    }
    style(s.el,'transform',`translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) rotate(${angle.toFixed(3)}deg) scale(${size.toFixed(5)})`);
    const float=Math.sin(time*.7+i*1.45)*4*idle;
    style(s.payload,'transform',`translate3d(${(Math.cos(time*.48+i)*2*idle).toFixed(3)}px,${float.toFixed(3)}px,0)`);
    alpha(s.label,1-soft(seg(p,s.range[0]-.01,s.range[0]+.075)));
   });
   attr($('mh-period-roll'),'transform',`translate(0 ${(-26*refresh).toFixed(3)})`);
   rolls.forEach(el=>attr(el,'transform',`translate(0 ${(-Number(el.dataset.height)*refresh).toFixed(3)})`));
   bars.forEach(el=>{
    const h=mix(Number(el.dataset.old),Number(el.dataset.new),refresh);
    attr(el,'transform',`translate(${el.dataset.x} ${(144-h).toFixed(3)}) scale(1 ${(h/100).toFixed(5)})`);
   });
   const yr=refresh<.5?0:1;
   if(yr!==year){
    year=yr;
    $('mh-chart-year').textContent=yr?'FY2025 vs FY2026':'FY2025';
    $('mh-prose-revenue').textContent=yr?'$13.2M':'$9.4M';
    $('mh-prose-income').textContent=yr?'$7.4M':'$6.5M';
   }
   alpha($('mh-refreshed'),soft(seg(p,.81,.85)));
   alpha($('mh-retained'),0);
   attr($('mh-retained'),'transform',`translate(0 ${(-8*(1-soft(seg(p,.58,.655)))).toFixed(3)})`);
   const bracket=soft(seg(p,.79,.81))*(1-soft(seg(p,.85,.89)));
   alpha($('mh-prose-bracket'),bracket*.9);
   alpha($('mh-review'),0);
   alpha($('mh-send-old'),1-soft(seg(p,.495,.55)));
   alpha($('mh-send-new'),soft(seg(p,.55,.605)));
   alpha($('mh-send-arrow'),end);
   attr($('mh-send-arrow'),'transform',`translate(0 ${(-7*(1-end)).toFixed(3)})`);
   renderUI(p);
   caption(p);
   attr(root,'data-progress',p.toFixed(5));
  }
  function renderUI(p){
   const open=ease(seg(p,.465,.625));
   alpha(product,1);alpha(art,1);
   const left=(narrow?16:104)/(narrow?600:900)*100;
   const right=(narrow?148:360)/(narrow?600:900)*100;
   const clip=`inset(${(9.6*(1-open)).toFixed(3)}% ${(right*(1-open)).toFixed(3)}% ${(13.9*(1-open)).toFixed(3)}% ${(left*(1-open)).toFixed(3)}% round 12px)`;
   alpha($('bbg'),soft(seg(p,.46,.53)));
   alpha($('bcv'),soft(seg(p,.48,.57)));
   style($('bbg'),'clipPath',clip);
   // The editor has one rounded OUTER edge. Its canvas meets the toolbar and
   // sidebar with square joins, and must not inherit the outer rounded mask.
   const canvasWidth=narrow?470:650;
   const apertureRight=(narrow?600:900)-(narrow?148:360);
   const canvasClip=`inset(${(19/632*100*(1-open)).toFixed(3)}% ${(Math.max(0,canvasWidth-apertureRight)/canvasWidth*100*(1-open)).toFixed(3)}% ${(47/632*100*(1-open)).toFixed(3)}% ${((narrow?16:104)/canvasWidth*100*(1-open)).toFixed(3)}%)`;
   style($('bcv'),'clipPath',canvasClip);
   alpha($('bframe'),soft(seg(p,.525,.665)));
   style($('bframe'),'clipPath',clip);
   [['btop',.505,.59],['bside',.535,.665],['bbot',.54,.64]].forEach(([id,a,b],i)=>{
    const v=ease(seg(p,a,b)),e=$(id);
    alpha(e,v);
    style(e,'transform',`translate(${i===1?24*(1-v):0}px,${i===0?-12*(1-v):i===2?12*(1-v):0}px)`);
   });
   const menu=soft(seg(p,.745,.768))*(1-soft(seg(p,.805,.825)));
   alpha(periodMenu,menu);style(periodMenu,'transform',`translateY(${(1-menu)*-6}px)`);
   alpha(periodFocus,soft(seg(p,.735,.755))*(1-soft(seg(p,.845,.87))));
   alpha(publishFocus,soft(seg(p,.915,.94))*(1-soft(seg(p,.975,1))));
   const point=ease(seg(p,.715,.755)),pick=ease(seg(p,.772,.799)),send=ease(seg(p,.905,.95));
   const cx=mix(mix(narrow?350:530,narrow?320:403,point),narrow?552:850,send);
   const cy=mix(mix(273,34,point)+pick*99,711,send);
   style(uiCursor,'transform',`translate(${cx}px,${cy}px)`);
   alpha(uiCursor,soft(seg(p,.715,.74))*(1-soft(seg(p,.97,.99))));
   const next=p>=.81?1:0;
   if(next!==uiYear){
    uiYear=next;
    $('bddt').textContent=narrow?(next?'FY2026':'FY2025'):(next?'FY2026 \u00b7 May 2025 - Apr 2026':'FY2025 \u00b7 May 2024 - Apr 2025');
   }
   root.dataset.uiVisible=String(p>.66);
  }
  function frame(now){
   frameId=0;
   if(off||document.hidden||menuPaused)return;
   const dt=Math.min(160,now-(last||now));last=now;
   mouse.x=mix(mouse.x,pointer.x,.08);mouse.y=mix(mouse.y,pointer.y,.08);
   if(mode==='play'&&!reduced){
    shown=clamp(shown+dt/26000);target=shown;
    window.scrollTo({top:geometry.top+shown*geometry.travel,behavior:'instant'});
    if(shown===1){mode='pause';}
   } else if(mode==='scroll'&&!reduced){
    target=scrollTarget();shown+= (target-shown)*(1-Math.exp(-dt/105));
    if(Math.abs(target-shown)<.00005)shown=target;
   }
   render(reduced?1:shown,(now-started)/1000);
   const openingIdle=shown<.14&&mode!=='pause'&&mode!=='manual'&&!reduced&&(now-started)<3600;
   if(visible&&(openingIdle||mode==='play'||Math.abs(target-shown)>.00005))request();
  }
  function request(){if(!frameId&&!off&&!menuPaused&&!document.hidden)frameId=requestAnimationFrame(frame);}
  function pause(){mode='pause';pauseY=window.scrollY;target=shown;request();}
  function play(){
   if(reduced)return;
   if(shown>.995){shown=0;target=0;window.scrollTo({top:geometry.top,behavior:'instant'});}
   mode='play';last=0;request();
  }
  function seek(progress,scroll=true){
   if(!Number.isFinite(Number(progress)))return;
   mode='manual';shown=target=clamp(Number(progress));last=0;
   if(scroll)window.scrollTo({top:geometry.top+shown*geometry.travel,behavior:'instant'});
   render(reduced?1:shown,0);
  }
  function resize(){updateGeometry();render(reduced?1:shown,0);request();}
  function setMotion(){
   reduced=motion.matches;
   root.classList.toggle('mh-reduced',reduced);
   root.classList.toggle('mh-enhanced',!reduced);
   mode=reduced?'pause':'scroll';
   updateGeometry();shown=target=reduced?1:scrollTarget();
   render(shown,0);request();
  }
  function takeControl(){if(mode==='play'){mode='scroll';target=scrollTarget();request();}}
  listen(window,'scroll',()=>{
   if(reduced||mode==='manual')return;
   if(mode==='pause'&&Math.abs(window.scrollY-pauseY)<2)return;
   if(mode!=='play'){mode='scroll';target=scrollTarget();}
   request();
  },{passive:true});
  listen(window,'wheel',()=>{if(mode==='manual')mode='scroll';takeControl();},{passive:true});
  listen(window,'touchstart',()=>{if(mode==='manual')mode='scroll';takeControl();},{passive:true});
  listen(window,'keydown',e=>{
   if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)){
    if(mode==='manual')mode='scroll';takeControl();
   }
   if(e.key==='Escape'&&mode==='play')pause();
  });
  listen(window,'resize',resize,{passive:true});
  listen(window,'pageshow',resize,{passive:true});
  listen(document,'visibilitychange',()=>{
   if(document.hidden){cancelAnimationFrame(frameId);frameId=0;}else{last=0;resize();}
  });
  listen(root.querySelector('.mh-art'),'pointermove',e=>{
   if(reduced||e.pointerType!=='mouse')return;
   const r=e.currentTarget.getBoundingClientRect();
   pointer={x:clamp((e.clientX-r.left)/r.width,0,1)*2-1,y:clamp((e.clientY-r.top)/r.height,0,1)*2-1};request();
  },{passive:true});
  listen(root.querySelector('.mh-art'),'pointerleave',()=>{pointer={x:0,y:0};request();});
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;
   if(!visible&&mode==='play')pause();
   if(visible){last=0;request();}
  },{rootMargin:'40px'}):null;
  observer?.observe(root);
  const menuObserver=new MutationObserver(()=>{
   const next=document.body.classList.contains('menu-open');
   if(next===menuPaused)return;
   menuPaused=next;
   if(next){cancelAnimationFrame(frameId);frameId=0;last=0;}
   else{last=0;updateGeometry();if(mode!=='manual'&&!reduced){mode='scroll';target=scrollTarget();}request();}
  });
  menuObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
  const resizeObserver='ResizeObserver' in window?new ResizeObserver(resize):null;
  resizeObserver?.observe(pin);
  if(motion.addEventListener)motion.addEventListener('change',setMotion);
  else motion.addListener(setMotion);
  listen(document,'portfolio:ready',resize);
  setMotion();
  if(document.fonts)document.fonts.ready.then(()=>{if(!off)resize();});
  const api={
   seek,play,pause,refresh:resize,
   get progress(){return shown;},get mode(){return mode;},
   destroy(){
    off=true;abort.abort();cancelAnimationFrame(frameId);observer?.disconnect();resizeObserver?.disconnect();menuObserver.disconnect();
    if(motion.removeEventListener)motion.removeEventListener('change',setMotion);else motion.removeListener(setMotion);
    root.classList.remove('mh-enhanced','mh-reduced');delete root.dataset.progress;delete root.dataset.chapter;
    root.innerHTML=oldHTML;delete root._mrHero;
   }
  };
  listen(window,'pagehide',event=>{if(!event.persisted)api.destroy();});
  root._mrHero=api;
  return api;
 }
 const boot=()=>{
  document.querySelectorAll('[data-mr-landing]').forEach(root=>{
   try{window.managementReportHero=init(root);}
   catch(error){root.classList.add('mh-reduced');root.classList.remove('mh-enhanced');console.error('Management Reports hero:',error);}
  });
 };
 window.ManagementReportHero={init};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
