// Module 8: Test Survey View ★ — Complex Validation Engine, Config Panel, Live Preview & ExcelJS Export
window.Views = window.Views || {};

window.Views.survey = {
  selectedModuleIds: null,
  selectedTestTypes: null,
  includeExpectedResult: true,
  customFilename: '',
  previewActiveModuleId: '',

  initConfigForProject(project) {
    const modules = DB.getModules(project.id);
    const validIds = new Set(modules.map(m => m.id));

    if (!Array.isArray(this.selectedModuleIds) || this.selectedModuleIds.ProjectId !== project.id) {
      this.selectedModuleIds = modules.map(m => m.id);
      this.selectedModuleIds.ProjectId = project.id;
    } else {
      const filtered = this.selectedModuleIds.filter(id => validIds.has(id));
      filtered.ProjectId = project.id;
      this.selectedModuleIds = filtered;
    }

    if (!Array.isArray(this.selectedTestTypes)) {
      this.selectedTestTypes = [...Defaults.TEST_TYPES];
    }

    if (!this.customFilename || this._lastFilenameProjectId !== project.id) {
      this.customFilename = `Test Survey - ${project.name}`;
      this._lastFilenameProjectId = project.id;
    }

    if (!this.previewActiveModuleId || !this.selectedModuleIds.includes(this.previewActiveModuleId)) {
      this.previewActiveModuleId = this.selectedModuleIds[0] || modules[0]?.id || '';
    }
  },

  // 1. Validation Engine
  runValidation(project, selectedModIds) {
    const errors = [];
    const warnings = [];
    const passes = [];

    if (!project) {
      errors.push({
        text: 'No active project is selected.',
        actionLabel: 'Select Project',
        onClick: () => App.navigate('projects')
      });
      return { errors, warnings, passes, canExport: false };
    }

    passes.push({ text: `Active project selected: "${project.name}"` });

    const allModules = DB.getModules(project.id);
    if (allModules.length === 0) {
      errors.push({
        text: 'Project has 0 modules. Add at least one module.',
        actionLabel: 'Add Module',
        onClick: () => App.navigate('modules')
      });
      return { errors, warnings, passes, canExport: false };
    }

    const selectedModules = allModules.filter(m => selectedModIds.includes(m.id));
    if (selectedModules.length === 0) {
      errors.push({
        text: 'No modules are selected for export. Check at least one module in the configuration panel.'
      });
      return { errors, warnings, passes, canExport: false };
    }

    passes.push({ text: `${selectedModules.length} of ${allModules.length} module(s) selected for export.` });

    let totalFunctionalities = 0;
    let totalActions = 0;
    const missingTypeFuncs = [];
    let missingTypeActionCount = 0;
    const guiRuleErrors = [];

    for (const mod of selectedModules) {
      const submodules = DB.getSubmodules(mod.id);
      if (submodules.length === 0) {
        warnings.push({
          text: `Module "${mod.name}" has 0 submodules.`,
          actionLabel: 'Add Submodule',
          onClick: () => {
            Views.submodules.selectedModuleId = mod.id;
            App.navigate('submodules');
          }
        });
      }

      for (const sub of submodules) {
        const funcs = DB.getFunctionalities(sub.id);
        if (funcs.length === 0) {
          warnings.push({
            text: `Submodule "${sub.name}" (in "${mod.name}") has 0 functionalities.`,
            actionLabel: 'Add Functionality',
            onClick: () => {
              Views.functionalities.selectedModuleId = mod.id;
              Views.functionalities.selectedSubmoduleId = sub.id;
              App.navigate('functionalities');
            }
          });
        }

        for (const func of funcs) {
          totalFunctionalities++;
          const actions = DB.getActions(func.id);
          totalActions += actions.length;

          if (actions.length === 0) {
            guiRuleErrors.push({
              func,
              mod,
              sub,
              reason: `Functionality "${func.name}" has 0 actions.`
            });
          } else if (!func.skipGuiCheck) {
            const lastAct = actions[actions.length - 1];
            if (
              lastAct.description !== Defaults.GUI_CHECK.description ||
              lastAct.testType !== Defaults.GUI_CHECK.testType
            ) {
              guiRuleErrors.push({
                func,
                mod,
                sub,
                reason: `Functionality "${func.name}" does not end with the mandatory AT GUI check.`
              });
            }
          }

          const missingInFunc = actions.filter(a => !a.testType);
          if (missingInFunc.length > 0) {
            missingTypeActionCount += missingInFunc.length;
            missingTypeFuncs.push({
              func,
              mod,
              sub,
              count: missingInFunc.length
            });
          }
        }
      }
    }

    if (totalFunctionalities === 0) {
      errors.push({
        text: 'Selected module(s) contain 0 functionalities. Add at least one functionality.',
        actionLabel: 'Go to Functionalities',
        onClick: () => App.navigate('functionalities')
      });
    } else {
      passes.push({ text: `${totalFunctionalities} functionality(ies) and ${totalActions} total action(s) found.` });
    }

    if (guiRuleErrors.length > 0) {
      guiRuleErrors.forEach(item => {
        errors.push({
          text: item.reason,
          actionLabel: 'Fix Actions',
          onClick: () => {
            Views.actions.selectedModuleId = item.mod.id;
            Views.actions.selectedSubmoduleId = item.sub.id;
            Views.actions.selectedFunctionalityId = item.func.id;
            App.navigate('actions');
          }
        });
      });
    } else if (totalFunctionalities > 0) {
      passes.push({
        text: 'Every functionality ends with the locked GUI check (AT — "Verify the GUI satisfies the requirements").'
      });
    }

    if (missingTypeActionCount > 0) {
      const firstMissing = missingTypeFuncs[0];
      errors.push({
        text: `${missingTypeActionCount} action(s) across ${missingTypeFuncs.length} functionality(ies) do not have a Test Type selected. Export is blocked until all actions have a Test Type.`,
        actionLabel: `Assign in "${firstMissing.func.name}"`,
        onClick: () => {
          Views.actions.selectedModuleId = firstMissing.mod.id;
          Views.actions.selectedSubmoduleId = firstMissing.sub.id;
          Views.actions.selectedFunctionalityId = firstMissing.func.id;
          App.navigate('actions');
        }
      });
    } else if (totalActions > 0) {
      passes.push({
        text: 'All actions have a valid Test Type selected from the dropdown.'
      });
    }

    const canExport = errors.length === 0 && totalFunctionalities > 0;
    return { errors, warnings, passes, canExport };
  },

  render(container) {
    const project = DB.getActiveProject();
    if (!project) {
      App.setHeader('Test Survey ★', 'Validate and export your Test Survey Excel workbook');
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>No Active Project</h3>
            <p>Select or create a project first to preview and export its Test Survey Excel file.</p>
            <button type="button" class="btn btn-primary" onclick="App.navigate('projects')">Go to Projects</button>
          </div>
        </div>
      `;
      return;
    }

    this.initConfigForProject(project);
    const modules = DB.getModules(project.id);
    const validation = this.runValidation(project, this.selectedModuleIds);

    App.setHeader(
      'Test Survey ★',
      `Validate hierarchy rules, preview sheets, and export "${project.name}" to a formatted Excel (.xlsx) file`,
      `<button type="button" class="btn btn-primary" id="headerExportExcelBtn" ${!validation.canExport ? 'disabled' : ''}>
        Export to Excel (.xlsx) ↓
      </button>`
    );

    const validationItemsHtml = [
      ...validation.errors.map((err, i) => `
        <li class="validation-item fail">
          <span>❌ <strong>Error:</strong> ${Utils.escapeHtml(err.text)}</span>
          ${err.actionLabel ? `<button type="button" class="btn btn-danger btn-sm" data-err-idx="${i}">${Utils.escapeHtml(err.actionLabel)} →</button>` : ''}
        </li>
      `),
      ...validation.warnings.map((warn, i) => `
        <li class="validation-item warn">
          <span>⚠️ <strong>Warning:</strong> ${Utils.escapeHtml(warn.text)}</span>
          ${warn.actionLabel ? `<button type="button" class="btn btn-secondary btn-sm" data-warn-idx="${i}">${Utils.escapeHtml(warn.actionLabel)} →</button>` : ''}
        </li>
      `),
      ...validation.passes.map(pass => `
        <li class="validation-item pass">
          <span>✅ ${Utils.escapeHtml(pass.text)}</span>
        </li>
      `)
    ].join('');

    const modCheckboxesHtml = modules.length === 0
      ? '<span style="color:var(--text-muted);font-size:0.85rem;">No modules in project</span>'
      : modules.map(m => `
          <label class="checkbox-label">
            <input type="checkbox" data-mod-check="${m.id}" ${this.selectedModuleIds.includes(m.id) ? 'checked' : ''}>
            ${Utils.escapeHtml(m.name)}
          </label>
        `).join('');

    const typeCheckboxesHtml = Defaults.TEST_TYPES.map(t => `
      <label class="checkbox-label">
        <input type="checkbox" data-type-check="${Utils.escapeHtml(t)}" ${this.selectedTestTypes.includes(t) ? 'checked' : ''}>
        ${Utils.escapeHtml(t)}
      </label>
    `).join('');

    const previewSectionHtml = this.buildLivePreviewHtml(modules);

    container.innerHTML = `
      <div class="survey-grid">
        <!-- Validation Engine Card -->
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <h2 class="card-title">1. Validation Status</h2>
            ${validation.canExport
              ? '<span class="badge badge-success">Ready to Export</span>'
              : '<span class="badge badge-warning">Export Blocked — Resolve Errors</span>'}
          </div>
          <ul class="validation-list">${validationItemsHtml}</ul>
        </div>

        <!-- Export Configuration Card -->
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <h2 class="card-title">2. Export Configuration</h2>
          </div>

          <div class="form-field">
            <span class="form-label">Modules to Include (Each Module = 1 Sheet Tab)</span>
            <div class="checkbox-list">${modCheckboxesHtml}</div>
          </div>

          <div class="form-field">
            <span class="form-label">Filter by Test Type</span>
            <div class="checkbox-list">${typeCheckboxesHtml}</div>
          </div>

          <div class="form-field">
            <label class="checkbox-label" style="font-weight:600;">
              <input type="checkbox" id="toggleExpectedCol" ${this.includeExpectedResult ? 'checked' : ''}>
              Include "Expected Result" column (Column D)
            </label>
          </div>

          <div class="form-field">
            <label class="form-label" for="exportFilenameInput">Workbook Filename (.xlsx)</label>
            <input
              type="text"
              id="exportFilenameInput"
              class="form-input"
              value="${Utils.escapeHtml(this.customFilename)}"
              placeholder="Test Survey - ${Utils.escapeHtml(project.name)}"
            >
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.6rem;margin-top:1rem;">
            <button type="button" class="btn btn-primary" id="cardExportExcelBtn" ${!validation.canExport ? 'disabled' : ''}>
              Export to Excel (.xlsx) ↓
            </button>
          </div>
        </div>
      </div>

      <!-- Live Excel Preview Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">3. Live Excel Output Preview</h2>
            <span style="font-size:0.82rem;color:var(--text-muted);">
              Mirrors the 4-column template: Submodules are colored rows; Functionalities are vertically grouped; Test Types can also be updated directly below.
            </span>
          </div>
        </div>
        ${previewSectionHtml}
      </div>
    `;

    // Bind validation action buttons
    container.querySelectorAll('[data-err-idx]').forEach(btn => {
      const idx = Number(btn.dataset.errIdx);
      if (validation.errors[idx]?.onClick) {
        btn.onclick = validation.errors[idx].onClick;
      }
    });
    container.querySelectorAll('[data-warn-idx]').forEach(btn => {
      const idx = Number(btn.dataset.warnIdx);
      if (validation.warnings[idx]?.onClick) {
        btn.onclick = validation.warnings[idx].onClick;
      }
    });

    // Bind config controls
    container.querySelectorAll('[data-mod-check]').forEach(cb => {
      cb.onchange = () => {
        const id = cb.dataset.modCheck;
        if (cb.checked) {
          if (!this.selectedModuleIds.includes(id)) this.selectedModuleIds.push(id);
        } else {
          this.selectedModuleIds = this.selectedModuleIds.filter(x => x !== id);
        }
        this.selectedModuleIds.ProjectId = project.id;
        if (!this.selectedModuleIds.includes(this.previewActiveModuleId)) {
          this.previewActiveModuleId = this.selectedModuleIds[0] || '';
        }
        this.render(container);
      };
    });

    container.querySelectorAll('[data-type-check]').forEach(cb => {
      cb.onchange = () => {
        const t = cb.dataset.typeCheck;
        if (cb.checked) {
          if (!this.selectedTestTypes.includes(t)) this.selectedTestTypes.push(t);
        } else {
          this.selectedTestTypes = this.selectedTestTypes.filter(x => x !== t);
        }
        this.render(container);
      };
    });

    const expToggle = container.querySelector('#toggleExpectedCol');
    if (expToggle) {
      expToggle.onchange = (e) => {
        this.includeExpectedResult = e.target.checked;
        this.render(container);
      };
    }

    const fnInput = container.querySelector('#exportFilenameInput');
    if (fnInput) {
      fnInput.oninput = (e) => {
        this.customFilename = e.target.value;
      };
    }

    // Sheet tab switching in preview
    container.querySelectorAll('[data-preview-tab]').forEach(tab => {
      tab.onclick = () => {
        this.previewActiveModuleId = tab.dataset.previewTab;
        this.render(container);
      };
    });

    // Inline test type change directly inside live preview
    container.querySelectorAll('[data-preview-testtype]').forEach(sel => {
      sel.onchange = (e) => {
        DB.updateActionTestType(sel.dataset.previewTesttype, e.target.value);
        Utils.toast('Test Type updated', 'success');
        this.render(container);
      };
    });

    // Export buttons
    const triggerExport = () => {
      if (!validation.canExport) {
        Utils.toast('Please resolve validation errors before exporting', 'error');
        return;
      }
      this.exportToExcel(project, modules.filter(m => this.selectedModuleIds.includes(m.id)));
    };

    const hBtn = document.getElementById('headerExportExcelBtn');
    const cBtn = document.getElementById('cardExportExcelBtn');
    if (hBtn) hBtn.onclick = triggerExport;
    if (cBtn) cBtn.onclick = triggerExport;
  },

  buildLivePreviewHtml(allModules) {
    const selectedModules = allModules.filter(m => this.selectedModuleIds.includes(m.id));
    if (selectedModules.length === 0) {
      return `<div class="empty-state"><p>Select at least one module above to preview its worksheet.</p></div>`;
    }

    const activeMod = selectedModules.find(m => m.id === this.previewActiveModuleId) || selectedModules[0];
    this.previewActiveModuleId = activeMod.id;

    const tabsHtml = selectedModules.map(m => `
      <button type="button" class="sheet-tab ${m.id === activeMod.id ? 'active' : ''}" data-preview-tab="${m.id}">
        📄 ${Utils.escapeHtml(m.name)}
      </button>
    `).join('');

    const submodules = DB.getSubmodules(activeMod.id);
    const colCount = this.includeExpectedResult ? 4 : 3;

    let bodyRowsHtml = '';

    for (const sub of submodules) {
      // Colored submodule row matching the template screenshot
      bodyRowsHtml += `
        <tr class="excel-row-submod">
          <td></td>
          <td>${Utils.escapeHtml(sub.name)}</td>
          <td></td>
          ${this.includeExpectedResult ? '<td></td>' : ''}
        </tr>
      `;

      const funcs = DB.getFunctionalities(sub.id);
      for (const func of funcs) {
        const allActions = DB.getActions(func.id);
        // Include actions whose testType is in selectedTestTypes OR whose testType is blank (so user can see & fix blank ones)
        const visibleActions = allActions.filter(a => !a.testType || this.selectedTestTypes.includes(a.testType));

        visibleActions.forEach((act, idx) => {
          const funcCellHtml = idx === 0
            ? `<td class="excel-col-func" rowspan="${visibleActions.length}">${Utils.escapeHtml(func.name)}</td>`
            : '';

          const typeCellInner = act.locked
            ? `<span class="excel-dropdown-pill"><span>${Utils.escapeHtml(act.testType)}</span><span>▾</span></span>`
            : `<select class="test-type-select ${!act.testType ? 'missing' : ''}" data-preview-testtype="${act.id}" style="width:100%;font-size:0.78rem;padding:0.18rem 0.35rem;">
                <option value="" ${!act.testType ? 'selected' : ''}>-- Choose * --</option>
                ${Defaults.TEST_TYPES.map(t =>
                  `<option value="${Utils.escapeHtml(t)}" ${act.testType === t ? 'selected' : ''}>${Utils.escapeHtml(t)}</option>`
                ).join('')}
              </select>`;

          bodyRowsHtml += `
            <tr>
              <td class="excel-col-testtype">${typeCellInner}</td>
              ${funcCellHtml}
              <td class="excel-col-actions">${Utils.escapeHtml(act.description)}</td>
              ${this.includeExpectedResult ? `<td class="excel-col-expected">${Utils.escapeHtml(act.expectedResult || '')}</td>` : ''}
            </tr>
          `;
        });
      }
    }

    if (!bodyRowsHtml) {
      bodyRowsHtml = `
        <tr>
          <td colspan="${colCount}" style="text-align:center;padding:1.5rem;color:var(--text-muted);">
            This module has no submodules or actions yet.
          </td>
        </tr>
      `;
    }

    return `
      <div class="sheet-tabs">${tabsHtml}</div>
      <div class="excel-preview-wrap">
        <table class="excel-table">
          <thead>
            <tr>
              <th style="width:140px;">Test Type</th>
              <th style="width:220px;">Functionality</th>
              <th>Actions</th>
              ${this.includeExpectedResult ? '<th style="width:280px;">Expected Result</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${bodyRowsHtml}
          </tbody>
        </table>
      </div>
    `;
  },

  // 4. ExcelJS Workbook Builder & Download
  async exportToExcel(project, selectedModules) {
    if (typeof ExcelJS === 'undefined') {
      Utils.toast('ExcelJS library failed to load. Check your internet connection.', 'error');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'TestSurvey Builder';
      workbook.created = new Date();

      const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF386B78' } };
      const submodFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7FAEC0' } };
      const headerFont = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      const submodFont = { name: 'Arial', size: 10, bold: false, color: { argb: 'FF0F252E' } };
      const dataFont = { name: 'Arial', size: 10, color: { argb: 'FF1C2B30' } };
      const thinBorder = {
        top: { style: 'thin', color: { argb: 'FF90A4AE' } },
        left: { style: 'thin', color: { argb: 'FF90A4AE' } },
        bottom: { style: 'thin', color: { argb: 'FF90A4AE' } },
        right: { style: 'thin', color: { argb: 'FF90A4AE' } }
      };

      const usedSheetNames = new Set();

      for (const mod of selectedModules) {
        // Sanitize worksheet name for Excel (max 31 chars, no invalid chars)
        let baseName = (mod.name || 'Module').replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 31) || 'Module';
        let sheetName = baseName;
        let counter = 2;
        while (usedSheetNames.has(sheetName.toLowerCase())) {
          const suffix = ` (${counter++})`;
          sheetName = baseName.slice(0, 31 - suffix.length) + suffix;
        }
        usedSheetNames.add(sheetName.toLowerCase());

        const sheet = workbook.addWorksheet(sheetName, {
          views: [{ state: 'frozen', ySplit: 1 }]
        });

        const columns = [
          { key: 'testType', width: 16 },
          { key: 'functionality', width: 26 },
          { key: 'actions', width: 58 }
        ];
        if (this.includeExpectedResult) {
          columns.push({ key: 'expectedResult', width: 42 });
        }
        sheet.columns = columns;

        const colCount = columns.length;

        // Row 1: Column Headers
        const headerValues = ['Test Type', 'Functionality', 'Actions'];
        if (this.includeExpectedResult) headerValues.push('Expected Result');

        const headerRow = sheet.addRow(headerValues);
        headerRow.height = 24;
        for (let c = 1; c <= colCount; c++) {
          const cell = headerRow.getCell(c);
          cell.fill = headerFill;
          cell.font = headerFont;
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = thinBorder;
        }

        const submodules = DB.getSubmodules(mod.id);
        const validationFormula = `"${Defaults.TEST_TYPES.join(',')}"`;

        for (const sub of submodules) {
          // Submodule Colored Row (matches template image: colored across A-D, title in column B)
          const subRowValues = ['', sub.name, ''];
          if (this.includeExpectedResult) subRowValues.push('');
          const subRow = sheet.addRow(subRowValues);
          subRow.height = 19;

          for (let c = 1; c <= colCount; c++) {
            const cell = subRow.getCell(c);
            cell.fill = submodFill;
            cell.font = submodFont;
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = thinBorder;
          }

          const funcs = DB.getFunctionalities(sub.id);
          for (const func of funcs) {
            const actions = DB.getActions(func.id).filter(a => this.selectedTestTypes.includes(a.testType));
            if (actions.length === 0) continue;

            const startRowNumber = sheet.rowCount + 1;

            actions.forEach((act, idx) => {
              const rowVals = [
                act.testType,
                idx === 0 ? func.name : '',
                act.description
              ];
              if (this.includeExpectedResult) {
                rowVals.push(act.expectedResult || '');
              }

              const r = sheet.addRow(rowVals);
              r.getCell(1).font = dataFont;
              r.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
              r.getCell(1).border = thinBorder;
              r.getCell(1).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [validationFormula]
              };

              r.getCell(2).font = dataFont;
              r.getCell(2).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
              r.getCell(2).border = thinBorder;

              r.getCell(3).font = dataFont;
              r.getCell(3).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
              r.getCell(3).border = thinBorder;

              if (this.includeExpectedResult) {
                r.getCell(4).font = dataFont;
                r.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                r.getCell(4).border = thinBorder;
              }
            });

            const endRowNumber = sheet.rowCount;
            if (endRowNumber > startRowNumber) {
              // Vertically merge Functionality column (Column B) for this functionality's checks
              sheet.mergeCells(startRowNumber, 2, endRowNumber, 2);
            }
          }
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const baseFile = (this.customFilename || `Test Survey - ${project.name}`).trim().replace(/\.xlsx$/i, '');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFile}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      Utils.toast(`Exported "${baseFile}.xlsx" successfully!`, 'success');
    } catch (err) {
      console.error('Excel export failed:', err);
      Utils.toast('Failed to generate Excel file: ' + (err.message || err), 'error');
    }
  }
};
