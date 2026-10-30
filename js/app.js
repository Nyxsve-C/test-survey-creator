// Main Application Router & State Coordinator
window.App = (() => {
  let currentView = 'dashboard';

  function setHeader(title, subtitle = '', actionsHtml = '') {
    const titleEl = document.getElementById('pageTitle');
    const subEl = document.getElementById('pageSubtitle');
    const actEl = document.getElementById('pageHeaderActions');

    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = subtitle;
    if (actEl) actEl.innerHTML = actionsHtml;
  }

  function updateNavBadges() {
    const badge = document.getElementById('navMissingBadge');
    if (!badge) return;
    const activeProject = DB.getActiveProject();
    if (!activeProject) {
      badge.classList.add('hidden');
      return;
    }
    const stats = DB.getStats(activeProject.id);
    if (stats.missingTestTypeCount > 0) {
      badge.textContent = stats.missingTestTypeCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  function refreshProjectSelector() {
    const select = document.getElementById('activeProjectSelect');
    if (!select) return;
    const projects = DB.getProjects();
    const activeId = DB.getActiveProjectId();

    if (projects.length === 0) {
      select.innerHTML = `<option value="">-- No Projects --</option>`;
    } else {
      select.innerHTML = projects
        .map(p => `<option value="${p.id}" ${p.id === activeId ? 'selected' : ''}>${Utils.escapeHtml(p.name)}</option>`)
        .join('');
    }
    updateNavBadges();
  }

  function navigate(viewName) {
    if (!window.Views || !window.Views[viewName]) {
      viewName = 'dashboard';
    }
    currentView = viewName;
    App.currentView = viewName;

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const container = document.getElementById('pageBody');
    if (container) {
      window.Views[viewName].render(container);
    }
    updateNavBadges();
  }

  function init() {
    Utils.initFormValidation(document);
    refreshProjectSelector();

    const select = document.getElementById('activeProjectSelect');
    if (select) {
      select.onchange = (e) => {
        DB.setActiveProjectId(e.target.value);
        updateNavBadges();
        navigate(currentView);
      };
    }

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.onclick = () => navigate(btn.dataset.view);
    });

    navigate('dashboard');
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    currentView,
    setHeader,
    updateNavBadges,
    refreshProjectSelector,
    navigate,
    init
  };
})();
