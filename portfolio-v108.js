/* v108 - Small, scoped interactions shared by the three portfolio pages. */
(() => {
  'use strict';

  // Copy only this user-supplied address, following an explicit button click.
  // File previews and older browsers get a selection-based fallback.
  const legacyCopy = value => {
    const before = document.activeElement;
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.setAttribute('aria-label', 'Email address to copy');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;font-size:16px';
    document.body.append(field);
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, value.length);
    let success = false;
    try { success = document.execCommand('copy'); } catch (_) { /* Manual fallback below. */ }
    field.remove();
    before?.focus({ preventScroll: true });
    return success;
  };
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    let timer = 0;
    button.addEventListener('click', async () => {
      if (button.dataset.copying) return;
      button.dataset.copying = 'true';
      const value = button.dataset.copyEmail;
      const group = button.closest('.footer-email');
      const feedback = button.querySelector('.footer-email__feedback');
      const status = group.querySelector('[data-copy-status]');
      clearTimeout(timer);
      button.classList.remove('is-copied');
      feedback.hidden = true;
      button.setAttribute('aria-label', 'Copy ' + value);
      status.textContent = '';
      let copied = false;
      try {
        if (window.isSecureContext && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          copied = true;
        }
      } catch (_) { /* A denied permission must not produce a false success. */ }
      if (!copied) copied = legacyCopy(value);
      clearTimeout(timer);
      if (copied) {
        button.classList.add('is-copied');
        feedback.hidden = false;
        feedback.textContent = 'Copied';
        button.setAttribute('aria-label', 'Email address copied');
        status.textContent = 'Copied ' + value + ' to the clipboard.';
        timer = setTimeout(() => {
          button.classList.remove('is-copied');
          feedback.hidden = true;
          button.setAttribute('aria-label', 'Copy ' + value);
          status.textContent = '';
        }, 2400);
      } else {
        const range = document.createRange();
        range.selectNodeContents(group.querySelector('.footer-email__address'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'Automatic copying is unavailable. The email is selected; use your device copy command.';
      }
      delete button.dataset.copying;
    });
  });

  // Read the full experiment story without making every card a long article.
  const section = document.getElementById('vibes');
  if (!section) return;
  let returnTo = null;
  const close = dialog => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    returnTo?.focus({ preventScroll: true });
  };
  const open = (key, trigger) => {
    const dialog = document.getElementById('tool-dialog-' + key);
    if (!dialog) return;
    returnTo = trigger;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.querySelector('[data-tool-close]').focus({ preventScroll: true });
  };
  section.querySelectorAll('[data-tool-open]').forEach(button => {
    button.addEventListener('click', () => open(button.dataset.toolOpen, button));
  });
  section.querySelectorAll('[data-tool-card]').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a,button,input,summary')) return;
      open(card.dataset.toolCard, card.querySelector('[data-tool-open]'));
    });
  });
  section.querySelectorAll('.tool-dialog').forEach(dialog => {
    dialog.querySelector('[data-tool-close]').addEventListener('click', () => close(dialog));
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) close(dialog);
    });
    dialog.addEventListener('close', () => returnTo?.focus({ preventScroll: true }));
  });
})();
