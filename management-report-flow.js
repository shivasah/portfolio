/* v110: page scroll selects an act; the supplied animation plays once and holds.
   The iframe never scrolls the page. No wheel interception or global scroll snap. */
(() => {
  'use strict';
  const section=document.querySelector('#solution.mr-report-flow');
  if(!section)return;
  const track=section.querySelector('.mr-report-track');
  const pin=section.querySelector('.mr-report-pin');
  const frame=document.getElementById('reportFlowFrame');
  const title=section.querySelector('[data-mr-flow-title]');
  const copy=section.querySelector('[data-mr-flow-copy]');
  const count=section.querySelector('[data-mr-flow-count]');
  const status=section.querySelector('[data-mr-flow-status]');
  const buttons=[...section.querySelectorAll('[data-mr-act]')];
  const previous=section.querySelector('[data-mr-flow-prev]'),next=section.querySelector('[data-mr-flow-next]');
  const visual=section.querySelector('.mr-report-visual'),viewport=section.querySelector('.mr-report-viewport'),poster=section.querySelector('.mr-report-poster');
  const chapters=[...section.querySelectorAll('.mr-report-static article')].map(article=>({
    title:article.querySelector('h3').textContent,
    description:article.querySelector('div > p:last-child').textContent,poster:article.querySelector('img').getAttribute('src')
  }));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const short=matchMedia('(max-height: 480px)');
  let ready=false,active=0,raf=0,lastVisible=null,enhanced=false,near=false;
  const post=message=>frame.contentWindow?.postMessage(message,'*');
  const blocked=()=>document.hidden || document.documentElement.classList.contains('menu-locked') || Boolean(document.querySelector('dialog[open]'));
  function setUI(n){
    const item=chapters[n-1];if(!item)return;
    title.textContent=item.title;copy.textContent=item.description;count.textContent=`${n} of ${chapters.length}`;
    buttons.forEach((b,i)=>{b.classList.toggle('is-done',i<n-1);if(i===n-1)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    section.dataset.flowAct=String(n);previous.disabled=n===1;next.disabled=n===chapters.length;if(poster.getAttribute('src')!==item.poster)poster.src=item.poster;
  }
  function select(n,force=false){
    if(n===active&&!force)return;
    active=n;setUI(n);
    status.textContent='';
    if(ready)post({type:'report-flow-go',act:n,instant:reduced.matches});
  }
  function sync(force=false){
    raf=0;if(!enhanced){if(ready)post({type:'report-flow-visible',visible:false});return;}
    const aw=visual.clientWidth,ah=visual.clientHeight;if(aw>0&&ah>0){const w=Math.min(aw,ah*1.5);viewport.style.setProperty('--report-screen-width',`${w.toFixed(2)}px`);viewport.style.setProperty('--report-screen-height',`${(w/1.5).toFixed(2)}px`);}
    const rect=track.getBoundingClientRect();
    const vh=Math.max(1,pin.clientHeight||innerHeight);
    const visible=rect.top<innerHeight*.75 && rect.bottom>0 && !blocked();
    if(ready&&(visible!==lastVisible||force))post({type:'report-flow-visible',visible});
    lastVisible=visible;
    if(!visible)return;
    const local=Math.max(0,-rect.top);
    const n=Math.min(chapters.length,Math.floor((local+vh*.08)/(vh*1.1))+1);
    select(n,force);
  }
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(()=>sync());};
  function configure(){
    enhanced=!reduced.matches&&!short.matches;
    section.classList.toggle('is-enhanced',enhanced);
    active=0;lastVisible=null;schedule();
  }
  function jump(n){
    if(!enhanced)return;
    n=Math.min(chapters.length,Math.max(1,n));
    const vh=pin.clientHeight||innerHeight;
    const top=scrollY+track.getBoundingClientRect().top+(n-1)*1.1*vh+vh*.05;
    window.scrollTo({top,behavior:reduced.matches?'auto':'smooth'});
  }
  previous.addEventListener('click',()=>jump(active-1));next.addEventListener('click',()=>jump(active+1));
  buttons.forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.mrAct))));
  section.addEventListener('keydown',event=>{
    if(!enhanced||!event.target.closest('.mr-report-progress,.mr-report-controls'))return;
    if(event.key==='ArrowRight'){event.preventDefault();jump(active+1);buttons[Math.min(chapters.length-1,active)]?.focus({preventScroll:true});}
    if(event.key==='ArrowLeft'){event.preventDefault();jump(active-1);buttons[Math.max(0,active-2)]?.focus({preventScroll:true});}
  });
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||!event.data)return;
    const d=event.data;
    if(d.type==='report-flow-ready'){
      ready=true;section.classList.add('is-motion-ready');sync(true);
    }
    if(d.type==='report-flow-state' && d.state==='error'){
      section.classList.remove('is-enhanced');enhanced=false;
      post({type:'report-flow-visible',visible:false});return;
    }
    if(d.type==='report-flow-state' && Number(d.act)===active){
      section.dataset.flowState=d.state;
      if(d.state==='playing')status.textContent='';
      if(d.state==='paused')status.textContent=active===chapters.length?'Walkthrough complete.':'Scroll to the next step.';
      if(d.state==='error'){
        section.classList.remove('is-enhanced');enhanced=false;
        post({type:'report-flow-visible',visible:false});
      }
    }
  });
  frame.addEventListener('load',()=>post({type:'report-flow-ping'}));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting&&!near){near=true;frame.loading='eager';post({type:'report-flow-ping'});}
      schedule();
    },{rootMargin:'900px 0px'});observer.observe(track);
  }else frame.loading='eager';
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('pagehide',()=>post({type:'report-flow-visible',visible:false}));
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',configure);short.addEventListener('change',configure);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(visual);
  configure();
  post({type:'report-flow-ping'});
})();
