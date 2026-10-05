/* v106 - Uploaded vector install-flow animation, driven by this case-study's
 * sticky scroll section. No demo autoplay, second scroll root or embedded fonts.
 */
(() => {
  'use strict';
  const flow = document.querySelector('[data-install-flow]');
  if (!flow) return;
  const stage = flow.querySelector('[data-install-stage]');
  const template = document.getElementById('agent-install-artwork');
  const sticky = flow.querySelector('.agent-install-flow__sticky');
  const visual = flow.querySelector('.agent-install-flow__visual');
  const descriptions = [...flow.querySelectorAll('.agent-install-step')];
  const marks = [...flow.querySelectorAll('.agent-install-flow__rail i')];
  const prevButton = flow.querySelector('[data-install-prev]');
  const nextButton = flow.querySelector('[data-install-next]');
  const counter = flow.querySelector('[data-install-position]');
  if (!stage || !template || !sticky || !visual || descriptions.length !== 8) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, a=0, b=1) => Math.max(a, Math.min(b, n));
  const ratio = 1457 / 955;
  const OX = 171, OY = 104;              // source → window coords
  const P = (x, y) => [x - OX, y - OY];
  const SM = P(473, 392), INST = P(1240, 393.5), JAVA = P(515, 446.5), NEXT = P(1505, 929.5),
        DROP = P(659, 531), INOW = P(1482, 929.5), OV = P(262, 265), REST = P(1250, 820);
  const row = (i, sel) => P(419.5, (sel ? 506 : 461) + i * 27.9);

  // ---- timeline builder ----
  const states = [], cur = [], clicks = [], caps = [];
  let t = 0, pos = P(900, 700), prog = null;
  cur.push([0, ...pos]);
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const S = (k, fade = 0) => states.push({ t, k, fade });
  const wait = d => { cur.push([t, ...pos]); t += d; cur.push([t, ...pos]); };
  const move = (to, d, hover) => { cur.push([t, ...pos]); if (hover) states.push({ t: t + d * 0.82, k: hover, fade: 0.08 }); t += d; pos = to; cur.push([t, ...pos]); };
  const click = () => { clicks.push(t); wait(0.16); };
  const cap = (i) => caps.push([t, i]);

  S('home'); cap(0); wait(0.5);
  move(SM, 1.0, 'home_h'); wait(0.2); click(); S('am', 0.45);
  wait(0.45); cap(1);
  move(row(0), 0.9, 'am_h0'); wait(0.15); click(); S('am_s0'); wait(0.3);
  move(row(3, 1), 0.7, 'am_s0_h3'); wait(0.15); click(); S('am_s03');
  move(row(6, 1), 0.6, 'am_s03_h6'); wait(0.15); click(); S('am_s036');
  wait(1.1);
  click(); S('am_s03_h6'); wait(0.35);
  move(row(3, 1), 0.55, 'am_s03'); wait(0.12); click(); S('am_s0_h3'); wait(0.3);
  move(row(0, 1), 0.55, 'am_s0_h0'); wait(0.12); click(); S('am_h2'); wait(0.45);
  cap(2); move(INST, 1.0, 'am_inst'); wait(0.2); click(); S('s1', 0.45);
  wait(0.35); cap(3);
  move(JAVA, 0.9, 's1_hj'); wait(0.15); click(); S('s1_j'); wait(0.45);
  move(NEXT, 1.0, 's1_jn'); wait(0.15); click(); S('s2', 0.45);
  wait(0.5); cap(4);
  move(DROP, 0.9, 's2_hd'); wait(0.2); click(); S('s2_up', 0.2); wait(0.9);
  S('s2_ok', 0.45); wait(1.3);
  move(NEXT, 0.9, 's2_okn'); wait(0.15); click(); S('s3', 0.45);
  wait(0.4); cap(5);
  move(INOW, 0.8, 's3_h'); wait(0.15); click(); S('prog', 0.3);
  cap(6); prog = [t + 0.1, 1.2];
  move(REST, 0.6); wait(0.72); S('done', 0); wait(0.45);
  wait(0.5); cap(7); S('dash', 0.55); move(P(1180, 760), 1.4); wait(1.6);
  const TOTAL = t;
  states.sort((a, b) => a.t - b.t);

  // Match the eight original narratives to the original animation's real
  // transitions, not equal-duration video slices that change text too early.
  const at = k => states.find(s => s.k === k).t;
  const bounds = [0, at('am') + 0.45, at('am_s0'), at('s1') + 0.45,
    at('s2') + 0.45, at('s3') + 0.45, at('prog'), at('dash'), TOTAL];
  const stills = ['home','am','am_s036','s1_j','s2_ok','s3','done','dash'];
  const labels = ['Application monitoring home','Agent Management inventory',
    'Agents selected for a bulk action','Java agent selected','Hosts uploaded and mapped',
    'Shared agent attributes','Installation completed','Application dashboard'];
  let layers = {}, cursor, inner, rip, ripF, progG, progFill, progText;
  let shown = new Set(), ready = false, raf = 0, last = 0, inView = false;
  let wanted = 0, displayed = 0, current = -1;

  function cursorAt(time) {
    for (let i = 0; i < cur.length - 1; i++) {
      const a = cur[i], b = cur[i + 1];
      if (time >= a[0] && time <= b[0]) {
        const u = b[0] === a[0] ? 1 : ease((time - a[0]) / (b[0] - a[0]));
        return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
      }
    }
    const l = cur[cur.length - 1]; return [l[1], l[2]];
  }

  function render(time) {
    // layers
    let idx = 0;
    for (let i = 0; i < states.length; i++) if (states[i].t <= time) idx = i;
    const st = states[idx], prev = states[idx - 1];
    const vis = new Map();
    const f = st.fade > 0 ? Math.min(1, (time - st.t) / st.fade) : 1;
    if (prev && f < 1) vis.set(prev.k, 1);
    vis.set(st.k, f);
    for (const k of shown) if (!vis.has(k)) { layers[k].style.opacity = 0; layers[k].style.visibility = 'hidden'; layers[k].style.zIndex = 0; }
    for (const [k, o] of vis) { const L = layers[k]; L.style.visibility = 'visible'; L.style.opacity = o; L.style.zIndex = k === st.k ? 2 : 1; }
    shown = new Set(vis.keys());
    // progress overlay
    if (st.k === 'prog') {
      progG.style.display = '';
      const v = Math.max(0, Math.min(1, (time - prog[0]) / prog[1]));
      const e = 1 - Math.pow(1 - v, 1.6);
      progFill.setAttribute('width', (528 * e).toFixed(1));
      progText.textContent = `${Math.round(139 * e)} of 139 agents installed`;
      progFill.setAttribute('fill', v >= 1 ? '#2E9E4F' : '#2F7CDB');
      progG.style.opacity = f;
    } else progG.style.display = 'none';
    // cursor + click feedback
    const [x, y] = cursorAt(time);
    let sc = 1, rr = 0, ro = 0;
    for (const c of clicks) {
      const d = time - c;
      if (d >= 0 && d < 0.18) sc = 1 - 0.18 * Math.sin(d / 0.18 * Math.PI);
      if (d >= 0 && d < 0.55) { const u = d / 0.55; rr = 4 + 20 * (1 - Math.pow(1 - u, 3)); ro = 0.75 * (1 - u); }
    }
    cursor.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(1.15)`);
    inner.setAttribute('transform', `scale(${sc.toFixed(3)})`);
    for (const [el, o] of [[rip, ro], [ripF, ro * 0.22]]) { el.setAttribute('cx', x); el.setAttribute('cy', y); el.setAttribute('r', rr.toFixed(2)); el.setAttribute('opacity', o.toFixed(3)); }
    stage.dataset.state = st.k;
    stage.dataset.time = time.toFixed(3);
  }
  function setStep(index) {
    if (index === current) return;
    current = index;
    descriptions.forEach((el,i) => {
      el.classList.toggle('is-active', i === index);
      el.setAttribute('aria-hidden', String(i !== index));
    });
    stage.setAttribute('aria-label', labels[index]);
    counter.textContent = `${index + 1} of ${descriptions.length}`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === descriptions.length - 1;
    flow.dataset.installStep = String(index);
  }

  function paint(progress) {
    const scaled = clamp(progress) * descriptions.length;
    const index = Math.min(descriptions.length - 1, Math.floor(scaled));
    const sub = index === descriptions.length - 1 && progress >= 1 ? 1 : scaled - index;
    const time = bounds[index] + (bounds[index+1] - bounds[index]) * sub;
    if (reduce.matches) {
      // Readable resting states only: no cursor movement, crossfades or scrubbing.
      for (const key of shown) {
        layers[key].style.opacity = '0'; layers[key].style.visibility = 'hidden';
      }
      const layer = layers[stills[index]];
      layer.style.opacity = '1'; layer.style.visibility = 'visible'; layer.style.zIndex = '2';
      shown = new Set([stills[index]]);
      progG.style.display = 'none';
      stage.dataset.state = stills[index];
      stage.dataset.time = time.toFixed(3);
    } else render(time);
    setStep(index);
    marks.forEach((mark,i) => mark.style.setProperty('--progress', clamp(scaled-i).toFixed(3)));
    flow.dataset.installProgress = progress.toFixed(4);
  }

  function fit() {
    const r = visual.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const width = Math.max(1, Math.floor(Math.min(r.width, r.height * ratio)));
    const height = width / ratio;
    stage.style.setProperty('--install-width', `${width}px`);
    stage.style.setProperty('--install-height', `${height.toFixed(2)}px`);
  }

  function mount() {
    if (ready) return;
    stage.appendChild(template.content.cloneNode(true));
    stage.querySelectorAll('.agent-install-layer').forEach(el => { layers[el.dataset.k] = el; });
    const get = id => stage.querySelector(`#aif-${id}`);
    cursor = get('cursor'); inner = get('cursorInner');
    rip = get('ripple'); ripF = get('rippleFill');
    progG = get('prog'); progFill = get('progFill'); progText = get('progText');
    if (!cursor || !inner || !rip || !ripF || !progG || !progFill || !progText ||
        states.some(s => !layers[s.k])) {
      // A valid static source frame stays on-screen if an asset is incomplete.
      flow.dataset.installError = 'Missing animation layer';
      return;
    }
    ready = true;
    flow.setAttribute('data-install-ready','');
    paint(wanted);
    displayed = wanted;
    fit();
  }

  function measure() {
    const r = flow.getBoundingClientRect();
    inView = r.bottom > 0 && r.top < window.innerHeight;
    if (!reduce.matches) {
      const range = Math.max(1, r.height - sticky.getBoundingClientRect().height);
      wanted = clamp(-r.top / range);
    }
    if (!ready && r.top < window.innerHeight + 1200 && r.bottom > -1200) mount();
  }

  function frame(ts) {
    raf = 0;
    if (!ready || !inView || document.hidden || document.body.classList.contains('menu-open')) {
      last = 0; return;
    }
    const dt = last ? Math.min(.06, (ts-last)/1000) : 1/60;
    last = ts;
    displayed = reduce.matches ? wanted : displayed + (wanted-displayed)*(1-Math.exp(-dt*18));
    if (Math.abs(wanted-displayed) < .00005) displayed = wanted;
    paint(displayed);
    if (Math.abs(wanted-displayed) > .00005) raf = requestAnimationFrame(frame);
    else last = 0;
  }

  function request() {
    measure();
    if (ready && inView && !raf) raf = requestAnimationFrame(frame);
  }
  function resize() { fit(); request(); }

  function choose(index) {
    index = clamp(index, 0, descriptions.length-1);
    mount();
    if (!ready) return;
    wanted = (index + .45) / descriptions.length;
    if (!reduce.matches) {
      const r = flow.getBoundingClientRect();
      const range = Math.max(1, r.height-sticky.getBoundingClientRect().height);
      window.scrollTo({top:window.scrollY+r.top+range*wanted, behavior:'instant'});
    }
    displayed = wanted; paint(displayed); last = 0;
  }
  prevButton.addEventListener('click', () => choose(current-1));
  nextButton.addEventListener('click', () => choose(current+1));
  flow.querySelector('.agent-install-flow__controls').addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (delta || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      choose(e.key === 'Home' ? 0 : e.key === 'End' ? 7 : current+delta);
    }
  });
  let swipe = null;
  visual.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') swipe = {id:e.pointerId, x:e.clientX, y:e.clientY};
  }, {passive:true});
  visual.addEventListener('pointerup', e => {
    if (!swipe || swipe.id !== e.pointerId) return;
    const dx=e.clientX-swipe.x, dy=e.clientY-swipe.y; swipe=null;
    if (Math.abs(dx)>44 && Math.abs(dx)>Math.abs(dy)*1.5) choose(current+(dx<0?1:-1));
  }, {passive:true});
  visual.addEventListener('pointercancel', () => {swipe=null;}, {passive:true});

  window.addEventListener('scroll', request, {passive:true});
  window.addEventListener('resize', resize, {passive:true});
  window.visualViewport?.addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', () => {last=0; request();});
  window.addEventListener('pagehide', () => {cancelAnimationFrame(raf);raf=0;last=0;});
  window.addEventListener('pageshow', resize);
  reduce.addEventListener('change', () => {if (ready) paint(wanted); resize();});
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visual);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e=>e.isIntersecting)) {mount();request();observer.disconnect();}
    }, {rootMargin:'1200px 0px'});
    observer.observe(flow);
  }
  new MutationObserver(request).observe(document.body, {attributes:true,attributeFilter:['class']});
  document.fonts?.ready.then(resize);
  // Read-only timing information helps verify every source state after changes.
  Object.defineProperty(flow, 'installTimeline', {value:Object.freeze({
    duration:TOTAL,bounds:Object.freeze(bounds),states:Object.freeze(states.map(s=>Object.freeze({...s})))
  })});
  setStep(0); resize();
})();
