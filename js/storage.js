// LocalStorage Data Layer with Cascade Deletes, Element Templates, and Locked GUI Check Enforcement
window.DB = (() => {
  const STORAGE_KEY = 'tsb_data_v1';

  function buildInitialTemplates() {
    const templates = {};
    for (const elType of Defaults.ELEMENT_TYPES) {
      const list = Defaults.ELEMENT_TEMPLATES[elType] || [];
      templates[elType] = list.map((desc, idx) => ({
        id: 'tpl-' + elType.toLowerCase().replace(/\s+/g, '-') + '-' + (idx + 1),
        description: desc,
        expectedResult: ''
      }));
    }
    return templates;
  }

  function loadRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = {
          activeProjectId: '',
          projects: [],
          modules: [],
          submodules: [],
          functionalities: [],
          actions: [],
          elementTemplates: buildInitialTemplates()
        };
        saveRaw(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      parsed.projects = parsed.projects || [];
      parsed.modules = parsed.modules || [];
      parsed.submodules = parsed.submodules || [];
      parsed.functionalities = parsed.functionalities || [];
      parsed.actions = parsed.actions || [];
      if (!parsed.elementTemplates) {
        parsed.elementTemplates = buildInitialTemplates();
      } else {
        for (const elType of Defaults.ELEMENT_TYPES) {
          if (!Array.isArray(parsed.elementTemplates[elType])) {
            parsed.elementTemplates[elType] = buildInitialTemplates()[elType] || [];
          }
        }
      }
      return parsed;
    } catch (e) {
      console.error('Failed to read localStorage:', e);
      return {
        activeProjectId: '',
        projects: [],
        modules: [],
        submodules: [],
        functionalities: [],
        actions: [],
        elementTemplates: buildInitialTemplates()
      };
    }
  }

  function saveRaw(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (window.App && typeof window.App.updateNavBadges === 'function') {
      window.App.updateNavBadges();
    }
  }

  function sortByOrder(arr) {
    return [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  // Active Project
  function getActiveProjectId() {
    const state = loadRaw();
    if (state.activeProjectId && state.projects.some(p => p.id === state.activeProjectId)) {
      return state.activeProjectId;
    }
    if (state.projects.length > 0) {
      state.activeProjectId = state.projects[0].id;
      saveRaw(state);
      return state.activeProjectId;
    }
    return '';
  }

  function setActiveProjectId(projectId) {
    const state = loadRaw();
    state.activeProjectId = projectId || '';
    saveRaw(state);
  }

  function getActiveProject() {
    const id = getActiveProjectId();
    if (!id) return null;
    return getProjects().find(p => p.id === id) || null;
  }

  // Projects
  function getProjects() {
    const state = loadRaw();
    return [...state.projects].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  function saveProject(project) {
    const state = loadRaw();
    const now = new Date().toISOString();
    if (project.id) {
      const idx = state.projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        state.projects[idx] = { ...state.projects[idx], name: project.name.trim(), updatedAt: now };
        saveRaw(state);
        return state.projects[idx];
      }
    }
    const created = {
      id: Utils.uuid(),
      name: project.name.trim(),
      createdAt: now,
      updatedAt: now
    };
    state.projects.push(created);
    if (!state.activeProjectId) {
      state.activeProjectId = created.id;
    }
    saveRaw(state);
    return created;
  }

  function deleteProject(projectId) {
    const state = loadRaw();
    state.projects = state.projects.filter(p => p.id !== projectId);
    state.modules = state.modules.filter(m => m.projectId !== projectId);
    state.submodules = state.submodules.filter(s => s.projectId !== projectId);
    state.functionalities = state.functionalities.filter(f => f.projectId !== projectId);
    state.actions = state.actions.filter(a => a.projectId !== projectId);
    if (state.activeProjectId === projectId) {
      state.activeProjectId = state.projects[0]?.id || '';
    }
    saveRaw(state);
  }

  // Modules
  function getModules(projectId) {
    const state = loadRaw();
    const list = projectId ? state.modules.filter(m => m.projectId === projectId) : state.modules;
    return sortByOrder(list);
  }

  function getModuleById(moduleId) {
    const state = loadRaw();
    return state.modules.find(m => m.id === moduleId) || null;
  }

  function saveModule(mod) {
    const state = loadRaw();
    if (mod.id) {
      const idx = state.modules.findIndex(m => m.id === mod.id);
      if (idx !== -1) {
        state.modules[idx] = { ...state.modules[idx], name: mod.name.trim() };
        saveRaw(state);
        return state.modules[idx];
      }
    }
    const siblings = state.modules.filter(m => m.projectId === mod.projectId);
    const maxOrder = siblings.reduce((max, m) => Math.max(max, m.order || 0), 0);
    const created = {
      id: Utils.uuid(),
      projectId: mod.projectId,
      name: mod.name.trim(),
      order: maxOrder + 1
    };
    state.modules.push(created);
    saveRaw(state);
    return created;
  }

  function moveModule(moduleId, direction) {
    const state = loadRaw();
    const target = state.modules.find(m => m.id === moduleId);
    if (!target) return;
    const siblings = sortByOrder(state.modules.filter(m => m.projectId === target.projectId));
    const idx = siblings.findIndex(m => m.id === moduleId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const temp = siblings[idx].order;
    siblings[idx].order = siblings[swapIdx].order;
    siblings[swapIdx].order = temp;
    saveRaw(state);
  }

  function deleteModule(moduleId) {
    const state = loadRaw();
    state.modules = state.modules.filter(m => m.id !== moduleId);
    state.submodules = state.submodules.filter(s => s.moduleId !== moduleId);
    state.functionalities = state.functionalities.filter(f => f.moduleId !== moduleId);
    state.actions = state.actions.filter(a => a.moduleId !== moduleId);
    saveRaw(state);
  }

  // Submodules
  function getSubmodules(moduleId) {
    const state = loadRaw();
    const list = moduleId ? state.submodules.filter(s => s.moduleId === moduleId) : state.submodules;
    return sortByOrder(list);
  }

  function getSubmodulesByProject(projectId) {
    const state = loadRaw();
    return sortByOrder(state.submodules.filter(s => s.projectId === projectId));
  }

  function getSubmoduleById(submoduleId) {
    const state = loadRaw();
    return state.submodules.find(s => s.id === submoduleId) || null;
  }

  function saveSubmodule(sub) {
    const state = loadRaw();
    const mod = state.modules.find(m => m.id === sub.moduleId);
    const projectId = sub.projectId || mod?.projectId || '';
    if (sub.id) {
      const idx = state.submodules.findIndex(s => s.id === sub.id);
      if (idx !== -1) {
        const oldModuleId = state.submodules[idx].moduleId;
        state.submodules[idx] = {
          ...state.submodules[idx],
          name: sub.name.trim(),
          moduleId: sub.moduleId,
          projectId
        };
        if (oldModuleId !== sub.moduleId) {
          state.functionalities.forEach(f => {
            if (f.submoduleId === sub.id) f.moduleId = sub.moduleId;
          });
          state.actions.forEach(a => {
            if (a.submoduleId === sub.id) a.moduleId = sub.moduleId;
          });
        }
        saveRaw(state);
        return state.submodules[idx];
      }
    }
    const siblings = state.submodules.filter(s => s.moduleId === sub.moduleId);
    const maxOrder = siblings.reduce((max, s) => Math.max(max, s.order || 0), 0);
    const created = {
      id: Utils.uuid(),
      projectId,
      moduleId: sub.moduleId,
      name: sub.name.trim(),
      order: maxOrder + 1
    };
    state.submodules.push(created);
    saveRaw(state);
    return created;
  }

  function moveSubmodule(submoduleId, direction) {
    const state = loadRaw();
    const target = state.submodules.find(s => s.id === submoduleId);
    if (!target) return;
    const siblings = sortByOrder(state.submodules.filter(s => s.moduleId === target.moduleId));
    const idx = siblings.findIndex(s => s.id === submoduleId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const temp = siblings[idx].order;
    siblings[idx].order = siblings[swapIdx].order;
    siblings[swapIdx].order = temp;
    saveRaw(state);
  }

  function deleteSubmodule(submoduleId) {
    const state = loadRaw();
    state.submodules = state.submodules.filter(s => s.id !== submoduleId);
    state.functionalities = state.functionalities.filter(f => f.submoduleId !== submoduleId);
    state.actions = state.actions.filter(a => a.submoduleId !== submoduleId);
    saveRaw(state);
  }

  // Helper: guarantee locked GUI check is present and always last for a functionality
  function normalizeFunctionalityActionsInState(state, func) {
    const list = sortByOrder(state.actions.filter(a => a.functionalityId === func.id));
    const unlocked = list.filter(a => !a.locked && !(a.description === Defaults.GUI_CHECK.description && a.testType === 'AT'));
    let lockedGui = list.find(a => a.locked) || list.find(a => a.description === Defaults.GUI_CHECK.description);

    // Reassign sequential order 1..N for unlocked actions
    unlocked.forEach((act, idx) => {
      act.order = idx + 1;
      act.locked = false;
    });

    if (!lockedGui) {
      lockedGui = {
        id: Utils.uuid(),
        projectId: func.projectId,
        moduleId: func.moduleId,
        submoduleId: func.submoduleId,
        functionalityId: func.id,
        testType: Defaults.GUI_CHECK.testType,
        description: Defaults.GUI_CHECK.description,
        expectedResult: '',
        locked: true,
        order: unlocked.length + 1
      };
      state.actions.push(lockedGui);
    } else {
      lockedGui.testType = Defaults.GUI_CHECK.testType;
      lockedGui.description = Defaults.GUI_CHECK.description;
      lockedGui.locked = true;
      lockedGui.order = unlocked.length + 1;
    }

    // Remove any duplicate locked GUI entries if any existed
    const keepIds = new Set([...unlocked.map(a => a.id), lockedGui.id]);
    state.actions = state.actions.filter(a => a.functionalityId !== func.id || keepIds.has(a.id));
  }

  // Functionalities
  function getFunctionalities(submoduleId) {
    const state = loadRaw();
    const list = submoduleId
      ? state.functionalities.filter(f => f.submoduleId === submoduleId)
      : state.functionalities;
    return sortByOrder(list);
  }

  function getFunctionalitiesByProject(projectId) {
    const state = loadRaw();
    return sortByOrder(state.functionalities.filter(f => f.projectId === projectId));
  }

  function getFunctionalitiesByModule(moduleId) {
    const state = loadRaw();
    return sortByOrder(state.functionalities.filter(f => f.moduleId === moduleId));
  }

  function getFunctionalityById(functionalityId) {
    const state = loadRaw();
    return state.functionalities.find(f => f.id === functionalityId) || null;
  }

  // Creates or updates a functionality; when creating, automatically populates default checks + locked GUI check
  function saveFunctionality(func) {
    const state = loadRaw();
    const sub = state.submodules.find(s => s.id === func.submoduleId);
    const moduleId = sub ? sub.moduleId : func.moduleId;
    const projectId = sub ? sub.projectId : func.projectId;
    const elementType = func.elementType || 'Other';

    if (func.id) {
      const idx = state.functionalities.findIndex(f => f.id === func.id);
      if (idx !== -1) {
        state.functionalities[idx] = {
          ...state.functionalities[idx],
          name: func.name.trim(),
          elementType,
          submoduleId: func.submoduleId,
          moduleId,
          projectId
        };
        state.actions.forEach(a => {
          if (a.functionalityId === func.id) {
            a.submoduleId = func.submoduleId;
            a.moduleId = moduleId;
            a.projectId = projectId;
          }
        });
        normalizeFunctionalityActionsInState(state, state.functionalities[idx]);
        saveRaw(state);
        return state.functionalities[idx];
      }
    }

    const siblings = state.functionalities.filter(f => f.submoduleId === func.submoduleId);
    const maxOrder = siblings.reduce((max, f) => Math.max(max, f.order || 0), 0);
    const created = {
      id: Utils.uuid(),
      projectId,
      moduleId,
      submoduleId: func.submoduleId,
      name: func.name.trim(),
      elementType,
      order: maxOrder + 1
    };
    state.functionalities.push(created);

    // Generate default checks for the chosen elementType (without testType, name NOT inserted in text)
    const templateChecks = state.elementTemplates[elementType] || [];
    templateChecks.forEach((tplItem, idx) => {
      state.actions.push({
        id: Utils.uuid(),
        projectId,
        moduleId,
        submoduleId: created.submoduleId,
        functionalityId: created.id,
        testType: '', // Blank by requirement: user selects from dropdown
        description: tplItem.description,
        expectedResult: tplItem.expectedResult || '',
        locked: false,
        order: idx + 1
      });
    });

    // Always append locked GUI check as the last action (even for 'Other' or 0 default checks)
    state.actions.push({
      id: Utils.uuid(),
      projectId,
      moduleId,
      submoduleId: created.submoduleId,
      functionalityId: created.id,
      testType: Defaults.GUI_CHECK.testType,
      description: Defaults.GUI_CHECK.description,
      expectedResult: '',
      locked: true,
      order: templateChecks.length + 1
    });

    saveRaw(state);
    return created;
  }

  function moveFunctionality(functionalityId, direction) {
    const state = loadRaw();
    const target = state.functionalities.find(f => f.id === functionalityId);
    if (!target) return;
    const siblings = sortByOrder(state.functionalities.filter(f => f.submoduleId === target.submoduleId));
    const idx = siblings.findIndex(f => f.id === functionalityId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const temp = siblings[idx].order;
    siblings[idx].order = siblings[swapIdx].order;
    siblings[swapIdx].order = temp;
    saveRaw(state);
  }

  function deleteFunctionality(functionalityId) {
    const state = loadRaw();
    state.functionalities = state.functionalities.filter(f => f.id !== functionalityId);
    state.actions = state.actions.filter(a => a.functionalityId !== functionalityId);
    saveRaw(state);
  }

  // Actions (Checks)
  function getActions(functionalityId) {
    const state = loadRaw();
    const list = functionalityId
      ? state.actions.filter(a => a.functionalityId === functionalityId)
      : state.actions;
    return sortByOrder(list);
  }

  function getActionsByProject(projectId) {
    const state = loadRaw();
    return sortByOrder(state.actions.filter(a => a.projectId === projectId));
  }

  function getActionsByModule(moduleId) {
    const state = loadRaw();
    return sortByOrder(state.actions.filter(a => a.moduleId === moduleId));
  }

  function saveAction(action) {
    const state = loadRaw();
    const func = state.functionalities.find(f => f.id === action.functionalityId);
    if (!func) return null;

    if (action.id) {
      const idx = state.actions.findIndex(a => a.id === action.id);
      if (idx !== -1) {
        if (state.actions[idx].locked) {
          // Locked GUI check cannot be edited
          return state.actions[idx];
        }
        state.actions[idx] = {
          ...state.actions[idx],
          testType: action.testType || '',
          description: action.description.trim(),
          expectedResult: (action.expectedResult || '').trim()
        };
        normalizeFunctionalityActionsInState(state, func);
        saveRaw(state);
        return state.actions[idx];
      }
    }

    // Insert new unlocked action before the locked GUI check
    const existingUnlocked = state.actions.filter(a => a.functionalityId === func.id && !a.locked);
    const created = {
      id: Utils.uuid(),
      projectId: func.projectId,
      moduleId: func.moduleId,
      submoduleId: func.submoduleId,
      functionalityId: func.id,
      testType: action.testType || '',
      description: action.description.trim(),
      expectedResult: (action.expectedResult || '').trim(),
      locked: false,
      order: existingUnlocked.length + 1
    };
    state.actions.push(created);
    normalizeFunctionalityActionsInState(state, func);
    saveRaw(state);
    return created;
  }

  function updateActionTestType(actionId, testType) {
    const state = loadRaw();
    const act = state.actions.find(a => a.id === actionId);
    if (!act || act.locked) return;
    act.testType = testType || '';
    saveRaw(state);
  }

  function bulkSetTestTypeForFunctionality(functionalityId, testType, onlyBlank = true) {
    const state = loadRaw();
    let count = 0;
    state.actions.forEach(a => {
      if (a.functionalityId === functionalityId && !a.locked) {
        if (!onlyBlank || !a.testType) {
          a.testType = testType;
          count++;
        }
      }
    });
    saveRaw(state);
    return count;
  }

  function moveAction(actionId, direction) {
    const state = loadRaw();
    const target = state.actions.find(a => a.id === actionId);
    if (!target || target.locked) return;
    const func = state.functionalities.find(f => f.id === target.functionalityId);
    if (!func) return;

    // Only unlocked actions can be reordered; locked GUI check always stays last
    const unlocked = sortByOrder(state.actions.filter(a => a.functionalityId === func.id && !a.locked));
    const idx = unlocked.findIndex(a => a.id === actionId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= unlocked.length) return;

    const temp = unlocked[idx].order;
    unlocked[idx].order = unlocked[swapIdx].order;
    unlocked[swapIdx].order = temp;

    normalizeFunctionalityActionsInState(state, func);
    saveRaw(state);
  }

  function deleteAction(actionId) {
    const state = loadRaw();
    const target = state.actions.find(a => a.id === actionId);
    if (!target || target.locked) return false;
    const func = state.functionalities.find(f => f.id === target.functionalityId);
    state.actions = state.actions.filter(a => a.id !== actionId);
    if (func) {
      normalizeFunctionalityActionsInState(state, func);
    }
    saveRaw(state);
    return true;
  }

  // Element Templates (7 fixed element types)
  function getElementTemplates() {
    const state = loadRaw();
    return state.elementTemplates;
  }

  function getTemplateChecks(elementType) {
    const state = loadRaw();
    return state.elementTemplates[elementType] || [];
  }

  function addTemplateCheck(elementType, { description, expectedResult }) {
    if (elementType === 'Other') return null;
    const state = loadRaw();
    const list = state.elementTemplates[elementType] || [];
    const item = {
      id: Utils.uuid(),
      description: description.trim(),
      expectedResult: (expectedResult || '').trim()
    };
    list.push(item);
    state.elementTemplates[elementType] = list;
    saveRaw(state);
    return item;
  }

  function updateTemplateCheck(elementType, checkId, { description, expectedResult }) {
    const state = loadRaw();
    const list = state.elementTemplates[elementType] || [];
    const idx = list.findIndex(c => c.id === checkId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        description: description.trim(),
        expectedResult: (expectedResult || '').trim()
      };
      saveRaw(state);
      return list[idx];
    }
    return null;
  }

  function deleteTemplateCheck(elementType, checkId) {
    const state = loadRaw();
    const list = state.elementTemplates[elementType] || [];
    state.elementTemplates[elementType] = list.filter(c => c.id !== checkId);
    saveRaw(state);
  }

  function resetElementTemplate(elementType) {
    const state = loadRaw();
    const initial = buildInitialTemplates();
    state.elementTemplates[elementType] = initial[elementType] || [];
    saveRaw(state);
  }

  // Stats for Dashboard
  function getStats(projectId) {
    const state = loadRaw();
    const pid = projectId || getActiveProjectId();
    const projModules = pid ? state.modules.filter(m => m.projectId === pid) : [];
    const projSubmodules = pid ? state.submodules.filter(s => s.projectId === pid) : [];
    const projFuncs = pid ? state.functionalities.filter(f => f.projectId === pid) : [];
    const projActions = pid ? state.actions.filter(a => a.projectId === pid) : [];
    const missingTestTypeCount = projActions.filter(a => !a.testType).length;

    return {
      totalProjects: state.projects.length,
      modules: projModules.length,
      submodules: projSubmodules.length,
      functionalities: projFuncs.length,
      actions: projActions.length,
      missingTestTypeCount
    };
  }

  return {
    getActiveProjectId,
    setActiveProjectId,
    getActiveProject,
    getProjects,
    saveProject,
    deleteProject,
    getModules,
    getModuleById,
    saveModule,
    moveModule,
    deleteModule,
    getSubmodules,
    getSubmodulesByProject,
    getSubmoduleById,
    saveSubmodule,
    moveSubmodule,
    deleteSubmodule,
    getFunctionalities,
    getFunctionalitiesByProject,
    getFunctionalitiesByModule,
    getFunctionalityById,
    saveFunctionality,
    moveFunctionality,
    deleteFunctionality,
    getActions,
    getActionsByProject,
    getActionsByModule,
    saveAction,
    updateActionTestType,
    bulkSetTestTypeForFunctionality,
    moveAction,
    deleteAction,
    getElementTemplates,
    getTemplateChecks,
    addTemplateCheck,
    updateTemplateCheck,
    deleteTemplateCheck,
    resetElementTemplate,
    getStats
  };
})();
