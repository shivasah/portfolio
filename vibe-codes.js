/* v86 - view-only website previews.
   Public destinations are allowlisted. No localhost or internal URL is loaded.
   The independent frames keep the sites' styling out of the portfolio. */
(() => {
  'use strict';
  const section = document.getElementById('vibes');
  if (!section) return;
  const allowed = new Set(['https://letterwave.vercel.app/', 'https://squarekin.vercel.app/']);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const economical = () => Boolean(connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || '')));
  const states = [];

  const status = (state, text) => {
    state.status.textContent = text;
    const active = Boolean(state.frame || state.pending);
    const label = state.pending ? 'Cancel preview' : state.frame ? 'Pause preview' : 'Load live preview';
    state.button.textContent = label;
    state.button.setAttribute('aria-label', label + ' for ' + state.name);
    state.button.setAttribute('aria-pressed', String(active));
  };
  const coverMessage = state => {
    if (state.failed) return 'Live view unavailable - open the site below';
    if (state.userPaused) return 'Illustrated cover - preview paused';
    if (reduced.matches && !state.manual) return 'Still cover - reduced motion';
    if (economical() && !state.manual) return 'Still cover - saving data';
    return 'Illustrated cover - live site linked below';
  };
  const fit = state => {
    const width = state.screen.getBoundingClientRect().width;
    if (width > 0) state.element.style.setProperty('--preview-scale', String(width / 1200));
  };
  const stop = (state, message) => {
    state.sequence += 1;
    if (state.controller) state.controller.abort();
    state.controller = null;
    clearTimeout(state.timeout);
    state.timeout = 0;
    state.pending = false;
    if (state.frame) state.frame.remove();
    state.frame = null;
    state.element.classList.remove('is-live');
    status(state, message || coverMessage(state));
  };
  const fail = state => {
    state.failed = true;
    stop(state, 'Live view unavailable - open the site below');
  };
  const start = async (state, manual = false) => {
    if (state.frame || state.pending || document.hidden || !state.near) return;
    if (!manual && (state.userPaused || state.failed || ((!state.manual) && (reduced.matches || economical())))) {
      status(state, coverMessage(state));
      return;
    }
    if (manual) {
      state.manual = true;
      state.userPaused = false;
      state.failed = false;
    }
    const ticket = ++state.sequence;
    state.pending = true;
    fit(state);
    status(state, 'Loading live website preview...');
    const controller = new AbortController();
    state.controller = controller;
    state.timeout = setTimeout(() => controller.abort(), 8000);
    try {
      // Avoid a blank/error iframe when the site cannot be reached. This GET
      // is opaque (no response data is read) and sends no portfolio data.
      // A reachable site can still prohibit framing via its own CSP/XFO.
      if (!navigator.onLine) throw new Error('Offline');
      await fetch(state.url, { mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'force-cache', signal: controller.signal });
      if (ticket !== state.sequence) return;
      clearTimeout(state.timeout);
      state.controller = null;
      if (!state.near || document.hidden) { stop(state); return; }
      const frame = document.createElement('iframe');
      frame.title = state.name + ' website preview';
      frame.tabIndex = -1;
      frame.inert = true;
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      frame.setAttribute('allow', "autoplay 'none'; camera 'none'; microphone 'none'; geolocation 'none'; clipboard-write 'none'");
      frame.referrerPolicy = 'no-referrer';
      frame.addEventListener('load', () => {
        if (ticket !== state.sequence || state.frame !== frame) return;
        clearTimeout(state.timeout);
        state.pending = false;
        state.element.classList.add('is-live');
        status(state, 'Live website - view only');
      }, { once: true });
      frame.addEventListener('error', () => {
        if (ticket === state.sequence) fail(state);
      }, { once: true });
      frame.src = state.url;
      state.frame = frame;
      state.mount.appendChild(frame);
      state.timeout = setTimeout(() => {
        if (ticket === state.sequence && state.pending) fail(state);
      }, 15000);
    } catch (error) {
      if (ticket === state.sequence) fail(state);
    }
  };

  section.querySelectorAll('[data-site-preview]').forEach(element => {
    const url = element.dataset.siteUrl;
    if (!allowed.has(url)) return;
    const state = {
      element, url, name: element.dataset.siteName,
      screen: element.querySelector('.vibe-site-preview__screen'),
      mount: element.querySelector('[data-preview-mount]'),
      status: element.querySelector('[data-preview-status]'),
      button: element.querySelector('[data-preview-toggle]'),
      frame: null, controller: null, sequence: 0, timeout: 0,
      near: false, pending: false, manual: false, failed: false, userPaused: false
    };
    if (!state.screen || !state.mount || !state.status || !state.button) return;
    states.push(state);
    state.button.hidden = false;
    status(state, coverMessage(state));
    state.button.addEventListener('click', () => {
      if (state.frame || state.pending) {
        state.userPaused = true;
        stop(state, 'Illustrated cover - preview paused');
      } else {
        state.near = true;
        start(state, true);
      }
    });
    fit(state);
  });

  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(entries => {
      for (const entry of entries) {
        const state = states.find(item => item.screen === entry.target);
        if (state) fit(state);
      }
    });
    states.forEach(state => resize.observe(state.screen));
  } else window.addEventListener('resize', () => states.forEach(fit), { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = states.find(item => item.element === entry.target);
        if (!state) return;
        state.near = entry.isIntersecting;
        if (state.near) start(state);
        else stop(state);
      });
    }, { rootMargin: '200px 0px', threshold: 0 });
    states.forEach(state => observer.observe(state.element));
  }
  // Without IntersectionObserver the cover and explicit Load button are kept.
  document.addEventListener('visibilitychange', () => {
    states.forEach(state => { if (document.hidden) stop(state); else if (state.near) start(state); });
  });
  reduced.addEventListener('change', () => {
    states.forEach(state => { state.manual = false; stop(state); if (state.near) start(state); });
  });
  window.addEventListener('online', () => {
    states.forEach(state => { state.failed = false; if (state.near) start(state); });
  });
  window.addEventListener('pagehide', () => states.forEach(state => stop(state)));
})();
