
(()=>{
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=id=>document.getElementById(id);

/* ---------- topic patterns: light line drawings tiled across each book ---------- */
function pat(kind,col){
  const s={
    analogies:`<circle cx="16" cy="22" r="9"/><circle cx="27" cy="22" r="9"/>`,
    emotion:`<path d="M0 14 Q11 4 22 14 T44 14"/><path d="M0 32 Q11 22 22 32 T44 32"/>`,
    levelup:`<path d="M4 38 h9 v-8 h9 v-8 h9 v-8 h9"/>`,
    pres:`<rect x="8" y="8" width="11" height="11" rx="1.5"/><rect x="25" y="8" width="11" height="11" rx="1.5"/><rect x="8" y="25" width="11" height="11" rx="1.5"/><path d="M25 30.5 h11 M30.5 25 v11"/>`,
    takeaways:`<path d="M9 22 l4 4 l8 -9"/><circle cx="32" cy="12" r="1.6"/><circle cx="32" cy="32" r="1.6"/>`,
    research:`<circle cx="10" cy="12" r="2.4"/><circle cx="33" cy="16" r="2.4"/><circle cx="20" cy="34" r="2.4"/><path d="M12 13 L31 16 M32 18 L21 32 M11 14 L19 32"/>`,
    arches:`<path d="M6 40 V22 a10 10 0 0 1 20 0 V40"/><path d="M30 40 V30 a5 5 0 0 1 10 0 V40"/>`,
  }[kind];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><g fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${s}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* ---------- writing ---------- */
// publisher marks are set typographically in the site's own type (not the publishers' logos)
const BOOKS=[
 {n:'01',spine:'Storytelling through analogies',title:'Storytelling through Analogies',kind:'article',pub:'Design@AppD',year:'2024',mark:'AppD',href:'https://medium.com/design-appd/storytelling-through-analogies-247b9272ce76',c:'#232428',k:'#fcfcf4',ts:27,p:'analogies',W:44,H:356},
 {n:'02',spine:'Emotion & engagement',title:'Unlocking Emotion and Engagement: Storytelling Techniques in UX Design',kind:'article',pub:'Bootcamp',year:'',mark:'Bootcamp',href:'https://medium.com/design-bootcamp/unlocking-emotion-and-engagement-storytelling-techniques-in-ux-design-855afb9cecdf',c:'#ed663e',k:'#232428',ts:21,p:'emotion',W:48,H:336},
 {n:'03',spine:'Level Up',title:'Level Up',kind:'article',pub:'TEDxIITGuwahati',year:'',mark:'TEDx',href:'https://tedxiitguwahati.medium.com/level-up-720488822d71',c:'#e6d8b6',k:'#232428',ts:34,p:'levelup',W:40,H:318},
 {n:'04',spine:'The PRES framework',title:'Storytelling in UX Design; PRES Framework',kind:'article',pub:'UX Planet',year:'2023',mark:'UX Planet',href:'https://uxplanet.org/storytelling-in-ux-design-pres-framework-b39ec7ca91ab?gi=491167e53e9d',c:'#4a4c46',k:'#fcfcf4',ts:25,p:'pres',W:46,H:350},
 {n:'05',spine:'My internship at AppDynamics',title:'7 Takeaways from My Internship at AppDynamics',kind:'article',pub:'Design@AppD',year:'2020',mark:'AppD',href:'https://medium.com/design-appd/7-takeaways-from-my-internship-at-appdynamics-ab80037c2dd',c:'#efc94c',k:'#232428',ts:25,p:'takeaways',W:44,H:342},
 {n:'06',spine:'IEEE research paper',title:'IEEE research paper',kind:'research',pub:'IEEE Xplore',year:'',mark:'IEEE',href:'https://ieeexplore.ieee.org/abstract/document/9701536',c:'#d9ddd8',k:'#232428',ts:30,p:'research',W:40,H:326},
 {n:'07',spine:'The Blue in Green',title:'The Blue in Green',kind:'research',pub:'Archichakkar',year:'2016',mark:'Archi',href:'',c:'#ff8a63',k:'#232428',ts:32,p:'arches',W:44,H:346},
];
const D=232;
const wRow=$('wRow'),wStage=$('wStage'),wDetail=$('wDetail');
const els=BOOKS.map((b,i)=>{
  const d=document.createElement('div');d.className='bk';
  const ink=b.k==='#fcfcf4'?'rgba(252,252,244,.055)':'rgba(35,36,40,.075)';
  d.style.cssText=`--W:${b.W}px;--H:${b.H}px;--D:${D}px;--c:${b.c};--k:${b.k};--ts:${b.ts}px;--pat:${pat(b.p,ink)}`;
  const kind=b.kind==='article'?'Article':'Research';
  d.innerHTML=`<div class="bk-box">
    <div class="face f-back"></div><div class="face f-top"></div>
    <div class="face f-cover"><div class="kind"><span>${kind}</span><span>${b.n}</span></div><h4>${b.title}</h4>
      <div class="foot"><span class="pubtx">${b.pub}${b.year?'<br>'+b.year:''}</span><span class="mark">${b.mark}</span></div></div>
    <div class="face f-spine" aria-hidden="true"><span class="band" style="top:30px"></span><span class="band" style="bottom:42px"></span><span class="n">${b.n}</span><span class="t">${b.spine}</span><span class="mark">${({Bootcamp:'BC','UX Planet':'UXP',Archi:'ARC'})[b.mark]||b.mark}</span></div>
    <button class="bk-hit" type="button" aria-label="${b.title}, ${b.pub}. Open" aria-controls="wDetail" aria-expanded="false"></button><span class="bk-hover">${kind.toLowerCase()}</span></div>`;
  wRow.appendChild(d);return d;});
const endEl=document.createElement('div');endEl.className='bk-end';wRow.appendChild(endEl);

let slots=[],openIdx=-1,anim=null,filter='all',shelfWidth=600;
function layout(){
  const actual=wStage.clientWidth,scale=Math.min(1,actual/426),sw=actual/scale,gap=4;
  shelfWidth=sw;
  wRow.style.width=sw+'px';
  wRow.style.left='50%';
  wRow.style.right='auto';
  wRow.style.transform=`translateX(-50%) scale(${scale})`;
  const total=BOOKS.reduce((s,b)=>s+b.W,0)+gap*(BOOKS.length-1);
  let x=Math.max(30,sw-total-58);
  slots=BOOKS.map((b,i)=>{const lean=i===BOOKS.length-1?-4:0;const s={x,lean};x+=b.W+gap+(i===BOOKS.length-2?8:0);return s;});
  endEl.style.left=(x+10)+'px';
  els.forEach((d,i)=>{if(i!==openIdx){d.style.transform=rest(i);d.firstElementChild.style.transform='rotateY(0deg)';}});
  if(openIdx>=0){els[openIdx].style.transform=lifted(openIdx);}
}
const rest=i=>`translate3d(${slots[i].x}px,0,${-D/2}px) rotateZ(${slots[i].lean}deg)`;
function lifted(i){const sw=shelfWidth,b=BOOKS[i],free=slots[0].x;
  // rest the open cover in the empty run of shelf to the left of the books when there is room
  const c=free>D*1.2?free/2+8:Math.min(Math.max(sw*0.42,D*0.75),sw-D*0.8);return `translate3d(${c-b.W/2}px,-48px,90px)`;}
function setFaded(){els.forEach((d,i)=>{d.classList.toggle('faded',openIdx>=0&&i!==openIdx);d.classList.toggle('hidden',filter!=='all'&&BOOKS[i].kind!==filter);});}
function showInfo(i){const b=BOOKS[i],vis=BOOKS.map((x,j)=>j).filter(j=>filter==='all'||BOOKS[j].kind===filter);
  $('dKind').textContent=(b.kind==='article'?'Article':'Research')+' · '+b.pub;$('dNum').textContent=String(vis.indexOf(i)+1).padStart(2,'0')+' / '+String(vis.length).padStart(2,'0');
  $('dTitle').textContent=b.title;$('dPub').textContent=b.year?b.pub+' · '+b.year:b.pub;
  const r=$('dRead');if(b.href){r.href=b.href;r.removeAttribute('aria-disabled');r.innerHTML='Read now <span aria-hidden="true">↗</span>';}else{r.removeAttribute('href');r.setAttribute('aria-disabled','true');r.textContent='Print publication';}
  wDetail.classList.add('open');
  wDetail.querySelector('.info').hidden=false;
  wDetail.querySelector('.info').inert=false;
  wDetail.querySelector('.idle').hidden=true;
  r.tabIndex=b.href?0:-1;
  const availability=$('dAvailability');
  availability.hidden=!!b.href;
  availability.textContent=b.href?'':'Print publication. An online reading link is not available yet.';
  if(!b.href) r.textContent='Read now';
  els.forEach((el,j)=>el.querySelector('.bk-hit').setAttribute('aria-expanded',String(j===i)));}
function run(i,dir){ // dir 1 = pull out & open, -1 = put back
  const d=els[i];d.classList.toggle('open',dir>0);d.classList.add('turning');const box=d.firstElementChild,from=rest(i),mid=`translate3d(${Math.min(slots[i].x,shelfWidth-BOOKS[i].W-90)}px,-30px,120px)`,to=lifted(i);
  const dur=RM?1:820;
  const k1=dir>0?[{transform:from},{transform:mid,offset:.42},{transform:to}]:[{transform:to},{transform:mid,offset:.58},{transform:from}];
  const k2=dir>0?[{transform:'rotateY(0deg)'},{transform:'rotateY(0deg)',offset:.38},{transform:'rotateY(90deg)'}]:[{transform:'rotateY(90deg)'},{transform:'rotateY(0deg)',offset:.62},{transform:'rotateY(0deg)'}];
  const o={duration:dur,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'};
  d.style.zIndex=10;
  const a=d.animate(k1,o);box.animate(k2,o);
  return a.finished.then(()=>{d.style.transform=dir>0?to:from;box.style.transform=dir>0?'rotateY(90deg)':'rotateY(0deg)';d.getAnimations().forEach(x=>x.cancel());box.getAnimations().forEach(x=>x.cancel());if(dir<0){d.style.zIndex='';d.classList.remove('turning');}});
}
let busy=Promise.resolve();
function open(i){busy=busy.then(async()=>{
  if(openIdx===i){return close(true);}
  if(openIdx>=0){const prev=openIdx;openIdx=-1;setFaded();await run(prev,-1);}
  openIdx=i;setFaded();showInfo(i);await run(i,1);
  els[i].querySelector('.bk-hit').setAttribute('aria-label',BOOKS[i].title+'. Put back');});}
async function close(inner){const go=async()=>{if(openIdx<0)return;const i=openIdx;openIdx=-1;setFaded();wDetail.classList.remove('open');
  wDetail.querySelector('.info').hidden=true;wDetail.querySelector('.info').inert=true;
  wDetail.querySelector('.idle').hidden=false;
  els[i].querySelector('.bk-hit').setAttribute('aria-expanded','false');
  els[i].querySelector('.bk-hit').setAttribute('aria-label',BOOKS[i].title+', '+BOOKS[i].pub+'. Open');await run(i,-1);};
  if(inner)return go();busy=busy.then(go);}
els.forEach((d,i)=>d.querySelector('.bk-hit').addEventListener('click',()=>open(i)));
$('dClose').addEventListener('click',()=>{const old=openIdx;close();if(old>=0)els[old].querySelector('.bk-hit').focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openIdx>=0)close();});
document.querySelectorAll('.filters button').forEach(btn=>btn.addEventListener('click',()=>{
  filter=btn.dataset.f;document.querySelectorAll('.filters button').forEach(b=>b.setAttribute('aria-pressed',b===btn?'true':'false'));
  if(openIdx>=0&&filter!=='all'&&BOOKS[openIdx].kind!==filter)close();else if(openIdx>=0)showInfo(openIdx);setFaded();}));
window.addEventListener('resize',layout);layout();setFaded();

/* ---------- Letterwave: real live view, loaded only when the card is near ---------- */
const lw=$('lwScreen');
function fit(){const f=lw.querySelector('iframe');lw.style.setProperty('--s',(lw.clientWidth/1200).toFixed(4));}
new ResizeObserver(fit).observe(lw);
let loaded=false;
const io=new IntersectionObserver(es=>{es.forEach(async e=>{if(e.isIntersecting&&!loaded){loaded=true;
  // probe first: if the network or the host blocks the site, keep the designed poster instead of a broken frame
  try{await fetch('https://letterwave.vercel.app/',{mode:'no-cors',cache:'no-store'});}catch(err){$('lwPill').lastChild.textContent='Preview';$('lwPill').querySelector('.dot').style.display='none';return;}
  const f=document.createElement('iframe');f.title='Letterwave live view';f.loading='lazy';f.tabIndex=-1;
  f.setAttribute('sandbox','allow-scripts allow-same-origin');f.referrerPolicy='no-referrer';
  f.addEventListener('load',()=>f.classList.add('ready'));
  f.src='https://letterwave.vercel.app/';lw.insertBefore(f,lw.querySelector('.tool-open'));fit();}});},{rootMargin:'300px'});
io.observe(lw);

/* ---------- Cash Flow thumbnail: travel exactly one fold ---------- */
const roll=$('cfRoll');
function setTravel(){const vp=roll.parentElement.clientHeight,h=roll.scrollHeight;roll.style.setProperty('--travel',(-Math.max(0,h-vp))+'px');}
new ResizeObserver(setTravel).observe(roll.parentElement);
roll.querySelectorAll('img').forEach(im=>im.addEventListener('load',setTravel));
})();
