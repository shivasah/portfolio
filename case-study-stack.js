/* v56: lift-and-stack motion matched to the supplied September 24 recording.
 * The existing static-site component is retained; see COMPONENTS-V56.md.
 * Each face lifts, tilts toward the viewer, and stays in the upper pile.
 * All transforms derive from one reversible, native-scroll progress value.
 */
(() => {
  'use strict';
  const stack = document.querySelector('[data-flip-stack]');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('[data-flip-card]')];
  const pin = stack.querySelector('.flip-stack__pin');
  const deck = stack.querySelector('.flip-stack__cards');
  if (!cards.length || !pin || !deck) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
  const HOLD = 0.16;
  const ANGLE = 50;
  const OMEGA = 26;
  const SCALE_STEP = 0.018;
  let enabled = false, raf = 0, measureRaf = 0, last = 0;
  let value = 0, velocity = 0;
  let height = 488, perspective = height * 3.4, lift = 500, gap = 12, upperGap = 26;
  stack.style.setProperty('--flip-count', cards.length);

  const range = () => Math.max(1, stack.offsetHeight - pin.offsetHeight);
  const target = () => clamp(-stack.getBoundingClientRect().top / range()) * cards.length;
  const render = () => {
    const head = Math.min(Math.floor(value), cards.length - 1);
    const moving = clamp((value - head - HOLD) / (1 - HOLD));
    const cursor = head + moving;

    cards.forEach((card, i) => {
      const travel = clamp((value - i - HOLD) / (1 - HOLD));
      const depth = Math.max(0, i - cursor);
      const y = travel > 0 ? (-lift + i * upperGap) * travel : depth * gap;
      const angle = ANGLE * travel;
      const scale = 1 - depth * SCALE_STEP;
      // Local perspective travels with the card, rather than vanishing around a
      // fixed top hinge. Positive X rotation widens the near (bottom) edge.
      card.style.transform = `translate3d(0,${y.toFixed(3)}px,0) perspective(${perspective.toFixed(2)}px) rotateX(${angle.toFixed(3)}deg) scale(${scale.toFixed(5)})`;
      card.style.zIndex = String(cards.length - i);
      card.style.setProperty('--fold-shade', (travel * 0.055).toFixed(4));
      card.dataset.stackState = travel >= 1 ? 'lifted' : travel > 0 ? 'lifting' : depth < 0.001 ? 'active' : 'waiting';
      // Do not remove, fade, re-layer or hide a completed card: those visible
      // upper layers are a defining part of the reference interaction.
    });
    stack.dataset.activeIndex = String(head);
    stack.dataset.stackProgress = value.toFixed(4);
  };

  const draw = now => {
    raf = 0;
    if (!enabled || document.hidden) return;
    const goal = target();
    const dt = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60;
    last = now;
    // Analytic critically damped spring, independent of display frame rate.
    const displacement = value - goal;
    const c = velocity + OMEGA * displacement;
    const decay = Math.exp(-OMEGA * dt);
    value = clamp(goal + (displacement + c * dt) * decay, 0, cards.length);
    velocity = (velocity - OMEGA * c * dt) * decay;
    if (Math.abs(goal - value) < 0.00005 && Math.abs(velocity) < 0.0001) {
      value = goal;
      velocity = 0;
    }
    render();
    if (value !== goal || velocity !== 0) raf = requestAnimationFrame(draw);
    else last = 0;
  };
  const request = () => {
    if (enabled && !raf && !document.hidden) raf = requestAnimationFrame(draw);
  };
  const settle = () => {
    if (!enabled) return;
    cancelAnimationFrame(raf);
    raf = 0; last = 0; velocity = 0; value = target(); render();
  };

  const measure = () => {
    measureRaf = 0;
    if (!enabled) return;
    // Natural content height is included so translated/custom fonts or zoom
    // cannot clip the links or KPIs inside a viewport-sized card.
    const natural = Math.max(...cards.map(card => {
      const copy = card.querySelector('.flip-card__copy');
      const link = card.querySelector('.flip-card__link');
      if (!copy || !link) return 0;
      const media = card.querySelector('.flip-card__media');
      const oneColumn = getComputedStyle(media).gridRowStart === '1' && getComputedStyle(copy).gridRowStart === '2';
      return copy.scrollHeight + (oneColumn ? media.offsetHeight : 0) + 2;
    }));
    const desired = parseFloat(getComputedStyle(stack).getPropertyValue('--flip-card-base-height')) || 488;
    const safeHeight = Math.max(desired, natural);
    stack.style.setProperty('--flip-card-height', `${Math.ceil(safeHeight)}px`);
    height = deck.offsetHeight;
    const viewport = pin.clientHeight;
    perspective = height * 3.4;
    gap = Math.max(8, height * (0.025 + SCALE_STEP / 2));
    upperGap = Math.max(16, height * 0.054);
    const radians = ANGLE * Math.PI / 180;
    const bottomProjection = (height / 2 * Math.cos(radians)) / (1 - height / 2 * Math.sin(radians) / perspective);
    // Park the first lifted card's bottom edge at about 20% of the viewport.
    // On compact/tall cards, move it farther up so it cannot conceal the next
    // card's title or controls. The upper pile remains partly visible.
    const restingTop = (viewport - height) / 2;
    const lastUpperEdge = Math.max(30, restingTop - 28);
    const upperEdge = Math.min(viewport * 0.20, lastUpperEdge - (cards.length - 2) * upperGap);
    lift = viewport / 2 + bottomProjection - upperEdge;
    settle();
  };
  const scheduleMeasure = () => {
    if (!measureRaf) measureRaf = requestAnimationFrame(measure);
  };
  const configure = () => {
    const wasEnabled = enabled;
    enabled = !reduced.matches && CSS.supports('position', 'sticky') && CSS.supports('transform', 'perspective(1000px) rotateX(1deg)');
    stack.classList.toggle('is-enhanced', enabled);
    if (enabled) {
      stack.style.removeProperty('--flip-card-height');
      measure();
    } else {
      cancelAnimationFrame(raf); cancelAnimationFrame(measureRaf);
      raf = 0; measureRaf = 0; last = 0; velocity = 0;
      stack.style.removeProperty('--flip-card-height');
      cards.forEach(card => {
        card.removeAttribute('style');
        delete card.dataset.stackState;
      });
      delete stack.dataset.activeIndex;
      delete stack.dataset.stackProgress;
    }
    if (wasEnabled !== enabled) window.dispatchEvent(new Event('scroll'));
  };

  // Keep every project in the normal reading/tab order. A keyboard-focused
  // project is brought to its flat, readable position without trapping scroll.
  stack.addEventListener('focusin', event => {
    if (!enabled || !(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
    const i = cards.indexOf(event.target.closest('[data-flip-card]'));
    if (i < 0) return;
    const r = cards[i].getBoundingClientRect();
    const stable = value >= i && value <= i + HOLD && r.top >= 0 && r.bottom <= innerHeight;
    if (stable) return;
    const top = stack.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + (i + HOLD / 2) / cards.length * range(), behavior: 'instant' });
    settle();
  });

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => {
    stack.style.removeProperty('--flip-card-height');
    scheduleMeasure();
  }, { passive: true });
  window.addEventListener('pageshow', scheduleMeasure);
  document.addEventListener('portfolio:ready', scheduleMeasure);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) settle(); });
  reduced.addEventListener('change', configure);
  if (document.fonts) document.fonts.ready.then(scheduleMeasure);
  if ('ResizeObserver' in window) {
    let previous = '';
    const observer = new ResizeObserver(() => {
      const signature = `${pin.clientWidth}:${pin.clientHeight}:${deck.clientWidth}`;
      if (signature !== previous) { previous = signature; scheduleMeasure(); }
    });
    observer.observe(pin);
  }
  configure();
})();
