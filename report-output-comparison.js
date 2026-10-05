/* v111: synchronized report comparison and accessible, native-text page reading.
   No window-scroll scrubbing, wheel cancellation or global animation loop. */
(() => {
  'use strict';
  const root = document.getElementById('output-comparison');
  if (!root) return;
  const viewer = root.querySelector('.mrc-viewer');
  const rail = root.querySelector('.mrc-rail');
  const rows = [...root.querySelectorAll('[data-mrc-row]')];
  const buttons = [...rail.querySelectorAll('[data-mrc-jump]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!viewer || !rows.length) return;

  const headerHeight = () => Math.max(...[...root.querySelectorAll('.mrc-colhead')].map(e => e.getBoundingClientRect().height));
  const toolbarHeight = () => rail.hidden ? 0 : rail.getBoundingClientRect().height;
  const topInViewer = (el) => el.getBoundingClientRect().top - viewer.getBoundingClientRect().top + viewer.scrollTop - viewer.clientTop;
  function setActive(index) {
    buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
    root.dataset.comparisonSection = String(index);
  }
  function updateActive() {
    let index = 0;
    const probe = viewer.scrollTop + toolbarHeight() + headerHeight() + 48;
    rows.forEach((row, i) => { if (topInViewer(row) <= probe) index = i; });
    // The final short mobile pair cannot always align to the top of the viewer.
    if (viewer.scrollTop > 0 && viewer.scrollHeight - viewer.clientHeight - viewer.scrollTop < 3) index = rows.length - 1;
    setActive(index);
  }
  function jump(index) {
    const row = rows[index];
    if (!row) return;
    const top = Math.max(0, topInViewer(row) - toolbarHeight() - headerHeight() - 12);
    viewer.scrollTo({top, behavior: reduced.matches ? 'auto' : 'smooth'});
    setActive(index);
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => jump(index)));
  rail.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const from = buttons.indexOf(event.target.closest('[data-mrc-jump]'));
    if (from < 0) return;
    event.preventDefault();
    const to = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : Math.max(0, Math.min(buttons.length - 1, from + (event.key === 'ArrowRight' ? 1 : -1)));
    buttons[to].focus({preventScroll: true});
    jump(to);
  });
  let ticking = false;
  viewer.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; updateActive(); });
  }, {passive: true});
  function resizeToolbar() {
    root.style.setProperty('--mrc-toolbar-h', `${Math.ceil(toolbarHeight())}px`);
    updateActive();
  }
  window.addEventListener('resize', resizeToolbar, {passive: true});
  root.classList.add('is-enhanced');
  rail.hidden = false;
  if ('ResizeObserver' in window) new ResizeObserver(resizeToolbar).observe(rail);
  resizeToolbar();

  const dialog = root.querySelector('.mrc-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = dialog.querySelector('#mrc-dialog-title');
  const pageContainer = dialog.querySelector('.mrc-dialog-page');
  const scroller = dialog.querySelector('.mrc-dialog-scroll');
  const closeButton = dialog.querySelector('.mrc-close');
  const zoom = dialog.querySelector('.mrc-zoom');
  let trigger = null;
  let instance = 0;
  const cursor = document.querySelector('.cursor-scribble');
  let cursorAnchor = null;
  function setZoom(actual) {
    dialog.classList.toggle('is-actual', actual);
    zoom.setAttribute('aria-pressed', String(actual));
    zoom.textContent = actual ? 'Fit page' : 'Actual size';
  }
  function clonePage(page) {
    const copy = page.cloneNode(true);
    const replacements = new Map();
    instance += 1;
    copy.querySelectorAll('[id]').forEach(el => {
      const original = el.id;
      el.id = `${original}-enlarged-${instance}`;
      replacements.set(original, el.id);
    });
    // Keep local SVG gradient references unique in the enlarged copy.
    copy.querySelectorAll('*').forEach(el => {
      for (const attribute of [...el.attributes]) {
        let value = attribute.value;
        replacements.forEach((replacement, original) => {
          value = value.split(`url(#${original})`).join(`url(#${replacement})`);
          if (value === `#${original}`) value = `#${replacement}`;
        });
        if (value !== attribute.value) el.setAttribute(attribute.name, value);
      }
    });
    return copy;
  }
  root.querySelectorAll('[data-mrc-enlarge]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const sheet = document.getElementById(button.dataset.mrcEnlarge);
      const page = sheet?.querySelector('.mrc-page-stage');
      if (!page) return;
      trigger = button;
      title.textContent = sheet.dataset.reportLabel;
      pageContainer.replaceChildren(clonePage(page));
      setZoom(false);
      dialog.showModal();
      // Keep the site's existing magnetic cursor visible in the native top layer.
      // Its controllers keep the same node reference; restore it on close.
      if (cursor && !cursorAnchor) {
        cursorAnchor = document.createComment('cursor-home');
        cursor.before(cursorAnchor);
        dialog.appendChild(cursor);
      }
      document.body.classList.add('mrc-modal-open');
      scroller.scrollTo(0, 0);
      closeButton.focus({preventScroll: true});
    });
  });
  root.querySelector('.mrc-enhanced-hint').hidden = false;
  closeButton.addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => setZoom(!dialog.classList.contains('is-actual')));
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('mrc-modal-open');
    if (cursorAnchor && cursor) { cursorAnchor.replaceWith(cursor); cursorAnchor = null; }
    pageContainer.replaceChildren();
    trigger?.focus({preventScroll: true});
  });
})();
