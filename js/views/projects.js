// Module 2: Projects View (Supports Web App Testing & Mobile App Testing Project Types)
window.Views = window.Views || {};

window.Views.projects = {
  render(container) {
    App.setHeader(
      'Projects',
      'Each project exports as one Test Survey Excel workbook (.xlsx) — choose Web App or Mobile App Testing',
      `<button type="button" class="btn btn-primary" id="newProjectBtn">+ New Project</button>`
    );

    document.getElementById('newProjectBtn').onclick = () => this.openProjectModal();

    const projects = DB.getProjects();
    const activeId = DB.getActiveProjectId();

    if (projects.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Projects Yet</h3>
            <p>Create your first project (Web App Testing or Mobile App Testing) to begin adding modules, submodules, functionalities, and checks.</p>
            <button type="button" class="btn btn-primary" id="emptyNewProjectBtn">+ Create Project</button>
          </div>
        </div>
      `;
      container.querySelector('#emptyNewProjectBtn').onclick = () => this.openProjectModal();
      return;
    }

    const rowsHtml = projects.map(p => {
      const isActive = p.id === activeId;
      const stats = DB.getStats(p.id);
      const pType = p.projectType || 'Web App Testing';
      const isMobile = pType === 'Mobile App Testing';
      return `
        <tr>
          <td>
            <strong>${Utils.escapeHtml(p.name)}</strong>
            ${isActive ? '<span class="badge badge-success" style="margin-left:0.5rem;">Active</span>' : ''}
          </td>
          <td>
            <span class="badge ${isMobile ? 'badge-submod' : 'badge-teal'}">
              ${isMobile ? '📱 ' : '🌐 '}${Utils.escapeHtml(pType)}
            </span>
          </td>
          <td>${stats.modules}</td>
          <td>${stats.submodules}</td>
          <td>${stats.functionalities}</td>
          <td>${stats.actions}</td>
          <td>${Utils.formatDate(p.createdAt)}</td>
          <td>
            <div class="table-actions">
              ${!isActive ? `<button type="button" class="btn btn-secondary btn-sm" data-set-active="${p.id}">Set Active</button>` : ''}
              <button type="button" class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-delete="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Project Type</th>
              <th>Modules</th>
              <th>Submodules</th>
              <th>Functionalities</th>
              <th>Actions</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('[data-set-active]').forEach(btn => {
      btn.onclick = () => {
        DB.setActiveProjectId(btn.dataset.setActive);
        App.refreshProjectSelector();
        Utils.toast('Active project updated', 'success');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const proj = projects.find(p => p.id === btn.dataset.edit);
        if (proj) this.openProjectModal(proj);
      };
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = async () => {
        const proj = projects.find(p => p.id === btn.dataset.delete);
        if (!proj) return;
        const ok = await Utils.confirm(
          `Delete project "${proj.name}" and all its modules, submodules, functionalities, and actions?`,
          'Delete Project'
        );
        if (ok) {
          DB.deleteProject(proj.id);
          App.refreshProjectSelector();
          Utils.toast('Project deleted', 'info');
          this.render(container);
        }
      };
    });
  },

  openProjectModal(existing = null) {
    const isEdit = Boolean(existing);
    const currentType = existing?.projectType || 'Web App Testing';

    const typeOpts = Defaults.PROJECT_TYPES.map(t =>
      `<option value="${Utils.escapeHtml(t)}" ${t === currentType ? 'selected' : ''}>${Utils.escapeHtml(t)}</option>`
    ).join('');

    const html = `
      <div class="form-field">
        <label class="form-label" for="projTypeSelect">Project Type *</label>
        <span class="form-hint">
          <strong>Web App Testing:</strong> starts empty.<br>
          <strong>Mobile App Testing:</strong> automatically adds the <em>"General mobile checks"</em> module with 18 submodules, 22 functionalities, and 163 checks.
        </span>
        <select id="projTypeSelect" name="projectType" class="form-select" required>${typeOpts}</select>
      </div>
      <div class="form-field">
        <label class="form-label" for="projNameInput">Project Name *</label>
        <span class="form-hint">Used for the exported Excel workbook filename (e.g. "Test Survey - Project Name").</span>
        <input
          type="text"
          id="projNameInput"
          name="name"
          class="form-input"
          required
          minlength="1"
          placeholder="Enter application or project name"
          value="${Utils.escapeHtml(existing?.name || '')}"
        >
        <div class="error-msg">Project name is required.</div>
      </div>
    `;

    Utils.openModal(
      isEdit ? 'Edit Project' : 'New Project',
      html,
      (form) => {
        const name = form.elements.name.value.trim();
        const projectType = form.elements.projectType.value;
        if (!name) return false;
        const saved = DB.saveProject({ id: existing?.id, name, projectType });
        DB.setActiveProjectId(saved.id);
        App.refreshProjectSelector();
        Utils.toast(
          isEdit
            ? 'Project updated'
            : (projectType === 'Mobile App Testing'
                ? 'Mobile project created with "General mobile checks" module!'
                : 'Web project created'),
          'success'
        );
        App.navigate(App.currentView || 'projects');
        return true;
      },
      isEdit ? 'Save Changes' : 'Create Project'
    );
  }
};
