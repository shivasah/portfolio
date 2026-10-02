/* v87 - optional two-fold dashboard capture. Local sanitized image only.
   Blank configuration makes no request and keeps the labelled illustration.
   The capture is never a link to the internal application. */
(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG?.cashflowPreview;
  const media = document.querySelector('[data-cashflow-media]');
  const path = typeof config?.imagePath === 'string' ? config.imagePath.trim() : '';
  if (!media || !path) return;
  // No remote/internal URL, arbitrary scheme, or parent-directory traversal.
  if (!/^assets\/[a-z0-9_./ ()-]+\.(png|jpe?g|webp|avif)$/i.test(path) || /(^|\/)\.\.(\/|$)/.test(path)) return;

  const preview = media.querySelector('[data-cashflow-preview]');
  const screen = media.querySelector('[data-cashflow-screen]');
  const image = media.querySelector('[data-cashflow-image]');
  const fallback = media.querySelector('[data-cashflow-fallback]');
  const toggle = media.querySelector('[data-cashflow-toggle]');
  const status = media.querySelector('[data-cashflow-status]');
  if (!preview || !screen || !image || !fallback || !toggle || !status) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const seconds = Number(config.cycleSeconds);
  const duration = (Number.isFinite(seconds) ? Math.max(12, Math.min(60, seconds)) : 24) * 1000;
  let animation = null;
  let loaded = false, near = false, hovering = false, focused = false;
  let userPaused = false, manualMotion = false;
  let lastTravel = -1;

  const sync = () => {
    if (!loaded) return;
    const motionAllowed = !reduced.matches || manualMotion;
    const running = Boolean(animation && near && !document.hidden && !userPaused && motionAllowed && !hovering && !focused);
    if (animation) { if (running) animation.play(); else animation.pause(); }
    preview.classList.toggle('is-running', running);
    preview.dataset.previewState = running ? 'playing' : 'paused';
    const pausedByUser = userPaused || !motionAllowed;
    toggle.textContent = pausedByUser ? 'Play preview' : 'Pause preview';
    toggle.setAttribute('aria-label', (pausedByUser ? 'Play' : 'Pause') + ' Cash Flow dashboard preview');
    toggle.setAttribute('aria-pressed', String(!pausedByUser));
    status.textContent = !motionAllowed ? 'Still preview - reduced motion' : running ? 'First two screenfuls - auto-scroll' : 'First two screenfuls - paused';
  };

  const fit = () => {
    if (!loaded) return;
    // One crop is exactly half of the supplied two-screenful image.
    screen.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight / 2}`;
    const travel = Math.max(0, image.getBoundingClientRect().height - screen.clientHeight);
    if (Math.abs(travel - lastTravel) < .5 && animation) { sync(); return; }
    lastTravel = travel;
    const progress = animation ? (Number(animation.currentTime) || 0) / duration : 0;
    if (animation) animation.cancel();
    if (travel > 1 && typeof image.animate === 'function') {
      const top = 'translate3d(0,0,0)';
      const bottom = `translate3d(0,${-travel.toFixed(2)}px,0)`;
      animation = image.animate([
        { transform:top, offset:0 },
        { transform:top, offset:.1, easing:'cubic-bezier(.42,0,.58,1)' },
        { transform:bottom, offset:.45 },
        { transform:bottom, offset:.55, easing:'cubic-bezier(.42,0,.58,1)' },
        { transform:top, offset:.9 },
        { transform:top, offset:1 }
      ], { duration, iterations:Infinity, fill:'both' });
      animation.pause();
      animation.currentTime = progress * duration;
    } else {
      animation = null;
      toggle.hidden = true;
    }
    sync();
  };

  image.alt = config.alt || 'Sanitized Cash Flow Feedback dashboard, first two screenfuls.';
  image.addEventListener('load', () => {
    if (!image.naturalWidth || !image.naturalHeight) return;
    loaded = true;
    fallback.hidden = true;
    preview.hidden = false;
    fit();
  }, { once:true });
  image.addEventListener('error', () => {
    loaded = false;
    if (animation) animation.cancel();
    preview.hidden = true;
    fallback.hidden = false;
    media.dataset.captureUnavailable = 'true';
  }, { once:true });

  toggle.addEventListener('click', () => {
    if (reduced.matches && !manualMotion) { manualMotion = true; userPaused = false; }
    else userPaused = !userPaused;
    sync();
  });
  screen.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; sync(); } });
  screen.addEventListener('pointerleave', () => { hovering = false; sync(); });
  screen.addEventListener('focus', () => { focused = true; sync(); });
  screen.addEventListener('blur', () => { focused = false; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { near = entries[0].isIntersecting; sync(); }, { threshold:.05 }).observe(media);
  } else near = true;
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(screen);
  else window.addEventListener('resize', fit, { passive:true });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => animation?.pause());
  window.addEventListener('pageshow', sync);
  reduced.addEventListener('change', () => {
    manualMotion = false;
    if (reduced.matches && animation) animation.currentTime = 0;
    sync();
  });
  image.src = path;
})();
