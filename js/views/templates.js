// Module 7: Element-Type Templates View (Seeded from default_checks.md)
window.Views = window.Views || {};

window.Views.templates = {
  selectedElementType: 'Text field',

  render(container) {
    if (!Defaults.ELEMENT_TYPES.includes(this.selectedElementType)) {
      this.selectedElementType = 'Text field';
    }

    const isOther = this.selectedElementType === 'Other';

    App.setHeader(
      'Element-Type Templates',
      'Default checks automatically created when a new functionality of this element type is added',
      !isOther
        ? `<button type="button" class="btn btn-secondary" id="resetTemplateBtn">Reset "${Utils.escapeHtml(this.selectedElementType)}" to Defaults</button>
           <button type="button" class="btn btn-primary" id="newTemplateCheckBtn">+ Add Default Check</button>`
        : ''
    );

    const elTabsHtml = Defaults.ELEMENT_TYPES.map(t => {
      const count = DB.getTemplateChecks(t).length;
      const activeClass = t === this.selectedElementType ? 'btn-primary' : 'btn-secondary';
      return `<button type="button" class="btn ${activeClass} btn-sm" data-el-tab="${Utils.escapeHtml(t)}">
        ${Utils.escapeHtml(t)} (${count})
      </button>`;
    }).join('');

    const checks = DB.getTemplateChecks(this.selectedElementType);

    const guiRuleNotice = `
      <div class="alert alert-info">
        <div>
          <strong>Automatic GUI Rule:</strong> Every functionality (including <strong>Other</strong>) automatically receives the locked final check
          <code>AT — "Verify the GUI satisfies the requirements"</code> as its last action. Default checks below are created without a Test Type so the tester chooses the Test Type from the dropdown.
        </div>
      </div>
    `;

    let bodyContent = '';
    if (isOther) {
      bodyContent = `
        <div class="card">
          <div class="empty-state">
            <h3>"Other" Element Type Has No Default Checks</h3>
            <p>When you create a functionality with type <strong>Other</strong>, only the locked final GUI check (<code>AT — Verify the GUI satisfies the requirements</code>) is created automatically, and you can add custom checks in the Actions view.</p>
          </div>
        </div>
      `;
    } else if (checks.length === 0) {
      bodyContent = `
        <div class="card">
          <div class="empty-state">
            <h3>No Default Checks for "${Utils.escapeHtml(this.selectedElementType)}"</h3>
            <p>Add a default check or reset to the seeded checks from <code>default_checks.md</code>.</p>
          </div>
        </div>
      `;
    } else {
      const rowsHtml = checks.map((c, idx) => `
        <tr>
          <td style="width:60px;">${idx + 1}</td>
          <td>${Utils.escapeHtml(c.description)}</td>
          <td>${c.expectedResult ? Utils.escapeHtml(c.expectedResult) : '<span style="color:var(--text-muted);font-size:0.8rem;">(Optional — blank)</span>'}</td>
          <td style="width:140px;">
            <div class="table-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-edit-tpl="${c.id}">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-del-tpl="${c.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');

      bodyContent = `
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Default Check / Action Text (Col C)</th>
                <th>Default Expected Result (Col D — Optional)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              <tr class="row-locked">
                <td>${checks.length + 1}</td>
                <td>
                  ${Utils.escapeHtml(Defaults.GUI_CHECK.description)}
                  <span class="badge badge-locked" style="margin-left:0.5rem;">Locked Final GUI Check (AT)</span>
                </td>
                <td><span style="color:var(--text-muted);font-size:0.8rem;">(Optional — blank)</span></td>
                <td><span style="font-size:0.78rem;color:var(--text-muted);">Auto-appended</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="filter-bar">
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;align-items:center;">
          <span style="font-size:0.85rem;font-weight:700;color:var(--teal-dark);margin-right:0.25rem;">Element Type:</span>
          ${elTabsHtml}
        </div>
      </div>
      ${guiRuleNotice}
      ${bodyContent}
    `;

    container.querySelectorAll('[data-el-tab]').forEach(btn => {
      btn.onclick = () => {
        this.selectedElementType = btn.dataset.elTab;
        this.render(container);
      };
    });

    const addBtn = document.getElementById('newTemplateCheckBtn');
    if (addBtn) {
      addBtn.onclick = () => this.openTemplateCheckModal(this.selectedElementType);
    }

    const resetBtn = document.getElementById('resetTemplateBtn');
    if (resetBtn) {
      resetBtn.onclick = async () => {
        const ok = await Utils.confirm(
          `Reset "${this.selectedElementType}" default checks back to the original list from default_checks.md?`,
          'Reset Element Template'
        );
        if (ok) {
          DB.resetElementTemplate(this.selectedElementType);
          Utils.toast(`Reset "${this.selectedElementType}" template to defaults`, 'info');
          this.render(container);
        }
      };
    }

    container.querySelectorAll('[data-edit-tpl]').forEach(btn => {
      btn.onclick = () => {
        const item = checks.find(c => c.id === btn.dataset.editTpl);
        if (item) this.openTemplateCheckModal(this.selectedElementType, item);
      };
    });

    container.querySelectorAll('[data-del-tpl]').forEach(btn => {
      btn.onclick = async () => {
        const item = checks.find(c => c.id === btn.dataset.delTpl);
        if (!item) return;
        const ok = await Utils.confirm(
          `Remove "${item.description}" from the "${this.selectedElementType}" template?`,
          'Delete Template Check'
        );
        if (ok) {
          DB.deleteTemplateCheck(this.selectedElementType, item.id);
          Utils.toast('Template check removed', 'info');
          this.render(container);
        }
      };
    });
  },

  openTemplateCheckModal(elementType, existing = null) {
    const isEdit = Boolean(existing);
    const html = `
      <div class="form-field">
        <label class="form-label" for="tplDescInput">Check / Action Text *</label>
        <span class="form-hint">Copied as-is into new "${Utils.escapeHtml(elementType)}" functionalities (element name is not inserted).</span>
        <textarea
          id="tplDescInput"
          name="description"
          class="form-textarea"
          required
          placeholder="Enter default check text"
        >${Utils.escapeHtml(existing?.description || '')}</textarea>
        <div class="error-msg">Check text is required.</div>
      </div>
      <div class="form-field">
        <label class="form-label" for="tplExpInput">Default Expected Result (Optional)</label>
        <textarea
          id="tplExpInput"
          name="expectedResult"
          class="form-textarea"
          placeholder="Optional expected result"
        >${Utils.escapeHtml(existing?.expectedResult || '')}</textarea>
      </div>
    `;

    Utils.openModal(
      isEdit ? `Edit "${elementType}" Default Check` : `Add "${elementType}" Default Check`,
      html,
      (form) => {
        const description = form.elements.description.value.trim();
        const expectedResult = form.elements.expectedResult.value.trim();
        if (!description) return false;
        if (isEdit) {
          DB.updateTemplateCheck(elementType, existing.id, { description, expectedResult });
          Utils.toast('Template check updated', 'success');
        } else {
          DB.addTemplateCheck(elementType, { description, expectedResult });
          Utils.toast('Default check added to template', 'success');
        }
        this.render(document.getElementById('pageBody'));
        return true;
      },
      isEdit ? 'Save Changes' : 'Add Default Check'
    );
  }
};
