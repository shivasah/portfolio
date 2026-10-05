/* v112: option B from the supplied landing-hero options.
   Four source windows become one report. No option switch, third-party player,
   or font import. All motion is local to this section and reverses with scroll. */
(() => {
  'use strict';
  const root=document.querySelector('[data-mr-landing]');
  if(!root) return;
  const pin=root.querySelector('.mr-landing__pin');
  const visual=root.querySelector('.mr-landing__visual');
  const scene=root.querySelector('#mr-landing-scene');
  const copy=root.querySelector('.mr-landing__copy');
  const intro=root.querySelector('.mr-landing__intro');
  const hint=root.querySelector('.mr-landing__hint');
  const facts=root.querySelector('.mr-landing__facts');
  const fallback=root.querySelector('.mr-landing__fallback');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!scene||!pin||!visual||!copy) return;
  const byId=id=>scene.querySelector('#'+id);
  let narrow=window.innerWidth<900, anim=null;
  function makeScene(){
    scene.replaceChildren();
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,k)=>a+(b-a)*k;
const seg=(p,a,b)=>cl((p-a)/(b-a),0,1);
const io=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;      // in-out cubic
const eo=u=>1-Math.pow(1-u,3);
const D={rev:[9401025.73,13161226.04],gp:[8631736.73,12503154.02],gpm:[91.82,95.0],ni:[6508280.73,7419230.02],npm:[69.23,56.37],
  opex:[2124456,5084924],opr:[22.60,38.64],ocf:[1236544,-113707.12],cfm:[13.15,-0.86],art:[3.11,1.13],inv:[91,61]};
const PER=['FY2025 · May 2024 – Apr 2025','FY2026 · May 2025 – Apr 2026'];
const money=v=>{const n=v<0?'−':'',a=Math.abs(v);return n+'$'+(a>=1e6?(a/1e6).toFixed(1)+'M':Math.round(a/1e3)+'K');};
const F={m:money,p:v=>(v<0?'−':'')+Math.abs(v).toFixed(1)+'%',x:v=>v.toFixed(2)+'x',n:v=>String(Math.round(v))};
const chip=(k,f,i=0)=>`<span class="chip" data-k="${k}" data-f="${f}">${F[f](D[k][i])}</span>`;

const UI={x:narrow?0:500,y:narrow?0:80,w:900,h:740,top:52,bot:56,side:250};
UI.cx=UI.x;UI.cy=UI.y+UI.top;UI.cw=UI.w-UI.side;UI.ch=UI.h-UI.top-UI.bot;
const caret=`<svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" fill="none" stroke="#2b2e33" stroke-width="1.6" stroke-linecap="round"/></svg>`;
function chrome(st,pfx,periodIdx,extraBot=''){
  st.insertAdjacentHTML('beforeend',`
  <div class="L ui-bg" id="${pfx}bg" style="left:${UI.x}px;top:${UI.y}px;width:${UI.w}px;height:${UI.h}px"></div>
  <div class="L ui-canvas" id="${pfx}cv" style="left:${UI.cx}px;top:${UI.cy}px;width:${UI.cw}px;height:${UI.ch}px"></div>`);
  return ()=>st.insertAdjacentHTML('beforeend',`
  <div class="L ui-top" id="${pfx}top" style="left:${UI.x}px;top:${UI.y}px;width:${UI.w}px;height:${UI.top}px">
    <span class="t">Annual financial summary</span><svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 12l1-3 7-7 2 2-7 7z" fill="none" stroke="#6b7280" stroke-width="1.3"/></svg>
    <span class="dd" id="${pfx}dd"><span id="${pfx}ddt">${PER[periodIdx]}</span>${caret}</span><span class="sp"></span>
    <span class="m">Last updated just now</span><span class="m">Give feedback</span><span class="m" style="font-size:16px">×</span></div>
  <div class="L ui-side" id="${pfx}side" style="left:${UI.x+UI.w-UI.side}px;top:${UI.cy}px;width:${UI.side}px;height:${UI.ch}px">
    <h4>Outline <span style="font-weight:400;color:#6b7280">×</span></h4>
    ${['Cover page','Executive summary','KPI scorecard','Profitability','Cash flow','Financial statements'].map((t,i)=>`<div class="ol${i===1?' on':''}"><span>${t}</span><i></i></div>`).join('')}
    <span class="addsec">Add section</span></div>
  <div class="L ui-bot" id="${pfx}bot" style="left:${UI.x}px;top:${UI.y+UI.h-UI.bot}px;width:${UI.w}px;height:${UI.bot}px">
    <span>Close</span><span style="color:#1f4e8c">Preview report</span><span class="sp"></span>${extraBot}<span class="btn">Save draft</span><span class="btn p">Publish</span></div>`);
}
const op=(el,o)=>{el.style.opacity=o.toFixed(3);el.style.visibility=o<0.002?'hidden':'visible';};
const fade=(el,o,dy=0)=>{el.style.opacity=o.toFixed(3);el.style.transform=dy?`translateY(${dy.toFixed(1)}px)`:'';el.style.visibility=o<0.002?'hidden':'visible';};

const B=(()=>{
  const st=scene;
  const addFront=chrome(st,'b',1,`<span class="dd" id="bShare" style="border-color:#2a7de1;color:#0f4c8a;opacity:0">Publish &amp; send · Board report</span>`);
  // the report page, already sitting in the builder canvas
  const PS=0.62,PX=UI.cx+(UI.cw-714*PS)/2,PY=UI.cy+6;
  const slot={k0:[44,132,200,110],k1:[257,132,200,110],k2:[470,132,200,110],txt:[44,266,626,110],ch:[44,396,626,250]};
  const toStage=r=>[PX+r[0]*PS,PY+r[1]*PS,r[2]*PS,r[3]*PS];
  const kcard=(l,v,s)=>`<div style="width:200px;height:110px;border:1px solid #d5dce4;border-radius:10px;padding:14px 16px;background:#fff;font-family:var(--mf)"><div style="font:600 12px/1.3 var(--mf);color:#4b5563">${l}</div><div style="font:300 32px/1.1 var(--mf);margin-top:10px;color:#1f2933">${v}</div><div style="font:400 11px var(--mf);color:#6b7280;margin-top:6px">${s}</div></div>`;
  const leadDst=`<div style="width:626px;height:110px;font:400 19px/1.62 var(--mf);color:#1f2933">Revenue reached ${chip('rev','m',1)} with a ${chip('gpm','p',1)} gross margin, and net income came in at ${chip('ni','m',1)}.</div>`;
  const grp=[['Revenue',D.rev],['Gross profit',D.gp],['Net income',D.ni],['Operating expenses',D.opex]];
  const chartDst=(()=>{const W=626,H=250,mx=14e6,bh=150,base=200;let s=`<div style="width:${W}px;height:${H}px;border:1px solid #d5dce4;border-radius:10px;background:#fff;padding:14px 16px;font-family:var(--mf)"><div style="font:600 12px/1.3 var(--mf);color:#4b5563">FY2025 vs FY2026</div><svg viewBox="0 0 626 232" width="${W-34}" height="${H-40}" style="display:block;margin-top:6px">`;
    grp.forEach(([n,v],i)=>{const x=30+i*140;[0,1].forEach(j=>{const h=v[j]/mx*bh;s+=`<rect x="${x+j*42}" y="${base-h-14}" width="36" height="${h}" rx="3" fill="${j?'#1fbf9f':'#b9cbe0'}"/><text x="${x+j*42+18}" y="${base-h-20}" font-size="11" text-anchor="middle" fill="#374151">${money(v[j])}</text>`;});s+=`<text x="${x+39}" y="${base+4}" font-size="11.5" text-anchor="middle" fill="#4b5563">${n}</text>`;});
    s+=`<g font-size="11" fill="#4b5563"><rect x="420" y="2" width="10" height="10" fill="#b9cbe0"/><text x="436" y="11">FY2025</text><rect x="500" y="2" width="10" height="10" fill="#1fbf9f"/><text x="516" y="11">FY2026</text></g></svg></div>`;return s;})();
  // legacy sources
  const qRows=[['Total Income','13,161,226.04'],['Gross Profit','12,503,154.02'],['Net Income','7,419,230.02']];
  const qRow=(l,v)=>`<div style="width:368px;height:30px;display:flex;justify-content:space-between;align-items:center;padding:0 8px;font:700 13px/1 var(--mf);border-top:1px solid #000;background:#fff"><span>${l}</span><span>${v}</span></div>`;
  const xlChart=(()=>{let s=`<div style="width:196px;height:150px;background:#fff;border:1px solid #c8c8c8"><svg width="196" height="150"><text x="8" y="16" font-size="10" font-family="var(--mf)" fill="#333">FY25 vs FY26</text>`;grp.forEach(([n,v],i)=>{[0,1].forEach(j=>{const h=v[j]/14e6*100;s+=`<rect x="${14+i*45+j*16}" y="${130-h}" width="13" height="${h}" fill="${j?'#ed7d31':'#4472c4'}"/>`;});});return s+`<line x1="8" y1="130" x2="190" y2="130" stroke="#999"/></svg></div>`;})();
  const wordTxt=`<div style="width:272px;height:110px;font:400 15px/1.55 var(--mf);color:#111;background:#fff">Revenue reached $13.2M with a 95% gross margin, and net income came in at $7.4M.<span style="display:inline-block;width:1.5px;height:16px;background:#111;vertical-align:-2px;margin-left:2px"></span></div>`;
  const mailSub=`<div style="width:348px;height:30px;display:flex;align-items:center;gap:8px;padding:0 8px;font:400 13px/1 var(--mf);color:#111;background:#fff;border-bottom:1px solid #ddd"><span style="color:#666">Subject</span><b style="font-weight:600">FY2026 board report ; final_v3.docx</b></div>`;
  const shareDst=`<div style="width:236px;height:32px;display:flex;align-items:center;justify-content:center;border:1px solid #2a7de1;border-radius:6px;font:600 12px/1 var(--mf);color:#0f4c8a;background:#fff">Publish &amp; send · Board report</div>`;
  // windows
  const win=(id,x,y,w,h,title,col,body)=>`<div class="L win" id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="bar" style="background:${col}"><i></i><i></i><i></i><span style="margin-left:6px">${title}</span></div>${body}</div>`;
  const WIN=narrow?{q:[8,10,400,300],x:[480,10,400,290],w:[8,435,380,290],e:[498,470,380,250]}:{q:[40,210,400,300],x:[1010,210,400,290],w:[60,520,380,290],e:[1030,570,380,250]};
  st.insertAdjacentHTML('beforeend',`<div class="L" id="bGhost" style="left:${PX}px;top:${PY}px;width:${714*PS}px;height:${1010*PS}px;border:2px dashed rgba(35,36,40,.25);border-radius:6px"></div>`);
  // Builder background is drawn first; the report stays above it.
  st.insertAdjacentHTML('beforeend',`<div class="L" id="bPageWrap" style="left:${PX}px;top:${PY}px;width:714px;height:1010px;transform:scale(${PS});transform-origin:0 0">
    <div class="pg" id="bPage" style="left:0;top:0"><h2>Executive summary</h2><div class="rule"></div>
     <div id="bSlots"></div>
     <ul id="bMore" style="position:absolute;left:44px;right:44px;top:668px;margin:0;padding-left:18px;font:400 14px/1.7 var(--mf)">
       <li>Operating expenses totalled ${chip('opex','m',1)}, ${chip('opr','p',1)} of revenue.</li>
       <li>Operating cash flow was ${chip('ocf','m',1)}, a cash flow margin of ${chip('cfm','p',1)}.</li>
       <li>Accounts receivable turned over ${chip('art','x',1)} during the year.</li></ul>
     <div class="foot"><span>Prepared by the CFO's office, Keystone Construction LLC</span><span style="font-size:13px">1</span></div></div></div>`);
  const slots=byId('bSlots');
  const dsts={k0:kcard('Revenue',chip('rev','m',1),PER[1].split(' · ')[0]),k1:kcard('Gross profit',chip('gp','m',1),'Margin '+F.p(D.gpm[1])),k2:kcard('Net income',chip('ni','m',1),'Margin '+F.p(D.npm[1])),txt:leadDst,ch:chartDst};
  Object.entries(dsts).forEach(([k,h])=>slots.insertAdjacentHTML('beforeend',`<div class="L" id="bS_${k}" style="left:${slot[k][0]}px;top:${slot[k][1]}px;opacity:0">${h}</div>`));
  st.insertAdjacentHTML('beforeend',
   win('bWq',...WIN.q,'QuickBooks · Profit and Loss','#2ca01c',`<div style="padding:14px 16px;font:400 12px var(--mf)"><div style="font:700 15px var(--mf)">Profit and Loss</div><div style="color:#888;font-size:11px;margin:4px 0 12px">Keystone Construction LLC · May 2025 – Apr 2026</div><div style="height:30px;border-top:1px solid #000;display:flex;justify-content:space-between;align-items:center;padding:0 8px"><span>4120 Consulting Services</span><span>9,306,395.94</span></div><div style="height:108px"></div><div style="height:30px;border-top:1px solid #000;display:flex;justify-content:space-between;align-items:center;padding:0 8px;color:#2a5d97"><span>EXPENSES</span><span></span></div></div>`)+
   win('bWx',...WIN.x,'Excel · fy26-board-numbers.xlsx','#217346',`<div style="display:grid;grid-template-columns:28px repeat(4,1fr);font:400 10.5px var(--mf)">${['','A','B','C','D'].map(h=>`<div style="background:#f3f3f3;border:1px solid #e1e1e1;padding:3px;text-align:center;color:#666">${h}</div>`).join('')}${[1,2,3,4,5,6,7].map(r=>`<div style="background:#f3f3f3;border:1px solid #e1e1e1;padding:3px;text-align:center;color:#666">${r}</div>`+[0,1,2,3].map(c=>`<div style="border:1px solid #eee;padding:3px;height:20px;text-align:right">${r>1&&r<6&&c<2?(c?grp[r-2][1][1]:grp[r-2][1][0]).toLocaleString('en-US',{maximumFractionDigits:0}):r===1&&c<2?['FY25','FY26'][c]:''}</div>`).join('')).join('')}</div>`)+
   win('bWw',...WIN.w,'Word · Board report_final_v3.docx','#2b579a',`<div style="background:#f3f3f3;height:256px;padding:16px 26px"><div style="background:#fff;height:100%;padding:20px 24px;font:400 12px/1.6 var(--mf);color:#111"><div style="font:700 15px var(--mf);margin-bottom:8px">Board report</div></div></div>`)+
   win('bWe',...WIN.e,'Email · New message','#0f6cbd',`<div style="font:400 13px var(--mf)"><div style="height:34px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid #ddd"><span style="color:#666">To</span>Board of directors</div><div style="height:30px"></div><div style="padding:12px 16px;color:#555;line-height:1.6">Hi all, attaching this year's board report.<br>Numbers copied from QuickBooks as of today.</div><div style="margin:4px 16px;display:inline-flex;gap:8px;align-items:center;border:1px solid #ccc;border-radius:4px;padding:8px 10px;font-size:12px">📎 Board report_final_v3.docx</div></div>`));
  addFront();
  // flying pieces: [src html, src w,h, src rect in stage, dst html, dst w,h, dst rect fn, timing]
  const FL=[];
  const addFly=(src,sw,sh,sr,dst,dw,dh,dr,t0,t1,slotId)=>{const el=document.createElement('div');el.className='fly';el.innerHTML=`<div>${src}</div><div style="opacity:0">${dst}</div>`;st.appendChild(el);FL.push({el,sw,sh,sr,dw,dh,dr,t0,t1,slotId});};
  qRows.forEach((r,i)=>{const sx=WIN.q[0]+16,sy=WIN.q[1]+34+14+40+i*34+30;addFly(qRow(...r),368,30,[sx,sy,368,30],dsts['k'+i],200,110,toStage(slot['k'+i]),0.14+i*0.035,0.34+i*0.035,'k'+i);});
  addFly(xlChart,196,150,[WIN.x[0]+190,WIN.x[1]+60,196,150],chartDst,626,250,toStage(slot.ch),0.24,0.46,'ch');
  addFly(wordTxt,272,110,[WIN.w[0]+50,WIN.w[1]+34+16+46,272,110],leadDst,626,110,toStage(slot.txt),0.32,0.52,'txt');
  addFly(mailSub,348,30,[WIN.e[0]+16,WIN.e[1]+34+34,348,30],shareDst,236,32,null,0.50,0.62,'share');
  const $=id=>byId(id);
  let shareRect=null;
  function render(p,time){
    // windows drift gently, then empty out as their content leaves
    Object.entries({q:[0,0.14,0.42],x:[1.3,0.24,0.52],w:[2.1,0.32,0.58],e:[3.2,0.5,0.6]}).forEach(([k,[ph,a,b]])=>{const el=$('bW'+k);const f=1-seg(p,b-0.06,b);
      const dx=Math.sin(time*0.5+ph)*4*(1-seg(p,0,0.12)),dy=Math.cos(time*0.6+ph)*5*(1-seg(p,0,0.12));const inw=eo(seg(p,a,b))*18;
      el.style.opacity=f.toFixed(3);el.style.visibility=f<0.01?'hidden':'visible';el.style.transform=`translate(${dx}px,${dy}px) scale(${(1-0.06*seg(p,a,b)).toFixed(3)})`;});
    fade($('bGhost'),(1-seg(p,0.10,0.22))*1);
    const pg=seg(p,0.10,0.22);$('bPageWrap').style.opacity=pg.toFixed(3);
    fade($('bMore'),seg(p,0.48,0.56));
    // builder assembles around the finished page
    const u=seg(p,0.44,0.56);['bbg','bcv'].forEach(id=>fade($(id),u));['btop','bside','bbot'].forEach((id,i)=>fade($(id),seg(p,0.46+i*0.02,0.58+i*0.02),(1-eo(seg(p,0.46+i*0.02,0.58+i*0.02)))*(i===2?12:-12)));
    if(!shareRect){const r=$('bShare').getBoundingClientRect(),s=st.getBoundingClientRect(),k=s.width/1440;shareRect=[(r.left-s.left)/k,(r.top-s.top)/k,r.width/k,r.height/k];}
    FL.forEach(f=>{const t=io(seg(p,f.t0,f.t1));const dr=f.dr||shareRect;const sr=f.sr;
      const x=lerp(sr[0],dr[0],t),y=lerp(sr[1],dr[1],t)-Math.sin(t*Math.PI)*40,w=lerp(sr[2],dr[2],t);
      const arc=Math.sin(t*Math.PI)*-2.5;
      f.el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${arc.toFixed(2)}deg)`;
      const [a,b]=f.el.children;a.style.transform=`scale(${(w/f.sw).toFixed(4)})`;b.style.transform=`scale(${(w/f.dw).toFixed(4)})`;
      const x2=seg(t,0.45,0.9);a.style.opacity=(1-x2).toFixed(3);b.style.opacity=x2.toFixed(3);
      const landed=seg(p,f.t1-0.005,f.t1+0.01);
      f.el.style.opacity=(1-landed).toFixed(3);f.el.style.boxShadow='';
      const sl=f.slotId==='share'?$('bShare'):$('bS_'+f.slotId);sl.style.opacity=landed.toFixed(3);});
    // word numbers become live chips: flash once on landing
    st.querySelectorAll('#bS_txt .chip').forEach((c,i)=>c.classList.toggle('flash',p>0.52&&p<0.58));
  }
  return {st,render,resetGeometry:()=>{shareRect=null;}};
})();


    return B;
  }
  let shown=0, target=0, raf=0, visible=true, last=0, start=performance.now();
  let geometry={width:0,height:0,narrow:false};
  const clamp=v=>Math.min(1,Math.max(0,v));
  function read(){
    const r=root.getBoundingClientRect();
    target=motion.matches?1:clamp(-r.top/Math.max(1,r.height-pin.clientHeight));
    return r;
  }
  function fit(){
    const nowNarrow=window.innerWidth<900;
    if(nowNarrow!==narrow||!anim){narrow=nowNarrow;anim=makeScene();}
    const W=pin.clientWidth,H=pin.clientHeight;
    // Final copy is measured at its native size, including the loaded webfonts.
    // Only the illustration is scaled. Facts and navigation never shrink.
    const factH=facts.getBoundingClientRect().height;
    const pad=narrow?Math.max(20,W*.055):Math.max(32,Math.min(72,W*.045));
    root.style.setProperty('--landing-pad',pad+'px');
    root.style.setProperty('--landing-fact-height',factH+'px');
    const copyH=copy.getBoundingClientRect().height;
    const endY=narrow?Math.max(88,H*.145):0;
    if(narrow)copy.style.top=endY+'px';
    geometry={width:W,height:H,narrow,pad,factH,copyH,endY};
    anim.resetGeometry();
    layout(shown,true);
  }
  function layout(p,force=false){
    const {width:W,height:H,pad,factH,copyH,endY}=geometry;
    if(!W)return;
    const e=clamp((p-.52)/.22);
    const ease=e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2;
    let top,bottom,k,stageX,stageY;
    bottom=Math.max(22,H*.028)+factH+28;
    if(narrow){
      const initialY=Math.max(220,H*.265);
      top=initialY+(endY+copyH+18-initialY)*ease;
      const available=Math.max(110,H-top-bottom);
      k=Math.min((W-2*pad)/900,available/740);
      stageX=(W-900*k)/2;
      stageY=top+(available-740*k)/2;
      scene.style.width='900px';scene.style.height='740px';
      copy.style.left=pad+'px';copy.style.width=(W-2*pad)+'px';
      copy.style.transform='none';
    }else{
      top=Math.max(90,H*.1);
      const available=H-top-bottom;
      k=Math.min((W-2*pad)/1440,available/740);
      stageX=(W-1440*k)/2;
      stageY=top+(available-740*k)/2-80*k;
      scene.style.width='1440px';scene.style.height='900px';
      copy.style.left=(stageX+72*k)+'px';
      copy.style.width=(390*k)+'px';
      copy.style.top=(stageY+450*k)+'px';
      copy.style.transform='translateY(-50%)';
    }
    scene.style.transform=`translate(${stageX.toFixed(2)}px,${stageY.toFixed(2)}px) scale(${k.toFixed(5)})`;
    root.style.setProperty('--landing-scale',k);
    const co=motion.matches?1:clamp((p-.62)/.12);
    const ino=motion.matches?0:1-clamp((p-.035)/.075);
    copy.style.opacity=co;copy.style.visibility=co<.003?'hidden':'visible';
    copy.inert=co<.9;
    intro.style.opacity=ino;intro.style.visibility=ino<.003?'hidden':'visible';
    const ho=motion.matches?0:1-clamp(p/.055);
    hint.style.opacity=ho;hint.style.visibility=ho<.003?'hidden':'visible';
    facts.style.opacity=motion.matches?1:clamp((p-.65)/.12);
    facts.style.visibility=(motion.matches||p>.65)?'visible':'hidden';
    root.dataset.progress=p.toFixed(4);
    if(force) anim.resetGeometry();
  }
  function frame(now){
    raf=0;
    if(document.hidden||(!visible&&Math.abs(target-shown)<.0001))return;
    read();
    const dt=Math.min(48,now-(last||now));last=now;
    shown=motion.matches?1:shown+(target-shown)*(1-Math.exp(-dt/110));
    if(Math.abs(target-shown)<.0001)shown=target;
    layout(shown);
    anim.render(shown,motion.matches?0:(now-start)/1000);
    // Only the opening windows drift; settled chapters have no idle render loop.
    if(visible&&((shown<.12&&!motion.matches)||Math.abs(target-shown)>.0001)) request();
  }
  function request(){if(!raf)raf=requestAnimationFrame(frame);}
  function resize(){fit();read();request();}
  function setMotion(){
    root.classList.toggle('mr-landing--reduced',motion.matches);
    read();shown=target;resize();
  }
  try{
    anim=makeScene();
    root.classList.add('is-enhanced');
    root.classList.toggle('mr-landing--reduced',motion.matches);
    fallback.hidden=true;
    read();shown=target;fit();anim.render(shown,0);request();
    addEventListener('scroll',()=>{read();request();},{passive:true});
    addEventListener('resize',resize,{passive:true});
    addEventListener('pageshow',resize,{passive:true});
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{last=0;resize();}
    });
    if(window.ResizeObserver)new ResizeObserver(resize).observe(copy);
    if(window.IntersectionObserver)new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;if(visible){last=0;read();request();}
    },{rootMargin:'120px'}).observe(root);
    if(motion.addEventListener)motion.addEventListener('change',setMotion);
    else if(motion.addListener)motion.addListener(setMotion);
    if(document.fonts)document.fonts.ready.then(resize);
  }catch(error){
    root.classList.remove('is-enhanced');fallback.hidden=false;
    console.error('Management Reports landing fallback:',error);
  }
})();
