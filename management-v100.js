(() => {
  'use strict';

  const section = document.querySelector('#background.mr-health-story');
  const frame = document.getElementById('healthMetaphorFrame');
  const steps = section ? [...section.querySelectorAll('.mr-health-chapter[data-health-target]')] : [];
  if (!section || !frame || steps.length === 0) return;

  const targets = steps.map((step) => Number(step.dataset.healthTarget) || 0);
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ready = false;
  let active = -1;
  let queued = 0;
  let raf = 0;

  const post = (type, target, duration) => {
    const message = { type, target, duration };
    if (ready && frame.contentWindow) frame.contentWindow.postMessage(message, '*');
    else queued = target;
  };

  const setActive = (index, animate = true) => {
    index = Math.max(0, Math.min(targets.length - 1, index));
    if (index === active && animate) return;
    active = index;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    post(animate && !reduced ? 'health-metaphor-go' : 'health-metaphor-set', targets[index], animate ? 1100 : 0);
    section.dataset.healthChapter = String(index);
  };

  const sync = (force = false) => {
    raf = 0;
    const rect = section.getBoundingClientRect();
    const vh = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);

    // Do not start the player until the full-screen section is approaching.
    if (!force && rect.top > vh * 0.82) return;
    if (!force && rect.bottom < 0) return;

    // The first viewport is the title state. Each following viewport advances
    // exactly one chapter, so the motion plays to a stop and waits there.
    const local = Math.max(0, -rect.top);
    const index = Math.floor((local + vh * 0.12) / vh);
    setActive(index, !force);
  };

  const requestSync = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => sync(false));
  };

  frame.addEventListener('load', () => {
    ready = true;
    const target = active >= 0 ? targets[active] : queued;
    post('health-metaphor-set', target || targets[0], 0);
  });

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(() => sync(true)), { passive: true });
  window.addEventListener('pageshow', () => requestAnimationFrame(() => sync(true)), { passive: true });

  setActive(0, false);
  sync(true);
})();
