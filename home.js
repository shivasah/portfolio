/* Componentry interaction adaptations for the static portfolio.
 * Newsletter layout/flight timing adapted from Harsh Jadhav's MIT source.
 * CSS 3D replaces React Three Fiber/WebGL; no third-party runtime is needed.
 * Homepage case studies are isolated in case-study-stack.js.
 * See COMPONENTS-V55.md and THIRD-PARTY-NOTICES.txt. */
(() => {
  'use strict';
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const lerp = (a, b, t) => a + (b - a) * t;
  const damp = (a, b, speed, dt) => lerp(a, b, 1 - Math.exp(-speed * dt));

  // Newsletter Bookshelf: clothed spines, pull-out covers and adjustable orbit.
  const shelf = document.querySelector('[data-bookshelf]');
  if (!shelf) return;
  const stage = shelf.querySelector('[data-books-stage]');
  const items = [...shelf.querySelectorAll('[data-book-id]')];
  const filters = [...document.querySelectorAll('[data-books-filter]')];
  const previous = shelf.querySelector('[data-shelf-prev]');
  const next = shelf.querySelector('[data-shelf-next]');
  const back = shelf.querySelector('[data-shelf-close]');
  const overlay = shelf.querySelector('[data-book-read]');
  const instructions = document.getElementById('bookshelf-instructions');
  const titleLabel = shelf.querySelector('[data-shelf-title]');
  const metaLabel = shelf.querySelector('[data-shelf-meta]');
  const count = shelf.querySelector('[data-shelf-count]');
  const readLink = shelf.querySelector('[data-shelf-link]');
  const hash = text => { let n = 2166136261; for (const char of text) n = Math.imul(n ^ char.charCodeAt(0), 16777619); return n >>> 0; };
  const seeded = seed => () => { seed += 0x6d2b79f5; let n = seed; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
  const ease = t => 1 - (1 - t) ** 3;
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
  const nodes = items.map(el => ({
    el, button: el.querySelector('button'), object: el.querySelector('.shelf-book__object'),
    id: el.dataset.bookId, kind: el.dataset.bookKind,
    title: el.querySelector('.shelf-book__cover-title').textContent,
    label: el.querySelector('.shelf-book__category').textContent,
    publisher: el.dataset.publisher || '', year: el.dataset.year || '',
    x: 0, width: 54, height: 350, depth: 260,
    value: {x: 0, y: 0, z: 0, ry: 0, rx: 0, s: 1}, flight: null
  }));
  let visible = nodes.slice(), selected = null, hovered = null, current = 0;
  let camera = 0, cameraTarget = 0, maxHeight = 350, totalWidth = 0, frontDepth = 226;
  let inView = true, paused = false, frame = 0, lastTime = 0, selectedAt = 0;
  let gesture = null, suppressClick = false, resetClickTimer = 0;
  let orbit = { yaw: 0, pitch: 0 }, titleShown = '', initialLayout = true;
  const request = () => { if (!frame && inView && !document.hidden) frame = requestAnimationFrame(draw); };
  const bounds = () => {
    // Retain enough room for visible spines at both edges.
    const inset = Math.max(100, stage.clientWidth * .34);
    return totalWidth < stage.clientWidth * .65 ? [totalWidth / 2, totalWidth / 2] : [inset, totalWidth - inset];
  };
  const moveCamera = x => { const [a,b] = bounds(); cameraTarget = clamp(x, a, b); request(); };
  const label = node => {
    if (!node) return;
    const i = visible.indexOf(node);
    count.textContent = `${String(i + 1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;
    previous.disabled = i === 0; next.disabled = i === visible.length - 1;
    if (titleShown !== node.id || selected) {
      titleShown = node.id;
      titleLabel.textContent = node.title;
      metaLabel.textContent = [node.publisher, node.year, node.label].filter(Boolean).join(' · ');
    }
    let href = (window.PORTFOLIO_CONFIG?.writingLinks || {})[node.id] || '';
    try { if (href && !/^https?:$/.test(new URL(href,location.href).protocol)) href = ''; } catch (_) { href = ''; }
    readLink.hidden = !(selected && href);
    if (href) readLink.href = href;
    if (overlay) {
      overlay.hidden = !(selected && href);
      if (href) overlay.href = href;
      overlay.setAttribute('aria-label', `Read ${node.title} (opens in a new tab)`);
    }
    if (selected && !href) metaLabel.textContent = [node.publisher, node.year, 'Print publication'].filter(Boolean).join(' · ');
  };
  const flight = (node, duration, returning = false) => {
    node.el.classList.toggle('is-returning', returning);
    node.flight = { start: performance.now(), duration: motion.matches ? 0 : duration, from: {...node.value}, returning };
  };
  const select = node => {
    if (!node || node.el.hidden || suppressClick) return;
    if (selected === node) return;
    if (selected) { selected.el.classList.remove('is-selected'); selected.button.setAttribute('aria-expanded','false'); flight(selected,480,true); }
    selected = node; hovered = null; current = visible.indexOf(node); selectedAt = performance.now(); orbit = {yaw:0,pitch:0};
    node.el.classList.add('is-selected'); node.button.setAttribute('aria-expanded','true');
    nodes.forEach(n => n.button.tabIndex = n === node ? 0 : -1);
    flight(node,520); moveCamera(node.x);
    back.hidden = false;
    shelf.classList.add('has-selection');
    shelf.dataset.coverHover = 'false';
    instructions.textContent = 'Drag the cover to rotate. Escape returns it to the shelf.';
    stage.setAttribute('aria-label', `${node.title}. Cover preview. Drag to rotate; Escape to close.`);
    label(node); stage.focus({preventScroll:true}); request();
  };
  const close = (restore = true) => {
    const old = selected;
    selected = null; hovered = null; orbit = {yaw:0,pitch:0};
    if (old) { old.el.classList.remove('is-selected'); old.button.setAttribute('aria-expanded','false'); flight(old,480,true); }
    nodes.forEach(n => n.button.tabIndex = n.el.hidden ? -1 : 0);
    back.hidden = true; readLink.hidden = true;
    if (overlay) overlay.hidden = true;
    shelf.classList.remove('has-selection'); shelf.dataset.coverHover='false';
    instructions.textContent = 'Select a spine to explore.';
    stage.setAttribute('aria-label', `Publication bookshelf, ${visible.length} titles. Left and right arrows browse; Enter previews a cover.`);
    if (restore && old) old.button.focus({preventScroll:true});
    titleShown = ''; label(visible[current]); request();
  };
  function layout() {
    const small = stage.clientWidth <= 620;
    let cursor = 0;
    maxHeight = 0;
    visible.forEach(n => {
      const random = seeded(hash(n.id));
      n.width = Math.round((small ? 42 : 46) + random() * 16);
      n.height = Math.round(356 + random() * 14);
      n.x = cursor + n.width/2; cursor += n.width + 8;
      maxHeight = Math.max(maxHeight,n.height);
      n.el.style.setProperty('--book-width',`${n.width}px`);
      n.el.style.setProperty('--book-height',`${n.height}px`);
      const measure = document.createElement('canvas').getContext('2d');
      measure.font = `600 19px ${getComputedStyle(document.body).getPropertyValue('--font-display') || 'Arial'}`;
      n.el.querySelector('.shelf-book__spine-title').style.fontSize = `${Math.max(14, Math.min(19, 19 * (n.height - 100) / measure.measureText(n.el.querySelector('.shelf-book__spine-title').textContent).width))}px`;
      n.depth = small ? Math.min(248,stage.clientWidth * .72) : 260;
      n.el.style.setProperty('--book-depth',`${n.depth}px`);
    });
    // Clear every resting spine in the shared preserve-3d scene.
    // Raising z-index alone cannot change geometry in a 3D rendering context.
    frontDepth = Math.max(...visible.map(n => n.depth), 0) / 2 + 96;
    totalWidth = Math.max(1,cursor-8);
    shelf.style.setProperty('--max-book-height',`${maxHeight}px`);
    visible.forEach(n => n.el.style.top = `${120 + maxHeight - n.height}px`);
    current = clamp(current,0,visible.length-1);
    const [a,b] = bounds();
    cameraTarget = clamp(selected ? selected.x : initialLayout ? totalWidth/2 : cameraTarget,a,b);
    camera = cameraTarget;
    visible.forEach(n => { if (!selected || n !== selected) n.value = {x:n.x-camera-n.width/2,y:0,z:0,ry:0,rx:0,s:1}; });
    initialLayout = false; request();
  }
  function draw(time) {
    frame = 0;
    if (!inView || document.hidden) return;
    const dt = Math.min(.05,(time-(lastTime||time-16))/1000); lastTime=time;
    camera = motion.matches ? cameraTarget : damp(camera,cameraTarget,9,dt);
    let moving = Math.abs(camera-cameraTarget) > .02;
    visible.forEach(n => {
      const focus = selected === n;
      const hover = !selected && hovered === n;
      const elapsed = (time-selectedAt)/1000;
      const sway = false; // No perpetual motion; selection and drag are deliberate.
      const target = {
        x: focus ? -n.width/2 : n.x-camera-n.width/2,
        y: focus ? -18 : hover ? -12 : 0,
        z: focus ? frontDepth : hover ? 12 : 0,
        s: focus ? .94 : 1,
        ry: focus ? -90 + orbit.yaw + (sway ? Math.sin(elapsed*.85)*8 : 0) : 0,
        rx: focus ? orbit.pitch + (sway ? Math.sin(elapsed*.55)*1.8 : 0) : 0
      };
      if (n.flight) {
        const p = n.flight.duration ? clamp((time-n.flight.start)/n.flight.duration) : 1;
        for (const key of Object.keys(target)) {
          const rotation = key === 'ry' || key === 'rx';
          // Rotate a returning cover first, then slide it into its shelf slot.
          // This prevents it sinking through neighbouring spines during close.
          const progress = n.flight.returning
            ? rotation || key === 's' ? easeInOut(clamp(p / .68)) : ease(clamp((p - .56) / .44))
            : rotation ? easeInOut(p) : ease(p);
          n.value[key] = lerp(n.flight.from[key], target[key], progress);
        }
        if (p === 1) { n.flight = null; n.el.classList.remove('is-returning'); }
        else moving = true;
      } else {
        for (const key of Object.keys(target)) {
          n.value[key] = motion.matches ? target[key] : damp(n.value[key],target[key],focus?10:13,dt);
          if (Math.abs(n.value[key]-target[key])>.015) moving = true; else n.value[key]=target[key];
        }
      }
      n.el.style.transform = `translate3d(${n.value.x.toFixed(3)}px,${n.value.y.toFixed(3)}px,${n.value.z.toFixed(3)}px)`;
      n.el.style.zIndex = focus ? '30' : n.flight?.returning ? '29' : hover ? '20' : String(visible.indexOf(n)+2);
      n.object.style.transform = `rotateX(${n.value.rx.toFixed(3)}deg) rotateY(${n.value.ry.toFixed(3)}deg) scale(${n.value.s.toFixed(4)})`;
      if (sway) moving = true;
    });
    if (selected && overlay && !overlay.hidden) {
      const r = selected.el.querySelector('.shelf-book__cover').getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      const width = Math.min(164, r.width - 30);
      overlay.style.width = `${width}px`;
      overlay.style.left = `${Math.max(12,Math.min(stage.clientWidth-width-12,r.left-s.left+(r.width-width)/2))}px`;
      overlay.style.top = `${Math.min(stage.clientHeight-56,r.bottom-s.top-63)}px`;
    }
    if (moving) request();
  }
  nodes.forEach(n => {
    n.button.addEventListener('click', () => select(n));
    n.el.addEventListener('pointerenter',e => { if (e.pointerType==='mouse' && !selected && !gesture) { hovered=n; current=visible.indexOf(n);label(n);request(); } });
    n.el.addEventListener('pointerleave',e => {
      if (hovered !== n || selected) return;
      const r=n.el.querySelector('.shelf-book__spine').getBoundingClientRect();
      if(e.clientX<r.left-12||e.clientX>r.right+12||e.clientY<r.top-24||e.clientY>r.bottom+40){hovered=null;request();}
    });
    n.button.addEventListener('focus',() => { if (!selected) { current=visible.indexOf(n); hovered=n; moveCamera(n.x); label(n); } });
    n.button.addEventListener('blur',() => { if (!selected) { hovered=null; request(); } });
  });
  const browse = direction => {
    const i=clamp(current+direction,0,visible.length-1); current=i;
    if (selected) select(visible[i]);
    else { hovered=visible[i]; moveCamera(visible[i].x); label(visible[i]); }
  };
  previous.addEventListener('click',() => browse(-1)); next.addEventListener('click',() => browse(1));
  back.addEventListener('click',() => close());
  overlay?.addEventListener('click', e => e.stopPropagation());
  readLink.addEventListener('click', e => e.stopPropagation());
  stage.addEventListener('pointermove', e => {
    if (!selected) return;
    const r=selected.el.querySelector('.shelf-book__cover').getBoundingClientRect();
    const inside=e.clientX>=r.left-8&&e.clientX<=r.right+8&&e.clientY>=r.top-8&&e.clientY<=r.bottom+8;
    shelf.dataset.coverHover=String(inside||Boolean(e.target.closest('[data-book-read]')));
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{shelf.dataset.coverHover='false';});
  stage.addEventListener('focusin',e=>{
    if(selected&&(e.target.matches(':focus-visible')||e.target===overlay)) shelf.dataset.coverHover='true';
  });
  shelf.addEventListener('keydown',e => {
    if (e.key==='Escape' && selected) { e.preventDefault(); close(); }
    else if ((e.key==='ArrowRight'||e.key==='ArrowLeft') && !e.target.closest('a')) { e.preventDefault();browse(e.key==='ArrowRight'?1:-1); }
    else if ((e.key==='Enter'||e.key===' ') && e.target === stage) {e.preventDefault();select(visible[current]);}
    else if (e.target===stage && (e.key==='Home'||e.key==='End')) {e.preventDefault();current=e.key==='Home'?0:visible.length-1;moveCamera(visible[current].x);label(visible[current]);}
  });
  stage.addEventListener('pointerdown',e => {
    if (e.button!==0 || e.target.closest('a')) return;
    gesture={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,mode:'pending'};
  });
  stage.addEventListener('pointerleave',()=>{if(!gesture){hovered=null;request();}});
  stage.addEventListener('pointermove',e => {
    if(!gesture && hovered && !selected){
      const r=hovered.el.querySelector('.shelf-book__spine').getBoundingClientRect();
      if(e.clientX<r.left-12||e.clientX>r.right+12||e.clientY<r.top-24||e.clientY>r.bottom+40){hovered=null;request();}
    }
    if (!gesture || e.pointerId!==gesture.id) return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    const totalX=e.clientX-gesture.startX,totalY=e.clientY-gesture.startY;
    if (gesture.mode==='pending' && Math.hypot(totalX,totalY)>8) {
      if (!selected && Math.abs(totalY)>Math.abs(totalX)) {gesture=null;return;}
      gesture.mode=selected?'orbit':'pan';suppressClick=true;
      stage.setPointerCapture(e.pointerId);hovered=null;
    }
    if (gesture.mode==='orbit') {orbit.yaw=clamp(orbit.yaw+dx*.24,-22,22);orbit.pitch=clamp(orbit.pitch+dy*.18,-10,10);request();}
    else if (gesture.mode==='pan') {
      moveCamera(cameraTarget-dx*.85);
      current=visible.reduce((a,n,i)=>Math.abs(n.x-cameraTarget)<Math.abs(visible[a].x-cameraTarget)?i:a,0); label(visible[current]);
    }
    gesture.x=e.clientX;gesture.y=e.clientY;
  });
  const release=e => {
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    gesture=null;clearTimeout(resetClickTimer);resetClickTimer=setTimeout(()=>suppressClick=false,80);request();
  };
  stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
  stage.addEventListener('click',e => { if (!suppressClick && selected && !e.target.closest('.shelf-book, [data-book-read]')) close(); });
  stage.addEventListener('wheel',e => {
    if (selected || Math.abs(e.deltaX)<=Math.abs(e.deltaY) && !e.shiftKey) return;
    const [a,b]=bounds();if (a===b) return;
    const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    const nextCamera=clamp(cameraTarget+delta*.6,a,b);
    if (nextCamera!==cameraTarget) {e.preventDefault();moveCamera(nextCamera);}
  },{passive:false});
  filters.forEach(button=>button.addEventListener('click',()=>{
    close(false);
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const kind=button.dataset.booksFilter;
    nodes.forEach(n=>{n.el.hidden=kind!=='all'&&n.kind!==kind;n.button.tabIndex=n.el.hidden?-1:0;});
    visible=nodes.filter(n=>!n.el.hidden);current=0;hovered=null;initialLayout=true;
    layout();titleShown='';label(visible[0]);
    instructions.textContent=`${visible.length} ${visible.length===1?'title':'titles'}. Select a spine to explore.`;
  }));
  motion.addEventListener('change',()=>{nodes.forEach(n=>{n.flight=null;n.el.classList.remove('is-returning');});request();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{lastTime=0;request();}});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;
    if(!inView){cancelAnimationFrame(frame);frame=0;}else{lastTime=0;request();}
  },{rootMargin:'100px'}).observe(stage);
  shelf.classList.add('is-enhanced');
  shelf.querySelector('.bookshelf__topline').hidden=false;
  shelf.querySelector('.bookshelf__bottom').hidden=false;
  nodes.forEach(n=>n.button.disabled=false);
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(stage);
  else window.addEventListener('resize',layout);
  document.fonts?.ready.then(layout);
  layout();label(visible[0]);
})();


