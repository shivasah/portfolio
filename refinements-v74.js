
/* Corrected v74. Accessible menu, stationary hover notes, one disclosure
   controller and a screen-fit walkthrough. No third-party runtime needed. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ms = () => reduced.matches ? 0 : 320;
  const easing = 'cubic-bezier(.22,.72,.22,1)';
  const clamp = (n, min=0, max=1) => Math.max(min,Math.min(max,n));

  const toggle=document.querySelector('.site-menu__works-toggle');
  const panel=document.getElementById('site-menu-case-studies');
  if(toggle&&panel){
    let animation=null,serial=0,expanded=false;
    const setOpen=open=>{
      expanded=open;const current=++serial;
      const start=panel.hidden?0:panel.getBoundingClientRect().height;
      animation?.cancel();panel.hidden=false;panel.inert=!open;
      toggle.setAttribute('aria-expanded',String(open));
      panel.style.height='auto';
      const end=open?panel.scrollHeight:0;
      panel.style.height=`${start}px`;
      const finish=()=>{
        if(current!==serial)return;
        panel.style.height=open?'auto':'0px';panel.hidden=!open;
        animation?.cancel();animation=null;
      };
      if(!ms()){finish();return;}
      animation=panel.animate([{height:`${start}px`},{height:`${end}px`}],{duration:ms(),easing,fill:'forwards'});
      animation.finished.then(finish).catch(()=>{});
    };
    panel.hidden=true;panel.inert=true;panel.style.height='0px';
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>setOpen(!expanded));
    reduced.addEventListener('change',()=>{if(reduced.matches)setOpen(expanded);});
  }

  const cursor=document.querySelector('.cursor-scribble');
  if(cursor){
    let pending=false,x=0,y=0;
    document.addEventListener('pointermove',e=>{
      x=e.clientX;y=e.clientY;if(pending)return;pending=true;
      requestAnimationFrame(()=>{
        const el=document.elementFromPoint(x,y);
        const dark=!document.body.classList.contains('menu-open') &&
          el?.closest('[data-header-theme]')?.dataset.headerTheme==='dark';
        cursor.style.setProperty('--cursor-line',dark?'#f3f0e7':'#292e26');pending=false;
      });
    },{passive:true});
  }

  document.querySelectorAll('[data-research-note]').forEach(card=>{
    let pinned=false;
    const set=open=>card.setAttribute('aria-expanded',String(open));
    card.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')set(true);});
    card.addEventListener('pointerleave',()=>{if(!pinned&&!card.matches(':focus-visible'))set(false);});
    card.addEventListener('focus',()=>set(true));
    card.addEventListener('blur',()=>{pinned=false;set(false);});
    card.addEventListener('click',()=>{pinned=!pinned;set(pinned);});
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();pinned=!pinned;set(pinned);}
      if(e.key==='Escape'){pinned=false;set(false);card.blur();}
    });
  });

  document.querySelectorAll('details.case-disclosure').forEach(details=>{
    const summary=details.querySelector('summary'), body=details.querySelector('.story-accordion__body');
    if(!summary||!body)return;
    let expanded=details.open,animation=null,serial=0;
    const sync=()=>{summary.setAttribute('aria-expanded',String(expanded));details.dataset.expanded=String(expanded);body.inert=!expanded;};
    sync();

    summary.addEventListener('click',e=>{
      e.preventDefault();
      const start=details.open?body.getBoundingClientRect().height:0;
      expanded=!expanded;sync();const current=++serial;animation?.cancel();
      details.open=true;body.style.height='auto';body.style.overflow='hidden';
      const end=expanded?body.scrollHeight:0;
      body.style.height=`${start}px`;
      const finish=()=>{
        if(current!==serial)return;
        details.open=expanded;body.style.height=expanded?'auto':'0px';
        body.style.removeProperty('overflow');animation?.cancel();animation=null;sync();
      };
      if(!ms()){finish();return;}
      animation=body.animate([{height:`${start}px`,opacity:expanded?0:1},{height:`${end}px`,opacity:expanded?1:0}],
        {duration:ms(),easing,fill:'forwards'});
      animation.finished.then(finish).catch(()=>{});
    });
  });

  const flow=document.querySelector('body.page-case-agent #solution.screen-flow');
  if(!flow)return;
  const sticky=flow.querySelector('.screen-flow__sticky');
  const header=flow.querySelector('.screen-flow__header');
  const frame=flow.querySelector('.screen-flow__frame');
  const copy=flow.querySelector('.screen-flow__copy');
  const screens=[...flow.querySelectorAll('.flow-screen')];
  const steps=[...flow.querySelectorAll('.flow-step')];
  const marks=[...flow.querySelectorAll('.screen-flow__rail span')];
  if(!sticky||!frame||!screens.length||screens.length!==steps.length)return;
  flow.dataset.flowManaged='';
  const nav=document.createElement('nav');
  nav.className='flow-controls';nav.setAttribute('aria-label','Walkthrough screens');
  nav.innerHTML='<button type="button" data-flow-prev aria-label="Previous screen">←</button><span data-flow-position aria-live="polite">1 of 8</span><button type="button" data-flow-next aria-label="Next screen">→</button>';
  sticky.append(nav);
  const prev=nav.querySelector('[data-flow-prev]'),next=nav.querySelector('[data-flow-next]'),position=nav.querySelector('[data-flow-position]');
  let index=-1,raf=0,compact=true,manualUntil=0;
  const fit=()=>{
    if(compact){frame.style.removeProperty('--fitted-screen-width');return;}
    const cs=getComputedStyle(sticky),gap=parseFloat(cs.columnGap)||0,rowGap=parseFloat(cs.rowGap)||0;
    const availableHeight=sticky.clientHeight-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0)-
      header.getBoundingClientRect().height-nav.getBoundingClientRect().height-rowGap*2;
    const availableWidth=sticky.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0)-
      copy.getBoundingClientRect().width-gap;
    const ratio=Number(screens[Math.max(0,index)].dataset.flowAspect)||1.54639;
    const width=Math.max(1,Math.min(availableWidth,availableHeight*ratio));
    const value=`${Math.round(width)}px`;
    if(frame.style.getPropertyValue('--fitted-screen-width')!==value)frame.style.setProperty('--fitted-screen-width',value);
  };
  const show=(target,announce=false)=>{
    const value=clamp(target,0,screens.length-1);
    if(index!==value){
      index=value;
      screens.forEach((screen,i)=>{screen.classList.toggle('is-active',i===index);screen.setAttribute('aria-hidden',String(i!==index));});
      steps.forEach((step,i)=>{step.classList.toggle('is-active',i===index);step.setAttribute('aria-hidden',String(i!==index));});
      marks.forEach((mark,i)=>mark.classList.toggle('is-active',i===index));
      flow.style.setProperty('--flow-aspect',screens[index].dataset.flowAspect||'1.54639');
      position.textContent=`${index+1} of ${screens.length}`;
      prev.disabled=index===0;next.disabled=index===screens.length-1;
    }
    fit();
  };
  const update=()=>{
    raf=0;
    if(compact||performance.now()<manualUntil){fit();return;}
    const r=flow.getBoundingClientRect(),range=flow.offsetHeight-innerHeight;
    const progress=range>0?clamp(-r.top/range):0;
    show(Math.min(screens.length-1,Math.floor(progress*screens.length)));
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(update);};
  const resize=()=>{
    const previousMode=compact;
    compact=innerWidth<=1000||innerHeight<=720||reduced.matches;
    flow.dataset.flowMode=compact?'compact':'scroll';
    if(compact)show(Math.max(0,index));
    else request();
    fit();
  };
  const choose=target=>{
    target=clamp(target,0,screens.length-1);
    if(!compact){
      const top=flow.getBoundingClientRect().top+scrollY;
      const range=Math.max(0,flow.offsetHeight-innerHeight);
      window.scrollTo({top:top+range*(target+.45)/screens.length,behavior:'instant'});
      manualUntil=performance.now()+80;
    }
    show(target,true);
  };
  prev.addEventListener('click',()=>choose(index-1));next.addEventListener('click',()=>choose(index+1));
  nav.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(index+(e.key==='ArrowRight'?1:-1));}
  });
  let swipe=null;
  frame.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipe={x:e.clientX,y:e.clientY};},{passive:true});
  frame.addEventListener('pointerup',e=>{
    if(!swipe)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.4)choose(index+(dx<0?1:-1));
  },{passive:true});
  frame.addEventListener('pointercancel',()=>{swipe=null;});
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',resize,{passive:true});reduced.addEventListener('change',resize);
  screens.forEach(s=>s.addEventListener('load',fit,{once:true}));
  resize();show(0);request();document.fonts?.ready.then(fit);
})();
