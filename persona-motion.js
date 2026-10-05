/* v105 - Persona motion lifecycle.
 * Artwork and timing: only the three original upper-row SVGs from Personas.
 * Never imports or generates the lower duotone iteration.
 * Works on file:// as well as a static host; no fetch, iframe, or dependency.
 */
(() => {
  'use strict';
  const figures = Array.from(document.querySelectorAll('[data-persona-motion]'));
  if (!figures.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const items = [];
  const onScreen = element => {
    const r = element.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  };

  function update(item) {
    const isStatic = reduced.matches;
    const playing = !isStatic && !item.userPaused && item.inView && !document.hidden;
    item.figure.toggleAttribute('data-motion-reduced', isStatic);
    item.figure.dataset.motionState = isStatic ? 'static' : playing ? 'playing' : 'paused';
    if (item.hasSMIL) {
      // SVG animation timelines are separate from CSS. Pause both together.
      try {
        if (playing) item.svg.unpauseAnimations();
        else item.svg.pauseAnimations();
      } catch (_) { /* Unsupported SVG controls never block the page. */ }
    }
    if (item.button) {
      item.button.hidden = isStatic;
      item.button.textContent = item.userPaused ? 'Play motion' : 'Pause motion';
      item.button.setAttribute('aria-pressed', String(item.userPaused));
      item.button.setAttribute('aria-label', (item.userPaused ? 'Play' : 'Pause') + ' animation for ' + item.name);
    }
  }

  figures.forEach(figure => {
    const svg = figure.querySelector('.persona-motion__art');
    if (!svg) return;
    const button = figure.querySelector('[data-persona-toggle]');
    const motions = Array.from(svg.querySelectorAll('animateMotion'));
    const item = {
      figure, svg, button,
      name: svg.querySelector('title')?.textContent || 'this persona',
      userPaused: false,
      inView: onScreen(figure),
      hasSMIL: motions.length > 0 && typeof svg.pauseAnimations === 'function'
    };
    if (item.hasSMIL) {
      try {
        svg.pauseAnimations();
        // Keep the original declarative begin values, including the -3s
        // stagger. Dynamic beginElementAt(-3) is unreliable in Chromium.
        svg.setCurrentTime(0);
      } catch (_) { /* The static drawing remains available on older engines. */ }
    }
    figure.setAttribute('data-motion-ready', '');
    update(item);
    button?.addEventListener('click', () => {
      item.userPaused = !item.userPaused;
      update(item);
    });
    items.push(item);
  });

  if ('IntersectionObserver' in window) {
    const byElement = new Map(items.map(item => [item.figure, item]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = byElement.get(entry.target);
        if (!item) return;
        item.inView = entry.isIntersecting;
        update(item);
      });
    }, { threshold: 0 });
    items.forEach(item => observer.observe(item.figure));
  } else {
    // Only measure after scroll/resize; never run an idle frame loop.
    let pending = false;
    const measure = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        items.forEach(item => { item.inView = onScreen(item.figure); update(item); });
      });
    };
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
  }
  const updateAll = () => items.forEach(update);
  document.addEventListener('visibilitychange', updateAll);
  if (typeof reduced.addEventListener === 'function') reduced.addEventListener('change', updateAll);
  else reduced.addListener(updateAll);
  // Stop while held in the back/forward cache, then restore the intended state.
  window.addEventListener('pagehide', () => items.forEach(item => {
    item.figure.dataset.motionState = 'paused';
    if (item.hasSMIL) { try { item.svg.pauseAnimations(); } catch (_) {} }
  }));
  window.addEventListener('pageshow', () => items.forEach(item => {
    item.inView = onScreen(item.figure);
    update(item);
  }));
})();
