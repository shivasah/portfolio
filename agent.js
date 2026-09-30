/* Agent Management enhancements. All final evidence remains in the HTML. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');

  // 95k scale field. All 95 marks are present immediately; on fine pointers,
  // nearby dots respond to the cursor with slow, low-amplitude magnetic motion.
  document.querySelectorAll('[data-magnet-dots]').forEach(visual => {
    const field = visual.querySelector('.agent-scale__field');
    const dots = field ? [...field.querySelectorAll('.agent-scale-dot')] : [];
    if (!field || !dots.length) return;

    dots.forEach((dot, index) => {
      dot.style.setProperty('--dot-seed', String(index));
      dot.dataset.mx = '0';
      dot.dataset.my = '0';
      dot.dataset.tx = '0';
      dot.dataset.ty = '0';
      dot.dataset.ts = '1';
    });

    if (reduceMotion.matches || !hoverCapable.matches) return;

    let pointer = null;
    let raf = 0;
    let active = false;
    const radius = 210;
    const maxPull = 8;
    const ease = .065;

    const setTargets = (clientX, clientY) => {
      dots.forEach(dot => {
        const rect = dot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const influence = Math.max(0, 1 - dist / radius);
        const softened = influence * influence * (3 - 2 * influence);
        dot.dataset.tx = String((dx / dist) * maxPull * softened);
        dot.dataset.ty = String((dy / dist) * maxPull * softened);
        dot.dataset.ts = String(1 + softened * .055);
      });
    };

    const settleTargets = () => {
      dots.forEach(dot => {
        dot.dataset.tx = '0';
        dot.dataset.ty = '0';
        dot.dataset.ts = '1';
      });
    };

    const tick = () => {
      let moving = false;
      dots.forEach(dot => {
        const x = Number(dot.dataset.mx || 0);
        const y = Number(dot.dataset.my || 0);
        const tx = Number(dot.dataset.tx || 0);
        const ty = Number(dot.dataset.ty || 0);
        const currentScale = Number(dot.dataset.ms || 1);
        const targetScale = Number(dot.dataset.ts || 1);
        const nx = x + (tx - x) * ease;
        const ny = y + (ty - y) * ease;
        const ns = currentScale + (targetScale - currentScale) * ease;
        dot.dataset.mx = String(nx);
        dot.dataset.my = String(ny);
        dot.dataset.ms = String(ns);
        dot.style.transform = `translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, 0) scale(${ns.toFixed(3)})`;
        if (Math.abs(tx - nx) > .05 || Math.abs(ty - ny) > .05 || Math.abs(targetScale - ns) > .002) moving = true;
      });
      if (moving || active) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    const ensureTick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    visual.addEventListener('pointerenter', event => {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      active = true;
      pointer = {x:event.clientX, y:event.clientY};
      setTargets(pointer.x, pointer.y);
      ensureTick();
    }, {passive:true});
    visual.addEventListener('pointermove', event => {
      if (!active) return;
      pointer = {x:event.clientX, y:event.clientY};
      setTargets(pointer.x, pointer.y);
      ensureTick();
    }, {passive:true});
    visual.addEventListener('pointerleave', () => {
      active = false;
      pointer = null;
      settleTargets();
      ensureTick();
    }, {passive:true});
    reduceMotion.addEventListener('change', event => {
      if (!event.matches) return;
      active = false;
      settleTargets();
      dots.forEach(dot => { dot.style.transform = 'none'; });
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    });
  });

  // Fanned evidence cards. The screenshots are not links or zoom controls.
  // Only the persistent arrows / keyboard / swipe change the front card.
  document.querySelectorAll('[data-agent-news]').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('[data-news-slide]')];
    const controls = gallery.querySelector('[data-news-controls]');
    const status = gallery.querySelector('[data-news-status]');
    const sourceLabel = gallery.querySelector('[data-news-source]');
    const titleLabel = gallery.querySelector('[data-news-title]');
    const viewport = gallery.querySelector('.agent-news__viewport');
    if (slides.length < 2 || !controls || !status || !viewport) return;
    let active = Number(gallery.dataset.active) || 0;
    const show = (index, announce = true) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = false;
        slide.dataset.position = i === active ? 'front' : i === (active + 1) % slides.length ? 'left' : 'right';
        slide.setAttribute('aria-hidden', String(i !== active));
      });
      const source = slides[active].querySelector('figcaption strong')?.textContent || 'News';
      const title = slides[active].querySelector('figcaption span')?.textContent || '';
      if (sourceLabel) sourceLabel.textContent = source;
      if (titleLabel) titleLabel.textContent = title;
      status.textContent = `${active + 1} of ${slides.length}`;
      const announcement = document.createElement('span');
      announcement.className = 'sr-only';
      announcement.textContent = `: ${source}. ${title}`;
      status.appendChild(announcement);
      gallery.dataset.active = String(active);
    };
    gallery.classList.add('is-ready');
    controls.hidden = false;
    show(active, false);
    gallery.querySelector('[data-news-prev]')?.addEventListener('click', () => show(active - 1));
    gallery.querySelector('[data-news-next]')?.addEventListener('click', () => show(active + 1));
    gallery.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      show(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
    });
    let swipe = null;
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') swipe = {x: event.clientX, y: event.clientY, id: event.pointerId};
    }, {passive: true});
    viewport.addEventListener('pointerup', event => {
      if (!swipe || swipe.id !== event.pointerId) return;
      const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) show(active + (dx < 0 ? 1 : -1));
    }, {passive: true});
    viewport.addEventListener('pointercancel', () => { swipe = null; }, {passive: true});
  });

  // Explanations fade into a fixed-height area. Titles never move or disappear.
  const noteStates = [];
  document.querySelectorAll('[data-learning-note], [data-zfi-note]').forEach(button => {
    let pinned = false;
    let pointerInside = false;
    let keyboardFocus = false;
    const setOpen = open => {
      button.dataset.open = String(open);
      button.setAttribute('aria-expanded', String(open));
    };
    const close = () => { pinned = false; setOpen(false); };
    button.classList.add('is-enhanced');
    setOpen(false);
    button.addEventListener('pointerenter', event => {
      if (!hoverCapable.matches || event.pointerType === 'touch') return;
      pointerInside = true;
      setOpen(true);
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
    button.addEventListener('click', () => {
      pinned = !pinned;
      setOpen(pinned);
    });
    button.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopPropagation(); close();
    });
    noteStates.push({button, close});
  });
  document.addEventListener('pointerdown', event => {
    noteStates.forEach(({button,close}) => { if (!button.contains(event.target)) close(); });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') noteStates.forEach(({close}) => close());
  });
})();

/* V72 · A restrained product-device response makes the cover feel alive without
   competing with the screen itself. Reduced-motion and coarse pointers stay still. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-agent-hero-device]');
  const device = hero?.querySelector('.agent-macbook-v72');
  if (!hero || !device) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (reduce.matches || !fine.matches) return;

  let tx = -1.8, ty = 1.2, x = tx, y = ty, raf = 0, active = false;
  const render = () => {
    x += (tx - x) * .075;
    y += (ty - y) * .075;
    device.style.setProperty('--hero-ry', `${x.toFixed(2)}deg`);
    device.style.setProperty('--hero-rx', `${y.toFixed(2)}deg`);
    if (active || Math.abs(tx-x) > .03 || Math.abs(ty-y) > .03) raf = requestAnimationFrame(render);
    else raf = 0;
  };
  const ensure = () => { if (!raf) raf = requestAnimationFrame(render); };
  hero.addEventListener('pointerenter', event => { if (event.pointerType && event.pointerType !== 'mouse') return; active = true; ensure(); }, {passive:true});
  hero.addEventListener('pointermove', event => {
    if (!active) return;
    const r = hero.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (event.clientX - r.left) / r.width * 2 - 1));
    const ny = Math.max(-1, Math.min(1, (event.clientY - r.top) / r.height * 2 - 1));
    tx = nx * 2.8;
    ty = ny * -2.2;
    ensure();
  }, {passive:true});
  hero.addEventListener('pointerleave', () => { active = false; tx = -1.8; ty = 1.2; ensure(); }, {passive:true});
})();
