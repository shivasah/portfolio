(() => {
  'use strict';

  const FRAME_COUNT = 105;
  // v104: the source zoom clips the base from frame 081 onward. Frame 078
  // retains both the chassis and its shadow; do not zoom into the clipped crop.
  const FINAL_FRAME = 78;
  const OPEN_SCROLL_FRACTION = 0.96;
  const FRAME_BASE = 'assets/agent-laptop/frames/';
  const VARIANTS = {
    standard: { width: 1360, height: 800, cache: 10 },
    retina: { width: 2720, height: 1600, cache: 4 }
  };
  const MAX_IN_FLIGHT = 4;
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const frameURL = (index, variant) => `${FRAME_BASE}${variant}/frame-${String(index).padStart(3, '0')}.webp`;

  function init() {
    const section = document.querySelector('[data-agent-laptop-sequence]');
    if (!section || section.dataset.agentLaptopReady === 'true') return;

    const sticky = section.querySelector('[data-sequence-sticky]');
    const stage = section.querySelector('[data-sequence-stage]');
    const canvas = stage && stage.querySelector('canvas');
    const poster = stage && stage.querySelector('[data-sequence-poster]');
    if (!sticky || !stage || !canvas || !poster) return;

    section.dataset.agentLaptopReady = 'true';
    section.classList.add('is-enhanced');

    const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!context) return;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    const cache = new Map();
    const loading = new Map();
    const queue = [];
    let variant = 'standard';
    let targetFrame = 0;
    let displayedFrame = -1;
    let raf = 0;
    let documentTop = 0;
    let scrollDistance = 1;
    let direction = 1;
    let generation = 0;

    const documentOffsetTop = (node) => {
      let top = 0;
      for (let current = node; current; current = current.offsetParent) top += current.offsetTop || 0;
      return top;
    };

    const chooseVariant = () => {
      const rect = stage.getBoundingClientRect();
      const demand = rect.width * Math.max(1, window.devicePixelRatio || 1);
      return demand > VARIANTS.standard.width ? 'retina' : 'standard';
    };

    const resetFrames = (nextVariant) => {
      if (variant === nextVariant && cache.size) return;
      variant = nextVariant;
      generation += 1;
      cache.clear();
      loading.clear();
      queue.length = 0;
      displayedFrame = -1;
      section.classList.remove('has-frame');
      section.dataset.variant = variant;
    };

    const trimCache = () => {
      const limit = VARIANTS[variant].cache;
      if (cache.size <= limit) return;
      const keep = [...cache.keys()]
        .sort((a, b) => Math.abs(a - targetFrame) - Math.abs(b - targetFrame))
        .slice(0, limit);
      const keepSet = new Set(keep);
      for (const key of cache.keys()) if (!keepSet.has(key)) cache.delete(key);
    };

    const draw = (index) => {
      const image = cache.get(index);
      if (!image || !image.complete || !image.naturalWidth) return false;
      if (displayedFrame === index) return true;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      displayedFrame = index;
      section.dataset.displayedFrame = String(index);
      section.classList.add('has-frame');
      return true;
    };

    const closestLoaded = () => {
      if (cache.has(targetFrame)) return targetFrame;
      let best = -1;
      let bestDistance = Infinity;
      for (const index of cache.keys()) {
        const distance = Math.abs(index - targetFrame);
        if (distance < bestDistance) {
          best = index;
          bestDistance = distance;
        }
      }
      return best;
    };

    const pump = () => {
      while (loading.size < MAX_IN_FLIGHT && queue.length) {
        const index = queue.shift();
        if (index < 0 || index >= FRAME_COUNT || index > FINAL_FRAME || cache.has(index) || loading.has(index)) continue;

        const requestGeneration = generation;
        const requestVariant = variant;
        const image = new Image();
        image.decoding = 'async';
        if (index === targetFrame) image.fetchPriority = 'high';
        loading.set(index, image);

        image.onload = () => {
          loading.delete(index);
          if (requestGeneration !== generation || requestVariant !== variant) {
            pump();
            return;
          }
          cache.set(index, image);
          trimCache();
          if (index === targetFrame || displayedFrame < 0) draw(index);
          pump();
        };
        image.onerror = () => {
          loading.delete(index);
          pump();
        };
        image.src = frameURL(index, requestVariant);
      }
    };

    const enqueue = (index, priority = false) => {
      if (index < 0 || index >= FRAME_COUNT || index > FINAL_FRAME || cache.has(index) || loading.has(index) || queue.includes(index)) return;
      if (priority) queue.unshift(index);
      else queue.push(index);
    };

    const warmAround = (index) => {
      enqueue(index, true);
      const order = direction >= 0
        ? [1, 2, -1, 3, -2, 4, 6, 8]
        : [-1, -2, 1, -3, 2, -4, -6, -8];
      const limit = VARIANTS[variant].cache + 2;
      for (const delta of order.slice(0, limit)) enqueue(index + delta);
      pump();
    };

    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const source = VARIANTS[variant];
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(Math.min(source.width, rect.width * dpr)));
      const height = Math.max(1, Math.round(width * source.height / source.width));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        displayedFrame = -1;
      }
    };

    const resize = () => {
      documentTop = documentOffsetTop(section);
      scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);

      const nextVariant = chooseVariant();
      if (nextVariant !== variant) resetFrames(nextVariant);
      resizeCanvas();
      update(true);
    };

    const update = (force = false) => {
      raf = 0;
      const progress = clamp01((window.scrollY - documentTop) / scrollDistance);
      const nextFrame = Math.round(clamp01(progress / OPEN_SCROLL_FRACTION) * FINAL_FRAME);
      if (nextFrame !== targetFrame) direction = nextFrame > targetFrame ? 1 : -1;
      targetFrame = nextFrame;

      section.style.setProperty('--laptop-progress', progress.toFixed(5));
      section.dataset.frame = String(targetFrame);

      warmAround(targetFrame);
      const nearest = closestLoaded();
      if (nearest >= 0 && (force || nearest !== displayedFrame)) draw(nearest);
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => update(false));
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(resize), { passive: true });
    window.addEventListener('pageshow', resize, { passive: true });

    resetFrames(chooseVariant());
    resizeCanvas();
    for (let i = 0; i <= 6; i += 1) enqueue(i, i === 0);
    pump();
    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
