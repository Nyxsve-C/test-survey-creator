// Module 1: Dashboard View
window.Views = window.Views || {};

window.Views.dashboard = {
  render(container) {
    App.setHeader(
      'Dashboard',
      'Overview of your functional testing decomposition & Test Survey readiness',
      `<button type="button" class="btn btn-secondary" onclick="App.navigate('projects')">Manage Projects</button>
       <button type="button" class="btn btn-primary" onclick="App.navigate('survey')">Go to Test Survey ★</button>`
    );

    const activeProject = DB.getActiveProject();
    const stats = DB.getStats(activeProject?.id);

    if (!activeProject) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <h3>Welcome to TestSurvey Builder</h3>
            <p>Start by creating a project to decompose your application into Modules, Submodules, Functionalities, and Actions.</p>
            <button type="button" class="btn btn-primary" id="dashNewProjBtn">+ Create First Project</button>
          </div>
        </div>
      `;
      container.querySelector('#dashNewProjBtn').onclick = () => {
        Views.projects.openProjectModal();
      };
      return;
    }

    const missingBanner = stats.missingTestTypeCount > 0
      ? `<div class="alert alert-warning">
          <div>
            <strong>${stats.missingTestTypeCount} action(s)</strong> in project <strong>${Utils.escapeHtml(activeProject.name)}</strong> do not have a Test Type selected yet.
            You must select a Test Type from the dropdown before exporting the Test Survey.
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="App.navigate('actions')">Assign Test Types</button>
        </div>`
      : (stats.actions > 0
          ? `<div class="alert alert-success">
              <div>All <strong>${stats.actions} action(s)</strong> have a Test Type assigned and every functionality ends with the locked GUI check. Ready to export!</div>
              <button type="button" class="btn btn-primary btn-sm" onclick="App.navigate('survey')">Export Excel</button>
            </div>`
          : '');

    const modules = DB.getModules(activeProject.id);

    container.innerHTML = `
      ${missingBanner}

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Active Project</span>
          <span class="stat-value" style="font-size:1.25rem;">${Utils.escapeHtml(activeProject.name)}</span>
          <span class="stat-meta">${stats.totalProjects} total project(s)</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Modules (Sheet Tabs)</span>
          <span class="stat-value">${stats.modules}</span>
          <span class="stat-meta"><a href="#" onclick="App.navigate('modules');return false;">Manage Modules →</a></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Submodules (Colored Rows)</span>
          <span class="stat-value">${stats.submodules}</span>
          <span class="stat-meta"><a href="#" onclick="App.navigate('submodules');return false;">Manage Submodules →</a></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Functionalities</span>
          <span class="stat-value">${stats.functionalities}</span>
          <span class="stat-meta"><a href="#" onclick="App.navigate('functionalities');return false;">Manage Functionalities →</a></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Actions (Checks)</span>
          <span class="stat-value">${stats.actions}</span>
          <span class="stat-meta">${stats.missingTestTypeCount} missing Test Type</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">4-Step Training Workflow</h2>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Training Task</th>
                <th>Excel Output Mapping</th>
                <th>Current Count</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="badge badge-teal">Step 1</span></td>
                <td>Decompose app into testing <strong>Modules</strong> &amp; <strong>Submodules</strong></td>
                <td>Each Module = 1 Sheet Tab; Each Submodule = Light-Teal Header Row</td>
                <td>${stats.modules} module(s), ${stats.submodules} submodule(s)</td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="App.navigate('modules')">Modules</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="App.navigate('submodules')">Submodules</button>
                </td>
              </tr>
              <tr>
                <td><span class="badge badge-teal">Step 2</span></td>
                <td>Decompose each submodule into <strong>Functionalities</strong> (by Element Type)</td>
                <td>Column B (Functionality name on first row of group)</td>
                <td>${stats.functionalities} functionality(ies)</td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="App.navigate('functionalities')">Functionalities</button>
                </td>
              </tr>
              <tr>
                <td><span class="badge badge-teal">Step 3</span></td>
                <td>Review auto-generated <strong>Actions</strong> (checks), select <strong>Test Type</strong>, add custom checks</td>
                <td>Column A (Test Type), Column C (Actions), Column D (Expected Result)</td>
                <td>${stats.actions} action(s)</td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="App.navigate('actions')">Actions</button>
                </td>
              </tr>
              <tr>
                <td><span class="badge badge-submod">Step 4 ★</span></td>
                <td>Validate &amp; Export the <strong>Test Survey</strong> Excel document</td>
                <td>Formatted <code>.xlsx</code> workbook matching template</td>
                <td>${ modules.length > 0 && stats.missingTestTypeCount === 0 && stats.functionalities > 0 ? '<span class="badge badge-success">Ready</span>' : '<span class="badge badge-warning">In Progress</span>' }</td>
                <td>
                  <button type="button" class="btn btn-primary btn-sm" onclick="App.navigate('survey')">Open Test Survey</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
