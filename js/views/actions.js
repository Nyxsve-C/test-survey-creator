// Module 6: Actions (Checks) View — Inline Test Type Dropdown, Locked Final GUI Check
window.Views = window.Views || {};

window.Views.actions = {
  selectedModuleId: '',
  selectedSubmoduleId: '',
  selectedFunctionalityId: '',

  render(container) {
    const activeProject = DB.getActiveProject();
    if (!activeProject) {
      App.setHeader('Actions', 'Select an active project first');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Active Project</h3>
            <p>Create or select a project to manage actions (checks).</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('projects')">Manage Projects</button>
          </div>
        </div>
      `;
      return;
    }

    const modules = DB.getModules(activeProject.id);
    if (modules.length === 0) {
      App.setHeader('Actions', 'Create a module, submodule, and functionality first');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Modules Yet</h3>
            <p>Add a Module, Submodule, and Functionality first.</p>
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
      App.setHeader('Actions', 'Create a submodule and functionality first');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Submodules in This Module</h3>
            <p>Add a Submodule and Functionality first.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('submodules')">Go to Submodules</button>
          </div>
        </div>
      `;
      return;
    }

    if (!this.selectedSubmoduleId || !submodules.some(s => s.id === this.selectedSubmoduleId)) {
      this.selectedSubmoduleId = submodules[0].id;
    }

    const functionalities = DB.getFunctionalities(this.selectedSubmoduleId);
    if (functionalities.length === 0) {
      App.setHeader('Actions', 'Create a functionality in this submodule first');
      const modOpts = modules.map(m =>
        `<option value="${m.id}" ${m.id === this.selectedModuleId ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>`
      ).join('');
      const subOpts = submodules.map(s =>
        `<option value="${s.id}" ${s.id === this.selectedSubmoduleId ? 'selected' : ''}>${Utils.escapeHtml(s.name)}</option>`
      ).join('');
      container.innerHTML = `
        <div class="filter-bar">
          <div class="filter-group">
            <label for="actModFilter">Module:</label>
            <select id="actModFilter" class="filter-select">${modOpts}</select>
          </div>
          <div class="filter-group">
            <label for="actSubFilter">Submodule:</label>
            <select id="actSubFilter" class="filter-select">${subOpts}</select>
          </div>
        </div>
        <div class="card">
          <div class="empty-state">
            <h3>No Functionalities in This Submodule</h3>
            <p>Create a Functionality to automatically generate its default checks and locked GUI check.</p>
            <button type="button" class="btn btn-primary" onclick="Views.functionalities.selectedModuleId='${this.selectedModuleId}';Views.functionalities.selectedSubmoduleId='${this.selectedSubmoduleId}';App.navigate('functionalities')">Go to Functionalities</button>
          </div>
        </div>
      `;
      this.bindFilterEvents(container);
      return;
    }

    if (!this.selectedFunctionalityId || !functionalities.some(f => f.id === this.selectedFunctionalityId)) {
      this.selectedFunctionalityId = functionalities[0].id;
    }

    const currentFunc = functionalities.find(f => f.id === this.selectedFunctionalityId);

    App.setHeader(
      'Actions (Checks)',
      `Manage checks for "${currentFunc.name}" (${currentFunc.elementType || 'Other'}) — Test Type is required for every check before export`,
      `<button type="button" class="btn btn-primary" id="newActionBtn">+ Add Action</button>`
    );

    document.getElementById('newActionBtn').onclick = () =>
      this.openActionModal(currentFunc.id);

    const modOpts = modules.map(m =>
      `<option value="${m.id}" ${m.id === this.selectedModuleId ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>`
    ).join('');

    const subOpts = submodules.map(s =>
      `<option value="${s.id}" ${s.id === this.selectedSubmoduleId ? 'selected' : ''}>${Utils.escapeHtml(s.name)}</option>`
    ).join('');

    const funcOpts = functionalities.map(f =>
      `<option value="${f.id}" ${f.id === this.selectedFunctionalityId ? 'selected' : ''}>${Utils.escapeHtml(f.name)} (${Utils.escapeHtml(f.elementType || 'Other')})</option>`
    ).join('');

    const actions = DB.getActions(currentFunc.id);
    const unlockedCount = actions.filter(a => !a.locked).length;
    const missingCount = actions.filter(a => !a.testType).length;
    const modMissingCount = DB.getActionsByModule(this.selectedModuleId).filter(a => !a.testType).length;

    const bulkTypeOpts = Defaults.TEST_TYPES.map(t =>
      `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`
    ).join('');

    const filterBarHtml = `
      <div class="filter-bar" style="justify-content:space-between;">
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <div class="filter-group">
            <label for="actModFilter">Module:</label>
            <select id="actModFilter" class="filter-select">${modOpts}</select>
          </div>
          <div class="filter-group">
            <label for="actSubFilter">Submodule:</label>
            <select id="actSubFilter" class="filter-select">${subOpts}</select>
          </div>
          <div class="filter-group">
            <label for="actFuncFilter">Functionality:</label>
            <select id="actFuncFilter" class="filter-select">${funcOpts}</select>
          </div>
        </div>
        <div style="display:flex;gap:0.45rem;align-items:center;flex-wrap:wrap;">
          <label for="bulkTestTypeSelect" style="font-size:0.8rem;font-weight:600;color:var(--teal-dark);">Fill blank Test Types:</label>
          <select id="bulkTestTypeSelect" class="filter-select" style="padding:0.32rem 0.55rem;font-size:0.82rem;">
            ${bulkTypeOpts}
          </select>
          <button type="button" class="btn btn-secondary btn-sm" id="applyBulkTypeBtn" ${missingCount === 0 ? 'disabled' : ''}>
            Functionality (${missingCount})
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="applyBulkModTypeBtn" ${modMissingCount === 0 ? 'disabled' : ''}>
            Entire Module (${modMissingCount})
          </button>
        </div>
      </div>
    `;

    const rowsHtml = actions.map((act, idx) => {
      const isLocked = Boolean(act.locked);
      const canMoveUp = !isLocked && idx > 0;
      const canMoveDown = !isLocked && idx < unlockedCount - 1;

      const testTypeSelectHtml = isLocked
        ? `<span class="badge badge-locked" title="Locked GUI check is always AT">${Utils.escapeHtml(act.testType)} 🔒</span>`
        : `<select class="test-type-select ${!act.testType ? 'missing' : ''}" data-inline-testtype="${act.id}" aria-label="Select Test Type">
            <option value="" ${!act.testType ? 'selected' : ''}>-- Choose Test Type * --</option>
            ${Defaults.TEST_TYPES.map(t =>
              `<option value="${Utils.escapeHtml(t)}" ${act.testType === t ? 'selected' : ''}>${Utils.escapeHtml(t)}</option>`
            ).join('')}
          </select>`;

      return `
        <tr class="${isLocked ? 'row-locked' : ''}">
          <td style="width:90px;">
            <div class="table-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-move-up="${act.id}" ${!canMoveUp ? 'disabled' : ''} title="Move up">↑</button>
              <button type="button" class="btn btn-ghost btn-sm" data-move-down="${act.id}" ${!canMoveDown ? 'disabled' : ''} title="Move down">↓</button>
            </div>
          </td>
          <td style="width:190px;">${testTypeSelectHtml}</td>
          <td>
            ${Utils.escapeHtml(act.description)}
            ${isLocked ? '<span class="badge badge-locked" style="margin-left:0.5rem;">Locked Final GUI Check</span>' : ''}
          </td>
          <td>${act.expectedResult ? Utils.escapeHtml(act.expectedResult) : '<span style="color:var(--text-muted);font-size:0.8rem;">(Optional — blank)</span>'}</td>
          <td style="width:140px;">
            ${isLocked
              ? `<span style="font-size:0.78rem;color:var(--text-muted);">Always last (locked)</span>`
              : `<div class="table-actions">
                  <button type="button" class="btn btn-ghost btn-sm" data-edit="${act.id}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm" data-delete="${act.id}">Delete</button>
                </div>`
            }
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
              <th>Test Type (Col A) *</th>
              <th>Actions / Check Text (Col C)</th>
              <th>Expected Result (Col D — Optional)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    this.bindFilterEvents(container);

    const bulkBtn = container.querySelector('#applyBulkTypeBtn');
    if (bulkBtn) {
      bulkBtn.onclick = () => {
        const chosenType = container.querySelector('#bulkTestTypeSelect').value;
        const updated = DB.bulkSetTestTypeForFunctionality(currentFunc.id, chosenType, true);
        Utils.toast(`Assigned "${chosenType}" to ${updated} check(s) in functionality`, 'success');
        this.render(container);
      };
    }

    const bulkModBtn = container.querySelector('#applyBulkModTypeBtn');
    if (bulkModBtn) {
      bulkModBtn.onclick = () => {
        const chosenType = container.querySelector('#bulkTestTypeSelect').value;
        const updated = DB.bulkSetTestTypeForModule(this.selectedModuleId, chosenType, true);
        Utils.toast(`Assigned "${chosenType}" to ${updated} check(s) across the module`, 'success');
        this.render(container);
      };
    }

    container.querySelectorAll('[data-inline-testtype]').forEach(sel => {
      sel.onchange = (e) => {
        const val = e.target.value;
        DB.updateActionTestType(sel.dataset.inlineTesttype, val);
        this.render(container);
      };
    });

    container.querySelectorAll('[data-move-up]').forEach(btn => {
      btn.onclick = () => {
        DB.moveAction(btn.dataset.moveUp, 'up');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-move-down]').forEach(btn => {
      btn.onclick = () => {
        DB.moveAction(btn.dataset.moveDown, 'down');
        this.render(container);
      };
    });

    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const act = actions.find(a => a.id === btn.dataset.edit);
        if (act && !act.locked) this.openActionModal(currentFunc.id, act);
      };
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = async () => {
        const act = actions.find(a => a.id === btn.dataset.delete);
        if (!act || act.locked) return;
        const ok = await Utils.confirm(
          `Delete check "${act.description}"?`,
          'Delete Action'
        );
        if (ok) {
          DB.deleteAction(act.id);
          Utils.toast('Action deleted', 'info');
          this.render(container);
        }
      };
    });
  },

  bindFilterEvents(container) {
    const modSelect = container.querySelector('#actModFilter');
    const subSelect = container.querySelector('#actSubFilter');
    const funcSelect = container.querySelector('#actFuncFilter');

    if (modSelect) {
      modSelect.onchange = (e) => {
        this.selectedModuleId = e.target.value;
        this.selectedSubmoduleId = '';
        this.selectedFunctionalityId = '';
        this.render(container);
      };
    }
    if (subSelect) {
      subSelect.onchange = (e) => {
        this.selectedSubmoduleId = e.target.value;
        this.selectedFunctionalityId = '';
        this.render(container);
      };
    }
    if (funcSelect) {
      funcSelect.onchange = (e) => {
        this.selectedFunctionalityId = e.target.value;
        this.render(container);
      };
    }
  },

  openActionModal(functionalityId, existing = null) {
    const isEdit = Boolean(existing);
    const currentType = existing?.testType || '';

    const typeOpts = `
      <option value="" ${!currentType ? 'selected' : ''}>-- Choose Test Type (or select later before export) --</option>
      ${Defaults.TEST_TYPES.map(t =>
        `<option value="${Utils.escapeHtml(t)}" ${t === currentType ? 'selected' : ''}>${Utils.escapeHtml(t)}</option>`
      ).join('')}
    `;

    const html = `
      <div class="form-field">
        <label class="form-label" for="actTestTypeSelect">Test Type (Column A)</label>
        <span class="form-hint">Separate from the check text. Must be chosen before exporting to Excel.</span>
        <select id="actTestTypeSelect" name="testType" class="form-select">${typeOpts}</select>
      </div>
      <div class="form-field">
        <label class="form-label" for="actDescInput">Action / Check Text (Column C) *</label>
        <span class="form-hint">Inserted before the locked final GUI check ("Verify the GUI satisfies the requirements").</span>
        <textarea
          id="actDescInput"
          name="description"
          class="form-textarea"
          required
          placeholder="Enter the check description"
        >${Utils.escapeHtml(existing?.description || '')}</textarea>
        <div class="error-msg">Action / check text is required.</div>
      </div>
      <div class="form-field">
        <label class="form-label" for="actExpectedInput">Expected Result (Column D — Optional)</label>
        <textarea
          id="actExpectedInput"
          name="expectedResult"
          class="form-textarea"
          placeholder="Optional expected result"
        >${Utils.escapeHtml(existing?.expectedResult || '')}</textarea>
      </div>
    `;

    Utils.openModal(
      isEdit ? 'Edit Action (Check)' : 'Add Action (Check)',
      html,
      (form) => {
        const description = form.elements.description.value.trim();
        const testType = form.elements.testType.value;
        const expectedResult = form.elements.expectedResult.value.trim();
        if (!description) return false;
        DB.saveAction({
          id: existing?.id,
          functionalityId,
          testType,
          description,
          expectedResult
        });
        Utils.toast(isEdit ? 'Action updated' : 'Action added before locked GUI check', 'success');
        this.render(document.getElementById('pageBody'));
        return true;
      },
      isEdit ? 'Save Changes' : 'Add Action'
    );
  }
};
