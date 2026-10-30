# TestSurvey Builder — QA Functional Testing Tool

A client-side web application designed to streamline functional testing decomposition and automate the creation of **Test Survey** Excel (`.xlsx`) documents.

## Problem Solved

During QA and functional testing training, creating a structured **Test Survey** document requires:
1. Decomposing the application into **Modules** and **Submodules**
2. Decomposing each submodule into specific **Functionalities**
3. Creating all possible **Actions (Checks)** for each functionality (including element-specific checks and mandatory GUI checks)
4. Formatting and assembling the final **Test Survey Excel workbook**

**TestSurvey Builder** organizes steps 1–3 and automates step 4 with validation rules, element-type check generation, live sheet previewing, and formatted `.xlsx` export.

---

## 8 Application Modules

1. **Dashboard** — Overview of the active project, hierarchy counts, workflow progress, and Test Type readiness.
2. **Projects** — Create and switch between multiple Test Survey projects (each project exports as one `.xlsx` workbook).
3. **Modules** — Manage application modules (each module exports as a separate worksheet tab).
4. **Submodules** — Manage submodules within each module (each submodule exports as a colored header row spanning the table).
5. **Functionalities** — Add functionalities by selecting an **Element Type** (`Text field`, `Button`, `Link`, `Checkbox`, `Radio button`, `Dropdown`, `Other`) and entering its name. Default checks and the mandatory locked GUI check are generated automatically.
6. **Actions (Checks)** — Assign a **Test Type** (`Smoke Test`, `MAT`, `AT`) from the dropdown for each check, add custom checks, or edit optional Expected Results.
7. **Templates** — View, edit, add, or reset the default checks seeded from `default_checks.md` for each element type.
8. **Test Survey ★ (Complex Business Logic)** — Multi-rule validation engine, export configuration, live HTML worksheet preview, and styled ExcelJS `.xlsx` generation.

---

## Key Business Logic Rules

- **Element-Type Auto-Generation**: Creating a functionality automatically generates the default checks for its chosen element type (from `default_checks.md`) with blank Test Types so the tester explicitly assigns them.
- **Locked Final GUI Check**: Every functionality (including `Other`) automatically receives a locked final check (`AT` — `"Verify the GUI satisfies the requirements"`) as its last row. It cannot be edited, deleted, or moved, and any newly added checks are inserted before it.
- **Strict Export Validation**: Export to Excel is blocked if any check in the selected modules is missing a **Test Type** or if any functionality violates the hierarchy/GUI rules.
- **4-Column Template Fidelity**: Exports `Test Type | Functionality | Actions | Expected Result` with frozen headers, colored submodule separator rows, vertically merged Functionality cells, text wrapping, and Excel Data Validation dropdowns on the `Test Type` column.

---

## Running Locally or on GitHub Pages

No build step or server installation is required:
- **GitHub Pages**: Push to `main` on `https://github.com/Nyxsve-C/test-survey-creator.git` and enable **Settings → Pages → Deploy from branch (`main` / `/root`)**.
- **Local**: Open `index.html` in any modern web browser.
