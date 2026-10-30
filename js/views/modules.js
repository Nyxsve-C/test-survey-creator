// Module 3: Modules View (Each Module = 1 Sheet Tab in the Excel Workbook)
window.Views = window.Views || {};

window.Views.modules = {
  render(container) {
    const activeProject = DB.getActiveProject();

    App.setHeader(
      'Modules',
      activeProject
        ? `Modules for "${activeProject.name}" — each module becomes a sheet tab in the exported Excel file`
        : 'Select or create an active project first',
      activeProject
        ? `<button type="button" class="btn btn-primary" id="newModuleBtn">+ New Module</button>`
        : `<button type="button" class="btn btn-primary" onclick="App.navigate('projects')">Go to Projects</button>`
    );

    if (!activeProject) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Active Project</h3>
            <p>Please create or select a project before adding testing modules.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('projects')">Manage Projects</button>
          </div>
        </div>
      `;
      return;
    }

    document.getElementById('newModuleBtn').onclick = () => this.openModuleModal(activeProject.id);

    const modules = DB.getModules(activeProject.id);

    if (modules.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Modules in "${Utils.escapeHtml(activeProject.name)}"</h3>
            <p>Decompose the application into testing modules. Each module will become a separate sheet tab in your exported workbook.</p>
            <button type="button" class="btn btn-primary" id="emptyNewModuleBtn">+ Add First Module</button>
          </div>
        </div>
      `;
      container.querySelector('#emptyNewModuleBtn').onclick = () => this.openModuleModal(activeProject.id);
      return;
    }

    const rowsHtml = modules.map((mod, idx) => {
      const submodules = DB.getSubmodules(mod.id);
      const funcs = DB.getFunctionalitiesByModule(mod.id);
      const actions = DB.getActionsByModule(mod.id);
      return `
        <tr>
          <td style="width:90px;">
            <div class="table-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-move-up="${mod.id}" ${idx === 0 ? 'disabled' : ''} title="Move up">↑</button>
              <button type="button" class="btn btn-ghost btn-sm" data-move-down="${mod.id}" ${idx === modules.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
            </div>
          </td>
          <td><strong>${Utils.escapeHtml(mod.name)}</strong></td>
          <td>${submodules.length}</td>
          <td>${funcs.length}</td>
          <td>${actions.length}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-open-submodules="${mod.id}">Submodules →</button>
              <button type="button" class="btn btn-ghost btn-sm" data-edit="${mod.id}">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-delete="${mod.id}">Delete</button>
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
              <th>Order</th>
              <th>Module Name (Excel Sheet Tab)</th>
              <th>Submodules</th>
              <th>Functionalities</th>
              <th>Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('[data-move-up]').forEach(btn => {
      btn.onclick = () => {
        DB.moveModule(btn.dataset.moveUp, 'up');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-move-down]').forEach(btn => {
      btn.onclick = () => {
        DB.moveModule(btn.dataset.moveDown, 'down');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-open-submodules]').forEach(btn => {
      btn.onclick = () => {
        Views.submodules.selectedModuleId = btn.dataset.openSubmodules;
        App.navigate('submodules');
      };
    });

    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const mod = modules.find(m => m.id === btn.dataset.edit);
        if (mod) this.openModuleModal(activeProject.id, mod);
      };
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = async () => {
        const mod = modules.find(m => m.id === btn.dataset.delete);
        if (!mod) return;
        const ok = await Utils.confirm(
          `Delete module "${mod.name}" and all its submodules, functionalities, and actions?`,
          'Delete Module'
        );
        if (ok) {
          DB.deleteModule(mod.id);
          Utils.toast('Module deleted', 'info');
          this.render(container);
        }
      };
    });
  },

  openModuleModal(projectId, existing = null) {
    const isEdit = Boolean(existing);
    const html = `
      <div class="form-field">
        <label class="form-label" for="modNameInput">Module Name *</label>
        <span class="form-hint">Becomes a worksheet tab name in the exported Excel file.</span>
        <input
          type="text"
          id="modNameInput"
          name="name"
          class="form-input"
          required
          maxlength="31"
          placeholder="Enter module name"
          value="${Utils.escapeHtml(existing?.name || '')}"
        >
        <div class="error-msg">Module name is required (max 31 characters for Excel tab).</div>
      </div>
    `;

    Utils.openModal(
      isEdit ? 'Edit Module' : 'New Module',
      html,
      (form) => {
        const name = form.elements.name.value.trim();
        if (!name) return false;
        DB.saveModule({ id: existing?.id, projectId, name });
        Utils.toast(isEdit ? 'Module updated' : 'Module created', 'success');
        this.render(document.getElementById('pageBody'));
        return true;
      },
      isEdit ? 'Save Changes' : 'Add Module'
    );
  }
};
