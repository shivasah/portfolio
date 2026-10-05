/* v113: scroll chooses an act; the real player animates it and holds.
   Posters are only the loading/no-script fallback, never a scroll slideshow.
   A temporarily hidden player suspends its active clock without skipping ahead. */
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
  const previous=section.querySelector('[data-mr-flow-prev]');
  const next=section.querySelector('[data-mr-flow-next]');
  const replay=section.querySelector('[data-mr-flow-replay]');
  const retry=section.querySelector('[data-mr-flow-retry]');
  const optin=section.querySelector('[data-mr-flow-optin]');
  const feedback=section.querySelector('.mr-report-feedback');
  const feedbackText=section.querySelector('[data-mr-flow-feedback]');
  const visual=section.querySelector('.mr-report-visual');
  const viewport=section.querySelector('.mr-report-viewport');
  const chapters=[...section.querySelectorAll('.mr-report-static article')].map(article=>({
    title:article.querySelector('h3').textContent,
    description:article.querySelector('div > p:last-child').textContent
  }));
  if(!frame||!track||!pin||!chapters.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let ready=false,active=0,raf=0,lastVisible=null,enhanced=false,userMotion=false;
  let connectTimer=0,connectStarted=0,loadAttempts=0,loadError=false;
  const source=frame.getAttribute('src');
  const post=message=>frame.contentWindow?.postMessage(message,'*');
  const blocked=()=>document.hidden||document.documentElement.classList.contains('menu-locked')||Boolean(document.querySelector('dialog[open]'));
  function showFeedback(text,error=false){
    feedback.hidden=!text;feedbackText.textContent=text||'';retry.hidden=!error;
    viewport.setAttribute('aria-busy',text&&!error?'true':'false');
  }
  function setUI(n){
    const item=chapters[n-1];if(!item)return;
    title.textContent=item.title;copy.textContent=item.description;
    count.textContent=`${n} of ${chapters.length}`;
    buttons.forEach((button,i)=>{
      button.classList.toggle('is-done',i<n-1);
      if(i===n-1)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    });
    section.dataset.flowAct=String(n);
    previous.disabled=n===1;next.disabled=n===chapters.length;
    replay.disabled=!ready||loadError;
    // Do not replace the poster here. Replacing it on each scroll created
    // a convincing but silent slideshow when the iframe was not ready.
  }
  function select(n,force=false){
    if(n===active&&!force)return;
    active=n;setUI(n);status.textContent='';
    if(ready&&!loadError)post({type:'report-flow-go',act:n,instant:false});
  }
  function connect(){
    if(ready||loadError||connectTimer)return;
    connectStarted=performance.now();post({type:'report-flow-ping'});
    connectTimer=setInterval(()=>{
      if(ready||loadError){clearInterval(connectTimer);connectTimer=0;return;}
      post({type:'report-flow-ping'});
      if(performance.now()-connectStarted>18000){
        clearInterval(connectTimer);connectTimer=0;loadError=true;
        section.dataset.flowState='error';
        showFeedback('The animation could not load. Please retry.',true);
      }
    },600);
  }
  function sync(force=false){
    raf=0;
    if(!enhanced){
      if(ready)post({type:'report-flow-visible',visible:false});lastVisible=false;return;
    }
    const aw=visual.clientWidth,ah=visual.clientHeight;
    if(aw>0&&ah>0){
      const w=Math.min(aw,ah*1.5);
      viewport.style.setProperty('--report-screen-width',`${w.toFixed(2)}px`);
      viewport.style.setProperty('--report-screen-height',`${(w/1.5).toFixed(2)}px`);
    }
    const rect=track.getBoundingClientRect();
    if(rect.top<innerHeight+1000&&rect.bottom>-1000)connect();
    const screen=viewport.getBoundingClientRect();
    const visiblePixels=Math.max(0,Math.min(screen.bottom,innerHeight)-Math.max(screen.top,0));
    // Start when the SCREEN is in view, not while only the section heading
    // has reached the viewport and the animation itself is still below it.
    const visible=screen.height>0&&visiblePixels/screen.height>=.55&&!blocked();
    if(ready&&(visible!==lastVisible||force)){
      post({type:'report-flow-motion',allowMotion:userMotion});
      post({type:'report-flow-visible',visible});
    }
    lastVisible=visible;
    if(!visible)return;
    const vh=Math.max(1,pin.clientHeight||innerHeight);
    const n=Math.min(chapters.length,Math.floor((Math.max(0,-rect.top)+vh*.08)/(vh*1.1))+1);
    select(n,force);
  }
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(()=>sync());};
  function configure(){
    enhanced=!reduced.matches||userMotion;
    section.classList.toggle('is-enhanced',enhanced);
    section.classList.toggle('is-motion-opted-in',userMotion);
    section.dataset.flowMode=enhanced?'motion':'reduced-motion';
    optin.hidden=enhanced;
    active=0;lastVisible=null;setUI(1);schedule();
  }
  function jump(n){
    if(!enhanced)return;
    n=Math.min(chapters.length,Math.max(1,n));
    const vh=pin.clientHeight||innerHeight;
    const top=scrollY+track.getBoundingClientRect().top+(n-1)*1.1*vh+vh*.05;
    window.scrollTo({top,behavior:reduced.matches?'auto':'smooth'});
  }
  function replayStep(){
    if(!ready||loadError)return;
    post({type:'report-flow-motion',allowMotion:userMotion});
    post({type:'report-flow-visible',visible:!blocked()});
    post({type:'report-flow-go',act:active||1,replay:true,instant:false});
  }
  function retryPlayer(){
    ready=false;loadError=false;lastVisible=null;
    section.classList.remove('is-motion-ready');section.dataset.flowState='loading';
    replay.disabled=true;showFeedback('Loading animation...');
    if(connectTimer)clearInterval(connectTimer);connectTimer=0;
    loadAttempts++;
    frame.src=source+(source.includes('?')?'&':'?')+'reload='+loadAttempts;
    frame.loading='eager';connect();
  }
  previous.addEventListener('click',()=>jump(active-1));next.addEventListener('click',()=>jump(active+1));
  replay.addEventListener('click',replayStep);retry.addEventListener('click',retryPlayer);
  optin.addEventListener('click',()=>{
    userMotion=true;post({type:'report-flow-motion',allowMotion:true});configure();
    requestAnimationFrame(()=>jump(1));
  });
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const n=Number(button.dataset.mrAct);n===active?replayStep():jump(n);
  }));
  section.addEventListener('keydown',event=>{
    if(!enhanced||!event.target.closest('.mr-report-progress,.mr-report-controls'))return;
    if(event.key==='ArrowRight'){event.preventDefault();jump(active+1);buttons[Math.min(chapters.length-1,active)]?.focus({preventScroll:true});}
    if(event.key==='ArrowLeft'){event.preventDefault();jump(active-1);buttons[Math.max(0,active-2)]?.focus({preventScroll:true});}
  });
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||!event.data||typeof event.data!=='object')return;
    const d=event.data;
    if(d.type==='report-flow-ready'){
      const first=!ready;ready=true;loadError=false;
      if(connectTimer)clearInterval(connectTimer);connectTimer=0;
      section.classList.add('is-motion-ready');replay.disabled=false;
      showFeedback('');if(first)sync(true);return;
    }
    if(d.type!=='report-flow-state'||Number(d.act)!==(active||1))return;
    // Ignore late pause/resume acknowledgements after an error. The visible
    // retry state stays until a fresh player announces it is ready.
    if(loadError&&d.state!=='error')return;
    section.dataset.flowState=d.state;
    if(d.state==='error'){
      loadError=true;replay.disabled=true;
      showFeedback('The animation could not load. Please retry.',true);
      status.textContent='The animation could not load.';
      post({type:'report-flow-visible',visible:false});
      return; // Keep the player and its retry control; never silently switch to posters.
    }
    if(d.state==='loading')showFeedback('Preparing this step...');
    if(d.state==='playing'||d.state==='suspended'||d.state==='paused')showFeedback('');
    if(d.state==='playing')status.textContent='';
    if(d.state==='paused')status.textContent=active===chapters.length?'Walkthrough complete.':'Scroll to the next step.';
  });
  frame.addEventListener('load',()=>{post({type:'report-flow-ping'});schedule();});
  frame.addEventListener('error',()=>{
    loadError=true;showFeedback('The animation could not load. Please retry.',true);
  });
  // Load the tiny player document up front; its images remain demand-loaded.
  // This avoids lazy-iframe initialization depending on a distant sticky track.
  frame.loading='eager';
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(()=>schedule(),{rootMargin:'1000px 0px'});
    observer.observe(track);
    // Other sticky scenes can change document geometry while settling.
    // Observe the actual screen as well as the long chapter track.
    const screenObserver=new IntersectionObserver(schedule,{threshold:[0,.01,.25,.55,.75,1]});
    screenObserver.observe(viewport);
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',()=>{post({type:'report-flow-ping'});schedule();});
  window.addEventListener('pagehide',()=>post({type:'report-flow-visible',visible:false}));
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{userMotion=false;configure();});
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  if('ResizeObserver' in window){
    const sizes=new ResizeObserver(schedule);sizes.observe(visual);sizes.observe(pin);
    const main=document.getElementById('main');if(main)sizes.observe(main);
  }
  showFeedback('Loading animation...');configure();post({type:'report-flow-ping'});
})();
