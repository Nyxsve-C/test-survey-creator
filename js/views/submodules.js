// Module 4: Submodules View (Each Submodule = Light-Teal Colored Header Row in Excel)
window.Views = window.Views || {};

window.Views.submodules = {
  selectedModuleId: '',

  render(container) {
    const activeProject = DB.getActiveProject();
    if (!activeProject) {
      App.setHeader('Submodules', 'Select an active project first');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Active Project</h3>
            <p>Create or select a project to manage submodules.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('projects')">Manage Projects</button>
          </div>
        </div>
      `;
      return;
    }

    const modules = DB.getModules(activeProject.id);
    if (modules.length === 0) {
      App.setHeader('Submodules', `Project "${activeProject.name}" has no modules yet`);
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>Create a Module First</h3>
            <p>Submodules belong to a Module. Add at least one Module first.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('modules')">Go to Modules</button>
          </div>
        </div>
      `;
      return;
    }

    if (!this.selectedModuleId || !modules.some(m => m.id === this.selectedModuleId)) {
      this.selectedModuleId = modules[0].id;
    }

    const currentMod = modules.find(m => m.id === this.selectedModuleId);

    App.setHeader(
      'Submodules',
      `Each submodule becomes a light-teal colored group header row in "${currentMod.name}"`,
      `<button type="button" class="btn btn-primary" id="newSubmoduleBtn">+ New Submodule</button>`
    );

    document.getElementById('newSubmoduleBtn').onclick = () => this.openSubmoduleModal(modules, this.selectedModuleId);

    const moduleOptions = modules.map(m =>
      `<option value="${m.id}" ${m.id === this.selectedModuleId ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>`
    ).join('');

    const submodules = DB.getSubmodules(this.selectedModuleId);

    const filterBarHtml = `
      <div class="filter-bar">
        <div class="filter-group">
          <label for="submodModuleFilter">Module:</label>
          <select id="submodModuleFilter" class="filter-select">${moduleOptions}</select>
        </div>
      </div>
    `;

    if (submodules.length === 0) {
      container.innerHTML = `
        ${filterBarHtml}
        <div class="card">
          <div class="empty-state">
            <h3>No Submodules in "${Utils.escapeHtml(currentMod.name)}"</h3>
            <p>Add submodules to group functionalities under colored header rows in the Excel output.</p>
            <button type="button" class="btn btn-primary" id="emptyNewSubmodBtn">+ Add Submodule</button>
          </div>
        </div>
      `;
      container.querySelector('#submodModuleFilter').onchange = (e) => {
        this.selectedModuleId = e.target.value;
        this.render(container);
      };
      container.querySelector('#emptyNewSubmodBtn').onclick = () => this.openSubmoduleModal(modules, this.selectedModuleId);
      return;
    }

    const rowsHtml = submodules.map((sub, idx) => {
      const funcs = DB.getFunctionalities(sub.id);
      const allModActions = DB.getActionsByModule(this.selectedModuleId);
      const subActionsCount = allModActions.filter(a => a.submoduleId === sub.id).length;
      return `
        <tr>
          <td style="width:90px;">
            <div class="table-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-move-up="${sub.id}" ${idx === 0 ? 'disabled' : ''}>↑</button>
              <button type="button" class="btn btn-ghost btn-sm" data-move-down="${sub.id}" ${idx === submodules.length - 1 ? 'disabled' : ''}>↓</button>
            </div>
          </td>
          <td>
            <span class="badge badge-submod">${Utils.escapeHtml(sub.name)}</span>
          </td>
          <td>${funcs.length}</td>
          <td>${subActionsCount}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-open-funcs="${sub.id}">Functionalities →</button>
              <button type="button" class="btn btn-ghost btn-sm" data-edit="${sub.id}">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-delete="${sub.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      ${filterBarHtml}
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Submodule Name (Colored Excel Row)</th>
              <th>Functionalities</th>
              <th>Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    container.querySelector('#submodModuleFilter').onchange = (e) => {
      this.selectedModuleId = e.target.value;
      this.render(container);
    };

    container.querySelectorAll('[data-move-up]').forEach(btn => {
      btn.onclick = () => {
        DB.moveSubmodule(btn.dataset.moveUp, 'up');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-move-down]').forEach(btn => {
      btn.onclick = () => {
        DB.moveSubmodule(btn.dataset.moveDown, 'down');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-open-funcs]').forEach(btn => {
      btn.onclick = () => {
        Views.functionalities.selectedModuleId = this.selectedModuleId;
        Views.functionalities.selectedSubmoduleId = btn.dataset.openFuncs;
        App.navigate('functionalities');
      };
    });

    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const sub = submodules.find(s => s.id === btn.dataset.edit);
        if (sub) this.openSubmoduleModal(modules, this.selectedModuleId, sub);
      };
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = async () => {
        const sub = submodules.find(s => s.id === btn.dataset.delete);
        if (!sub) return;
        const ok = await Utils.confirm(
          `Delete submodule "${sub.name}" and all its functionalities and actions?`,
          'Delete Submodule'
        );
        if (ok) {
          DB.deleteSubmodule(sub.id);
          Utils.toast('Submodule deleted', 'info');
          this.render(container);
        }
      };
    });
  },

  openSubmoduleModal(modules, defaultModuleId, existing = null) {
    const isEdit = Boolean(existing);
    const currentModId = existing?.moduleId || defaultModuleId;
    const modOpts = modules.map(m =>
      `<option value="${m.id}" ${m.id === currentModId ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>`
    ).join('');

    const html = `
      <div class="form-field">
        <label class="form-label" for="subModSelect">Module *</label>
        <select id="subModSelect" name="moduleId" class="form-select" required>${modOpts}</select>
      </div>
      <div class="form-field">
        <label class="form-label" for="subNameInput">Submodule Name *</label>
        <span class="form-hint">Displayed as a colored row spanning columns A–D in the Excel sheet.</span>
        <input
          type="text"
          id="subNameInput"
          name="name"
          class="form-input"
          required
          placeholder="Enter submodule name"
          value="${Utils.escapeHtml(existing?.name || '')}"
        >
        <div class="error-msg">Submodule name is required.</div>
      </div>
    `;

    Utils.openModal(
      isEdit ? 'Edit Submodule' : 'New Submodule',
      html,
      (form) => {
        const name = form.elements.name.value.trim();
        const moduleId = form.elements.moduleId.value;
        if (!name || !moduleId) return false;
        this.selectedModuleId = moduleId;
        DB.saveSubmodule({ id: existing?.id, moduleId, name });
        Utils.toast(isEdit ? 'Submodule updated' : 'Submodule created', 'success');
        this.render(document.getElementById('pageBody'));
        return true;
      },
      isEdit ? 'Save Changes' : 'Add Submodule'
    );
  }
};
