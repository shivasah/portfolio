/* v107 - scoped Management Reports interactions. No global wheel/scroll lock. */
(() => {
  'use strict';
  if (!document.body.classList.contains('page-case-reports')) return;

  // Same learning-note behavior as Agent Management: hover/focus to preview,
  // click/tap to pin, Escape or an outside press to dismiss. Icons never swap.
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const noteStates = [];
  document.querySelectorAll('#learning [data-learning-note]').forEach(button => {
    let pinned = false, pointerInside = false, keyboardFocus = false;
    const setOpen = open => {
      button.dataset.open = String(open);
      button.setAttribute('aria-expanded', String(open));
    };
    const close = () => { pinned = false; setOpen(false); };
    button.classList.add('is-enhanced');
    setOpen(false);
    button.addEventListener('pointerenter', event => {
      if (!hoverCapable.matches || event.pointerType === 'touch') return;
      pointerInside = true; setOpen(true);
    });
    button.addEventListener('pointerleave', () => {
      pointerInside = false;
      if (!pinned && !keyboardFocus) setOpen(false);
    });
    button.addEventListener('focus', () => {
      keyboardFocus = button.matches(':focus-visible');
      if (keyboardFocus) setOpen(true);
    });
    button.addEventListener('blur', () => {
      keyboardFocus = false;
      if (!pinned && !pointerInside) setOpen(false);
    });
    button.addEventListener('click', () => { pinned = !pinned; setOpen(pinned); });
    button.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    });
    noteStates.push({ button, close });
  });
  document.addEventListener('pointerdown', event => {
    noteStates.forEach(({ button, close }) => { if (!button.contains(event.target)) close(); });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') noteStates.forEach(({ close }) => close());
  });

  const section = document.querySelector('#background.mr-health-story');
  const frame = document.getElementById('healthMetaphorFrame');
  const visual = section && section.querySelector('.mr-health-story__visual');
  const steps = section ? [...section.querySelectorAll('[data-health-target]')] : [];
  if (!section || !frame || !visual || !steps.length) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = steps.map(step => Number(step.dataset.healthTarget));
  let ready = false, active = -1, raf = 0, lastVisible = null;
  const post = message => {
    if (ready && frame.contentWindow) frame.contentWindow.postMessage(message, '*');
  };
  const select = (index, animate) => {
    index = Math.max(0, Math.min(targets.length - 1, index));
    if (index === active && animate) return;
    active = index;
    section.dataset.healthChapter = String(index);
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    post({ type: animate && !motion.matches ? 'health-metaphor-go' : 'health-metaphor-set',
      target: targets[index], duration: 4600 });
  };
  const sync = (force = false) => {
    raf = 0;
    const rect = section.getBoundingClientRect();
    // Use the actual sticky box, not fluctuating mobile browser chrome height.
    const vh = Math.max(1, visual.clientHeight || window.innerHeight);
    const visible = rect.top < window.innerHeight && rect.bottom > 0 && !document.hidden;
    if (visible !== lastVisible || force) {
      lastVisible = visible;
      post({ type: 'health-metaphor-visible', visible });
    }
    if (motion.matches) { select(targets.length - 1, false); return; }
    if (!visible && !force) return;
    const local = Math.max(0, -rect.top);
    const index = Math.min(targets.length - 1, Math.floor((local + vh * 0.12) / (vh * 1.5)));
    select(index, !force);
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(() => sync(false)); };
  const onReady = () => {
    ready = true;
    sync(true);
  };
  frame.addEventListener('load', onReady);
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow) return;
    if (event.data && event.data.type === 'health-metaphor-ready') onReady();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', () => sync(true));
  document.addEventListener('visibilitychange', () => sync(true));
  motion.addEventListener('change', () => sync(true));
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(visual);
  select(0, false);
  sync(true);
  // Also handles a cached iframe that finished before this script was parsed.
  if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'health-metaphor-ping' }, '*');
})();
