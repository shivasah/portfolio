/* v107 - Supplied Beyond the work polaroid orbit, using portfolio typography.
   All interaction is scoped to the component. No dependencies or network calls. */
(() => {
  'use strict';
  const section = document.querySelector('[data-beyond-work]');
  if (!section || section.dataset.beyondReady) return;
  const world = section.querySelector('[data-beyond-world]');
  const ui = section.querySelector('[data-beyond-ui]');
  const closeButton = section.querySelector('[data-beyond-close]');
  const nodes = [...section.querySelectorAll('[data-beyond-card]')];
  if (!world || !nodes.length || !closeButton) return;
  section.dataset.beyondReady = 'true';

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  let paused = reduced;
  let visible = false;
  let selected = null;
  const view = section.querySelector('.beyond-work__view');
  let width = 1, height = 1, cardWidth = 200;
  let rotation = 0, velocity = 0.0016;
  let mx = 0, my = 0, targetX = 0, targetY = 0;
  let raf = 0, last = 0, time = 0, drag = null, suppressClick = false;
  const baseVelocity = 0.0016;
  const heights = [-0.68,0.52,-0.12,0.66,-0.62,0.28,-0.34,0.72,-0.72,0.08];
  const depths = [1,0.86,1.04,0.92,1.02,0.82,0.98,0.94,1.0,0.88];
  const cards = nodes.map((el, i) => ({
    el, angle:i/nodes.length*Math.PI*2, y:heights[i % heights.length], depth:depths[i % depths.length],
    bob:i*1.73, spin:i*2.31, hover:0, pick:0, over:false,
    name:el.querySelector('.beyond-work__caption b').textContent,
    tag:el.querySelector('.beyond-work__caption i').textContent
  }));
  const active = () => visible && !document.hidden && !reduced;
  const ease = (rate, dt) => 1-Math.pow(1-rate,dt*60);
  const ensure = () => { if (!raf && active()) raf=requestAnimationFrame(frame); };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf=0; last=0; };
  const updateHint = () => {
    section.classList.toggle('has-picked',!!selected);
    ui.hidden=!selected;
    closeButton.hidden=!selected;
  };
  const close = (returnFocus=false) => {
    if (!selected) return;
    const previous=selected;
    selected=null;
    previous.el.classList.remove('is-picked');
    previous.el.setAttribute('aria-expanded','false');
    previous.el.setAttribute('aria-label',`${previous.name}, ${previous.tag}. Open`);
    updateHint();
    if(returnFocus) previous.el.focus({preventScroll:true});
    ensure();
  };
  const open = card => {
    if (selected===card) { close(); return; }
    close();
    selected=card;
    card.el.classList.add('is-picked');
    if (!reduced) card.el.classList.add('is-full-resolution');
    card.el.setAttribute('aria-expanded','true');
    card.el.setAttribute('aria-label',`${card.name}. Close`);
    updateHint();
    ensure();
  };
  function measure() {
    width=section.clientWidth;
    height=view.clientHeight || section.clientHeight;
    cardWidth=Math.round(Math.max(145,Math.min(214,width/7.2)));
    cards.forEach(c=>c.el.style.setProperty('--cw',cardWidth+'px'));
    ensure();
  }
  function mode() {
    reduced=media.matches;
    paused=reduced;
    stop();
    section.classList.toggle('beyond-work--enhanced',!reduced);
    section.classList.toggle('beyond-work--static',reduced);
    ui.hidden=!selected;
    world.style.transform='';
    cards.forEach(c=>{c.el.classList.remove('is-full-resolution');c.el.style.marginLeft='';c.el.style.marginTop='';c.el.style.transform='';c.el.style.zIndex='';c.el.style.removeProperty('--haze');});
    velocity=reduced?0:baseVelocity;
    targetX=targetY=mx=my=0;
    updateHint();measure();ensure();
  }

  /* Native vertical page scrolling stays available. Only deliberate horizontal
     drags spin the ring, and a drag can never accidentally open a card. */
  section.addEventListener('pointerdown',event=>{
    if (event.button!==0 || event.target.closest('[data-beyond-ui]')) return;
    if (selected) {
      if (!event.target.closest('[data-beyond-card]')) close();
      return;
    }
    if (reduced) return;
    drag={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,t:performance.now(),moved:0,axis:null};
  });
  section.addEventListener('pointermove',event=>{
    if(reduced) return;
    if(event.pointerType==='mouse'&&!paused) {
      const r=section.getBoundingClientRect();
      targetX=(event.clientX-r.left)/r.width-.5;
      targetY=(event.clientY-r.top)/r.height-.5;
    }
    if(drag && event.pointerId===drag.id) {
      const dx=event.clientX-drag.startX, dy=event.clientY-drag.startY;
      if(!drag.axis && Math.hypot(dx,dy)>6) {
        drag.axis=Math.abs(dx)>Math.abs(dy)*1.15?'x':'y';
        if(drag.axis==='x') {
          section.classList.add('is-dragging');
          try { section.setPointerCapture(event.pointerId); } catch (_) { /* Pointer may already be cancelled. */ }
        }
      }
      if(drag.axis==='x') {
        const delta=event.clientX-drag.x, now=performance.now(), dt=Math.max(8,now-drag.t);
        rotation+=delta*.005;
        velocity=delta*.005/dt*16.67;
        drag.moved+=Math.abs(delta);
        drag.t=now;
      }
      drag.x=event.clientX;
    }
    ensure();
  },{passive:true});
  const endDrag=event=>{
    if(!drag || (event && event.pointerId!==drag.id)) return;
    const previous=drag;
    drag=null;
    section.classList.remove('is-dragging');
    if(previous.axis) {
      suppressClick=true;
      window.setTimeout(()=>{suppressClick=false;},0);
    }
    if(section.hasPointerCapture && section.hasPointerCapture(previous.id)) section.releasePointerCapture(previous.id);
    if(paused) velocity=0;
    ensure();
  };
  window.addEventListener('pointerup',endDrag);
  window.addEventListener('pointercancel',endDrag);
  section.addEventListener('lostpointercapture',endDrag);
  section.addEventListener('pointerleave',()=>{targetX=targetY=0;ensure();});
  cards.forEach(card=>{
    card.el.addEventListener('click',event=>{
      if(suppressClick){event.preventDefault();return;}
      open(card);
    });
    card.el.addEventListener('pointerenter',()=>{card.over=true;ensure();});
    card.el.addEventListener('pointerleave',()=>{card.over=false;ensure();});
    card.el.addEventListener('focus',()=>{card.over=true;ensure();});
    card.el.addEventListener('blur',()=>{card.over=false;ensure();});
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&selected) {close(true);}
  });
  closeButton.addEventListener('click',()=>close(true));

  function frame(now) {
    raf=0;
    if(!active()) {last=0;return;}
    const dt=last?Math.min(.05,(now-last)/1000):1/60;
    last=now;
    if(!paused&&!selected) time+=dt;
    mx+=(targetX-mx)*ease(.06,dt);my+=(targetY-my)*ease(.06,dt);
    if(!drag) {
      if(paused||selected) velocity=0;
      else velocity+=(baseVelocity-velocity)*ease(.03,dt);
      rotation+=velocity*dt*60;
    }
    const flat = 1 - Math.max(...cards.map(c => c.pick));
    world.style.transform=`rotateX(${((-my*9+4)*flat).toFixed(2)}deg) rotateY(${(mx*12*flat).toFixed(2)}deg)`;
    const rx=width*.36, rz=Math.min(370,width*.26), ry=height*.34;
    let settling=Math.abs(mx-targetX)+Math.abs(my-targetY)>.0003;
    cards.forEach(card=>{
      const a=card.angle+rotation, sine=Math.sin(a), cosine=Math.cos(a);
      const bob=Math.sin(time*.9+card.bob)*10,sway=Math.sin(time*.6+card.spin);
      let x=sine*rx*card.depth, z=cosine*rz*card.depth-60, y=card.y*ry+bob;
      const over=card.over&&!selected?1:0, pick=selected===card?1:0;
      card.hover+=(over-card.hover)*ease(.15,dt);
      card.pick+=(pick-card.pick)*ease(.12,dt);
      if(Math.abs(pick-card.pick)+Math.abs(over-card.hover)>.001) settling=true;
      const f=card.pick,k=card.hover;
      z+=k*70;
      const focusZ = Math.min(500, width * .5);
      x*=1-f;
      const viewTop=view.getBoundingClientRect().top;
      const desiredY=Math.max(110,Math.min(window.innerHeight-110,window.innerHeight/2));
      const focusY=(desiredY-viewTop-height/2) / (1500/(1500-focusZ));
      y=y*(1-f)+focusY*f; z=z*(1-f)+focusZ*f;
      // Center by the actual card height, including a revealed description.
      // Fit an opened poster inside the viewport instead of enlarging/cropping it.
      if (selected !== card && f < .001) card.el.classList.remove('is-full-resolution');
      // Give the opened card a real reading-size layout. Scaling a tiny 200px
      // composited layer up to 600px makes both photographs and type blurry.
      const nativeWidth = card.el.offsetWidth;
      const cardHeight = card.el.offsetHeight;
      card.el.style.marginLeft = (-nativeWidth / 2) + 'px';
      card.el.style.marginTop = (-cardHeight / 2) + 'px';
      const perspectiveScale = 1500 / (1500 - focusZ);
      const fit = Math.max(.1, Math.min(1.1, Math.min(660, width - 64) / (nativeWidth * perspectiveScale),
        Math.min(height - 64, window.innerHeight - 172) / Math.max(1, cardHeight * perspectiveScale)));
      const restScale = cardWidth / nativeWidth;
      const pickScale = restScale + (fit - restScale) * f;
      const turnY=(-sine*16+sway*6)*(1-f)*(1-k*.7);
      const turnX=Math.sin(time*.7+card.bob)*5*(1-f)*(1-k);
      const turnZ=Math.cos(time*.5+card.spin)*4*(1-f)*(1-k);
      let haze=z>=0?0:Math.min(.5,(-z/rz)*.55);
      if(selected&&selected!==card) haze=Math.max(haze,.62);
      card.el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${turnY.toFixed(2)}deg) rotateX(${turnX.toFixed(2)}deg) rotateZ(${turnZ.toFixed(2)}deg) scale(${(pickScale+k*.04).toFixed(3)})`;
      card.el.style.setProperty('--haze',haze.toFixed(3));
      card.el.style.zIndex=String(Math.round(z+2000));
      if(selected===card){
        const rect=card.el.getBoundingClientRect(),sectionTop=section.getBoundingClientRect().top;
        ui.style.top=Math.min(window.innerHeight-64,rect.bottom+18)-sectionTop+'px';
      }
    });
    // A paused/picked-up scene sleeps after the last transition has settled.
    if((!paused&&!selected)||drag||settling) ensure();
    else last=0;
  }
  if('IntersectionObserver' in window) {
    new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      section.dataset.beyondInView=String(visible);
      if(visible) ensure(); else stop();
    },{threshold:0}).observe(section);
  } else visible=true;
  if('ResizeObserver' in window) new ResizeObserver(measure).observe(section);
  else window.addEventListener('resize',measure,{passive:true});
  if(media.addEventListener) media.addEventListener('change',mode);
  else if(media.addListener) media.addListener(mode);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) stop();else ensure();});
  window.addEventListener('scroll',()=>{if(selected)ensure();},{passive:true});
  mode();
})();
