// Module 5: Functionalities View (Auto-creates Default Checks by Element Type + Locked GUI Check)
window.Views = window.Views || {};

window.Views.functionalities = {
  selectedModuleId: '',
  selectedSubmoduleId: '',

  render(container) {
    const activeProject = DB.getActiveProject();
    if (!activeProject) {
      App.setHeader('Functionalities', 'Select an active project first');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Active Project</h3>
            <p>Create or select a project to manage functionalities.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('projects')">Manage Projects</button>
          </div>
        </div>
      `;
      return;
    }

    const modules = DB.getModules(activeProject.id);
    if (modules.length === 0) {
      App.setHeader('Functionalities', 'Add a module and submodule first');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Modules Found</h3>
            <p>Create a Module and Submodule before adding functionalities.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('modules')">Go to Modules</button>
          </div>
        </div>
      `;
      return;
    }

    if (!this.selectedModuleId || !modules.some(m => m.id === this.selectedModuleId)) {
      this.selectedModuleId = modules[0].id;
    }

    const submodules = DB.getSubmodules(this.selectedModuleId);
    if (submodules.length === 0) {
      App.setHeader('Functionalities', 'Add a submodule to this module first');
      const modOpts = modules.map(m =>
        `<option value="${m.id}" ${m.id === this.selectedModuleId ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>`
      ).join('');
      container.innerHTML = `
        <div class="filter-bar">
          <div class="filter-group">
            <label for="funcModSelect">Module:</label>
            <select id="funcModSelect" class="filter-select">${modOpts}</select>
          </div>
        </div>
        <div class="card">
          <div class="empty-state">
            <h3>No Submodules in This Module</h3>
            <p>Functionalities belong to a Submodule. Create a Submodule first.</p>
            <button type="button" class="btn btn-primary" onclick="Views.submodules.selectedModuleId='${this.selectedModuleId}';App.navigate('submodules')">Go to Submodules</button>
          </div>
        </div>
      `;
      container.querySelector('#funcModSelect').onchange = (e) => {
        this.selectedModuleId = e.target.value;
        this.selectedSubmoduleId = '';
        this.render(container);
      };
      return;
    }

    if (!this.selectedSubmoduleId || !submodules.some(s => s.id === this.selectedSubmoduleId)) {
      this.selectedSubmoduleId = submodules[0].id;
    }

    const currentSub = submodules.find(s => s.id === this.selectedSubmoduleId);

    App.setHeader(
      'Functionalities',
      `Choose an Element Type and enter a name to automatically generate default checks + the locked GUI check`,
      `<button type="button" class="btn btn-primary" id="newFuncBtn">+ New Functionality</button>`
    );

    document.getElementById('newFuncBtn').onclick = () =>
      this.openFunctionalityModal(submodules, this.selectedSubmoduleId);

    const modOpts = modules.map(m =>
      `<option value="${m.id}" ${m.id === this.selectedModuleId ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>`
    ).join('');

    const subOpts = submodules.map(s =>
      `<option value="${s.id}" ${s.id === this.selectedSubmoduleId ? 'selected' : ''}>${Utils.escapeHtml(s.name)}</option>`
    ).join('');

    const filterBarHtml = `
      <div class="filter-bar">
        <div class="filter-group">
          <label for="funcModFilter">Module:</label>
          <select id="funcModFilter" class="filter-select">${modOpts}</select>
        </div>
        <div class="filter-group">
          <label for="funcSubFilter">Submodule:</label>
          <select id="funcSubFilter" class="filter-select">${subOpts}</select>
        </div>
      </div>
    `;

    const functionalities = DB.getFunctionalities(this.selectedSubmoduleId);

    if (functionalities.length === 0) {
      container.innerHTML = `
        ${filterBarHtml}
        <div class="card">
          <div class="empty-state">
            <h3>No Functionalities in "${Utils.escapeHtml(currentSub.name)}"</h3>
            <p>Select an element type (Text field, Button, Link, Checkbox, Radio button, Dropdown, or Other) and name your functionality to auto-create its checks.</p>
            <button type="button" class="btn btn-primary" id="emptyNewFuncBtn">+ Add Functionality</button>
          </div>
        </div>
      `;
      this.bindFilterEvents(container);
      container.querySelector('#emptyNewFuncBtn').onclick = () =>
        this.openFunctionalityModal(submodules, this.selectedSubmoduleId);
      return;
    }

    const rowsHtml = functionalities.map((func, idx) => {
      const actions = DB.getActions(func.id);
      const missingCount = actions.filter(a => !a.testType).length;
      return `
        <tr>
          <td style="width:90px;">
            <div class="table-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-move-up="${func.id}" ${idx === 0 ? 'disabled' : ''}>↑</button>
              <button type="button" class="btn btn-ghost btn-sm" data-move-down="${func.id}" ${idx === functionalities.length - 1 ? 'disabled' : ''}>↓</button>
            </div>
          </td>
          <td><strong>${Utils.escapeHtml(func.name)}</strong></td>
          <td><span class="badge badge-teal">${Utils.escapeHtml(func.elementType || 'Other')}</span></td>
          <td>${actions.length} action(s)</td>
          <td>
            ${missingCount > 0
              ? `<span class="badge badge-warning">${missingCount} need Test Type</span>`
              : `<span class="badge badge-success">All set</span>`}
          </td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-open-actions="${func.id}">Actions (${actions.length}) →</button>
              <button type="button" class="btn btn-ghost btn-sm" data-edit="${func.id}">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-delete="${func.id}">Delete</button>
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
              <th>Functionality Name (Column B)</th>
              <th>Element Type</th>
              <th>Generated Checks</th>
              <th>Test Type Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    this.bindFilterEvents(container);

    container.querySelectorAll('[data-move-up]').forEach(btn => {
      btn.onclick = () => {
        DB.moveFunctionality(btn.dataset.moveUp, 'up');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-move-down]').forEach(btn => {
      btn.onclick = () => {
        DB.moveFunctionality(btn.dataset.moveDown, 'down');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-open-actions]').forEach(btn => {
      btn.onclick = () => {
        Views.actions.selectedModuleId = this.selectedModuleId;
        Views.actions.selectedSubmoduleId = this.selectedSubmoduleId;
        Views.actions.selectedFunctionalityId = btn.dataset.openActions;
        App.navigate('actions');
      };
    });

    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const func = functionalities.find(f => f.id === btn.dataset.edit);
        if (func) this.openFunctionalityModal(submodules, this.selectedSubmoduleId, func);
      };
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = async () => {
        const func = functionalities.find(f => f.id === btn.dataset.delete);
        if (!func) return;
        const ok = await Utils.confirm(
          `Delete functionality "${func.name}" and all its actions?`,
          'Delete Functionality'
        );
        if (ok) {
          DB.deleteFunctionality(func.id);
          Utils.toast('Functionality deleted', 'info');
          this.render(container);
        }
      };
    });
  },

  bindFilterEvents(container) {
    const modSelect = container.querySelector('#funcModFilter');
    const subSelect = container.querySelector('#funcSubFilter');
    if (modSelect) {
      modSelect.onchange = (e) => {
        this.selectedModuleId = e.target.value;
        this.selectedSubmoduleId = '';
        this.render(container);
      };
    }
    if (subSelect) {
      subSelect.onchange = (e) => {
        this.selectedSubmoduleId = e.target.value;
        this.render(container);
      };
    }
  },

  openFunctionalityModal(submodules, defaultSubmoduleId, existing = null) {
    const isEdit = Boolean(existing);
    const currentSubId = existing?.submoduleId || defaultSubmoduleId;
    const currentElType = existing?.elementType || 'Button';

    const subOpts = submodules.map(s =>
      `<option value="${s.id}" ${s.id === currentSubId ? 'selected' : ''}>${Utils.escapeHtml(s.name)}</option>`
    ).join('');

    const elOpts = Defaults.ELEMENT_TYPES.map(t => {
      const count = DB.getTemplateChecks(t).length;
      const label = t === 'Other' ? `${t} (0 default checks + 1 GUI check)` : `${t} (${count} default checks + 1 GUI check)`;
      return `<option value="${Utils.escapeHtml(t)}" ${t === currentElType ? 'selected' : ''}>${Utils.escapeHtml(label)}</option>`;
    }).join('');

    const html = `
      <div class="form-field">
        <label class="form-label" for="funcSubSelect">Submodule *</label>
        <select id="funcSubSelect" name="submoduleId" class="form-select" required>${subOpts}</select>
      </div>
      <div class="form-field">
        <label class="form-label" for="funcElementTypeSelect">Element Type *</label>
        <span class="form-hint">
          ${isEdit
            ? 'Changing the label updates the element classification (existing actions are preserved).'
            : 'Automatically generates the default checks for this element type plus the locked final GUI check.'}
        </span>
        <select id="funcElementTypeSelect" name="elementType" class="form-select" required>${elOpts}</select>
      </div>
      <div class="form-field">
        <label class="form-label" for="funcNameInput">Functionality Name *</label>
        <span class="form-hint">Displayed in Column B on the first row of this functionality's checks.</span>
        <input
          type="text"
          id="funcNameInput"
          name="name"
          class="form-input"
          required
          placeholder="Enter functionality name"
          value="${Utils.escapeHtml(existing?.name || '')}"
        >
        <div class="error-msg">Functionality name is required.</div>
      </div>
    `;

    Utils.openModal(
      isEdit ? 'Edit Functionality' : 'New Functionality (Auto-Generate Checks)',
      html,
      (form) => {
        const name = form.elements.name.value.trim();
        const submoduleId = form.elements.submoduleId.value;
        const elementType = form.elements.elementType.value;
        if (!name || !submoduleId) return false;
        this.selectedSubmoduleId = submoduleId;
        const saved = DB.saveFunctionality({
          id: existing?.id,
          submoduleId,
          name,
          elementType
        });
        const totalActions = DB.getActions(saved.id).length;
        Utils.toast(
          isEdit
            ? 'Functionality updated'
            : `Created "${saved.name}" with ${totalActions} check(s) (including locked GUI check)`,
          'success'
        );
        this.render(document.getElementById('pageBody'));
        return true;
      },
      isEdit ? 'Save Changes' : 'Create & Generate Checks'
    );
  }
};
