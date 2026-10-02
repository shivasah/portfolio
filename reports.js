(() => {
  'use strict';
  if (!document.body.classList.contains('page-case-reports')) return;

  // Both views remain readable without JS. Enhancement adds accessible tabs.
  document.querySelectorAll('[data-mr-tabs]').forEach(group => {
    const tabs = [...group.querySelectorAll('[data-mr-tab]')];
    const panels = [...group.querySelectorAll('[data-mr-panel]')];
    group.dataset.enhanced = 'true';
    group.querySelector('[role="tablist"]').hidden = false;
    const select = name => {
      tabs.forEach(tab => {
        const active = tab.dataset.mrTab === name;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => {
        const active = panel.dataset.mrPanel === name;
        panel.hidden = !active;
        panel.inert = !active;
        panel.setAttribute('aria-hidden', String(!active));
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab.dataset.mrTab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next].dataset.mrTab);
        tabs[next].focus({ preventScroll: true });
      });
    });
    select('northstar');
  });

  // One real text node, not swapped screenshots. Manual controls always take over.
  document.querySelectorAll('[data-format-demo]').forEach(demo => {
    const toolbar = demo.querySelector('.mr-format-toolbar');
    const footer = demo.querySelector('.mr-format-footer');
    const sample = demo.querySelector('.mr-format-sample');
    const bold = demo.querySelector('[data-format="bold"]');
    const italic = demo.querySelector('[data-format="italic"]');
    const size = demo.querySelector('[data-format="size"]');
    const play = demo.querySelector('[data-format-play]');
    const visibleState = demo.querySelector('[data-format-state]');
    const liveStatus = demo.querySelector('[data-format-status]');
    if (!toolbar || !footer || !sample || !bold || !italic || !size || !play) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const steps = [
      { bold: false, italic: false, size: 18 },
      { bold: true, italic: false, size: 18 },
      { bold: true, italic: true, size: 18 },
      { bold: true, italic: true, size: 32 }
    ];
    let state = { ...steps[0] };
    let index = 0;
    let timer = 0;
    let remaining = 1100;
    let deadline = 0;
    let running = false;
    let seen = false;
    let started = false;
    let finished = false;
    let interacted = false;
    toolbar.hidden = false;
    footer.hidden = false;
    demo.dataset.ready = 'true';
    demo.querySelector('.mr-format-hint').hidden = false;

    const render = (announce = false) => {
      sample.style.setProperty('--format-weight', state.bold ? '700' : '400');
      sample.style.setProperty('--format-style', state.italic ? 'italic' : 'normal');
      sample.style.setProperty('--format-size', state.size + 'px');
      bold.setAttribute('aria-pressed', String(state.bold));
      italic.setAttribute('aria-pressed', String(state.italic));
      size.value = String(state.size);
      const label = [state.bold ? 'Bold' : '', state.italic ? 'Italic' : ''].filter(Boolean).join(' + ') || 'Regular';
      visibleState.textContent = label + ' \u00b7 ' + state.size + ' px';
      if (announce && liveStatus) liveStatus.textContent = 'Example text: ' + label.toLowerCase() + ', ' + state.size + ' pixels.';
      play.classList.toggle('is-playing', running);
      play.querySelector('span').textContent = running ? 'Pause demo' : finished ? 'Replay demo' : 'Play demo';
      play.setAttribute('aria-label', running ? 'Pause formatting demonstration' : finished ? 'Replay formatting demonstration' : 'Play formatting demonstration');
    };
    const blocked = () => document.hidden || document.documentElement.classList.contains('menu-locked') || document.body.classList.contains('menu-open');
    const suspend = () => {
      if (!timer) return;
      remaining = Math.max(0, deadline - performance.now());
      window.clearTimeout(timer);
      timer = 0;
    };
    const schedule = () => {
      if (!running || !seen || blocked() || timer) return;
      deadline = performance.now() + remaining;
      timer = window.setTimeout(() => {
        timer = 0;
        if (!running) return;
        if (index < steps.length - 1) {
          index += 1;
          state = { ...steps[index] };
          if (index === steps.length - 1) { running = false; finished = true; }
          render();
          remaining = 1100;
          schedule();
        }
      }, remaining);
    };
    const start = () => {
      suspend();
      index = 0;
      state = { ...steps[0] };
      remaining = 1100;
      running = true;
      started = true;
      finished = false;
      render();
      schedule();
    };
    const takeControl = () => {
      suspend();
      running = false;
      interacted = true;
      started = true;
      finished = true;
    };
    bold.addEventListener('click', () => { takeControl(); state.bold = !state.bold; render(true); });
    italic.addEventListener('click', () => { takeControl(); state.italic = !state.italic; render(true); });
    // Pause while a native select is open, not only after the value changes.
    size.addEventListener('pointerdown', () => { takeControl(); render(); });
    size.addEventListener('keydown', () => { takeControl(); render(); });
    size.addEventListener('change', () => {
      takeControl();
      const value = Number(size.value);
      if ([18, 24, 32].includes(value)) state.size = value;
      render(true);
    });
    play.addEventListener('click', () => {
      interacted = true;
      if (running) {
        suspend(); running = false; render();
        if (liveStatus) liveStatus.textContent = 'Formatting demonstration paused.';
      } else if (started && !finished) {
        running = true; render(); schedule();
      } else start();
    });
    // A first keyboard visit gets stable controls rather than an auto-playing demo.
    demo.addEventListener('focusin', event => {
      if (!started) { interacted = true; started = true; }
      if (running && event.target !== play && event.target.matches(':focus-visible')) {
        suspend(); running = false; render();
      }
    });
    const syncVisibility = () => {
      if (blocked() || !seen) suspend();
      else schedule();
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        seen = entries[0].isIntersecting && entries[0].intersectionRatio >= .45;
        if (seen && !started && !interacted && !motion.matches && !blocked()) start();
        syncVisibility();
      }, { threshold: [0, .45] });
      observer.observe(demo);
    } else { seen = true; } // No observer: manual playback, never off-screen autoplay.
    const overlayObserver = new MutationObserver(syncVisibility);
    overlayObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    overlayObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', syncVisibility);
    const onMotionChange = () => {
      if (motion.matches) { suspend(); running = false; render(); }
    };
    motion.addEventListener('change', onMotionChange);
    window.addEventListener('pagehide', suspend);
    window.addEventListener('pageshow', syncVisibility);
    render();
  });

  const links = [...document.querySelectorAll('[data-report-lightbox]')];
  if (!links.length) return;
  const viewer = document.createElement('div');
  viewer.className = 'mr-lightbox';
  viewer.hidden = true;
  viewer.inert = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-labelledby', 'mr-lightbox-title');
  viewer.innerHTML = '<div class="mr-lightbox__bar"><h2 class="mr-lightbox__title" id="mr-lightbox-title"></h2><div class="mr-lightbox__actions"><button type="button" data-image-zoom aria-pressed="false">Actual size</button><button type="button" data-image-close aria-label="Close image viewer">Close &times;</button></div></div><div class="mr-lightbox__viewport" tabindex="0" aria-label="Image. In actual-size mode, scroll to explore the full screen."><img alt=""></div>';
  document.body.appendChild(viewer);
  const title = viewer.querySelector('h2');
  const image = viewer.querySelector('img');
  const viewport = viewer.querySelector('.mr-lightbox__viewport');
  const closeButton = viewer.querySelector('[data-image-close]');
  const zoomButton = viewer.querySelector('[data-image-zoom]');
  let opener = null;
  let locked = [];
  let isOpen = false;
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    document.documentElement.classList.remove('menu-locked');
    locked.forEach(([el, state]) => { el.inert = state; });
    locked = [];
    opener?.focus({ preventScroll: true });
    viewer.hidden = true;
    viewer.inert = true;
  };
  links.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.getAttribute('href');
      image.alt = link.querySelector('img')?.alt || 'Management Reports product screen';
      title.textContent = link.dataset.caption || image.alt;
      viewer.classList.remove('is-zoomed');
      zoomButton.setAttribute('aria-pressed', 'false');
      zoomButton.textContent = 'Actual size';
      viewer.hidden = false;
      viewer.inert = false;
      isOpen = true;
      document.documentElement.classList.add('menu-locked');
      closeButton.focus({ preventScroll: true });
      locked = [...document.body.children]
        .filter(el => el instanceof HTMLElement && el !== viewer && !el.matches('script, style, link, .cursor-scribble, .noise, .page-wipe'))
        .map(el => [el, el.inert]);
      locked.forEach(([el]) => { el.inert = true; });
      viewport.scrollTo(0, 0);
    });
  });
  zoomButton.addEventListener('click', () => {
    const zoomed = viewer.classList.toggle('is-zoomed');
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.textContent = zoomed ? 'Fit to screen' : 'Actual size';
    viewport.scrollTo(0, 0);
  });
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (!isOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = [zoomButton, closeButton, viewport];
    if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[2].focus(); }
    else if (!event.shiftKey && document.activeElement === items[2]) { event.preventDefault(); items[0].focus(); }
  });
})();
