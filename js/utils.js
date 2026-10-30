// Shared UI & Helper Utilities
window.Utils = (() => {
  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(isoString) {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  }

  function toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span>${escapeHtml(message)}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3400);
  }

  // Fallback for browsers without <dialog closedby="any"> support
  function attachDialogLightDismissFallback(dialog) {
    if (!dialog || dialog._lightDismissBound) return;
    dialog._lightDismissBound = true;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      });
    }
  }

  // Fallback & ARIA sync for :user-invalid
  function initFormValidation(root = document) {
    const syncAria = (el) => {
      if (!el || typeof el.matches !== 'function') return;
      try {
        if (CSS.supports('selector(:user-invalid)')) {
          el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
        }
      } catch {
        // Ignore on unsupported selectors
      }
    };

    root.addEventListener('blur', (e) => syncAria(e.target), true);
    root.addEventListener('input', (e) => {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
        syncAria(e.target);
      }
    });
  }

  let currentSaveHandler = null;

  function openModal(title, bodyHtml, onSave, saveLabel = 'Save') {
    const dialog = document.getElementById('appModal');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const saveBtn = document.getElementById('modalSaveBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const closeBtn = document.getElementById('modalCloseBtn');
    const formEl = document.getElementById('modalForm');

    attachDialogLightDismissFallback(dialog);

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    saveBtn.textContent = saveLabel;
    currentSaveHandler = onSave;

    formEl.onsubmit = (e) => {
      e.preventDefault();
      if (!formEl.checkValidity()) {
        // Trigger validation feedback and focus first invalid input
        const firstInvalid = formEl.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.classList.add('user-invalid-fallback');
          firstInvalid.setAttribute('aria-invalid', 'true');
          firstInvalid.focus();
        }
        return;
      }
      if (typeof currentSaveHandler === 'function') {
        const shouldClose = currentSaveHandler(formEl);
        if (shouldClose !== false) {
          dialog.close();
        }
      } else {
        dialog.close();
      }
    };

    cancelBtn.onclick = () => dialog.close();
    closeBtn.onclick = () => dialog.close();

    dialog.showModal();

    const firstInput = bodyEl.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 20);
    }
  }

  function closeModal() {
    const dialog = document.getElementById('appModal');
    if (dialog && dialog.open) dialog.close();
  }

  function confirm(message, title = 'Confirm Action') {
    return new Promise((resolve) => {
      const dialog = document.getElementById('confirmModal');
      const titleEl = document.getElementById('confirmTitle');
      const msgEl = document.getElementById('confirmMessage');
      const okBtn = document.getElementById('confirmOkBtn');
      const cancelBtn = document.getElementById('confirmCancelBtn');
      const closeBtn = document.getElementById('confirmCloseBtn');

      attachDialogLightDismissFallback(dialog);

      titleEl.textContent = title;
      msgEl.textContent = message;

      const cleanup = (result) => {
        if (dialog.open) dialog.close();
        resolve(result);
      };

      okBtn.onclick = () => cleanup(true);
      cancelBtn.onclick = () => cleanup(false);
      closeBtn.onclick = () => cleanup(false);
      dialog.onclose = () => resolve(false);

      dialog.showModal();
    });
  }

  return {
    uuid,
    escapeHtml,
    formatDate,
    toast,
    openModal,
    closeModal,
    confirm,
    initFormValidation
  };
})();
