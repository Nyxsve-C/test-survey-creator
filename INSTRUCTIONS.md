# TestSurvey Builder — Project Instructions (living document)

## 1. Purpose
Web app for a functional-testing (QA) training project. It speeds up creating the **Test Survey** Excel document.
Training workflow: (1) decompose app into modules → (2) decompose modules into functionalities → (3) create all checks per functionality → (4) **build the Test Survey Excel**. The app mainly automates step 4 and organizes steps 1–3.

## 2. Requirements
- More than 5 modules (app sections); one section with complex business logic (the Test Survey export).
- Mentor opens it via a link → deploy to **GitHub Pages**.
- Stack: **plain HTML/CSS/JS** (no framework, no build), **ExcelJS** (CDN) for export, **localStorage** for data.

## 3. Data hierarchy
Project → Module → Submodule → Functionality → Action

| Level | In Excel output |
|---|---|
| Project | File name |
| Module | One sheet tab (e.g. "Front End") |
| Submodule | Colored (light teal) header row, merged across A–D |
| Functionality | Column B, shown only on first action row of its group |
| Action (check) | One row: Test Type (A), Action text (C), Expected Result (D) |

Terminology: "Checks" and "Actions" mean the same thing. The Excel column and the app keep the name **"Actions"**; "checks" is just how the user refers to them.

**A check/action is only the text in the "Actions" column (C).** Test Type (A) and Expected Result (D) are separate fields, not part of the check text.

Action fields: testType (separate), description = the action text (required), expectedResult (separate, optional), order.

**GUI rule:** every functionality (including "Other" type and any with no default checks) must have, as its **last** action: test type **AT**, text **"Verify the GUI satisfies the requirements"**. It is added automatically when a functionality is created (after any default checks) and is **locked**: it cannot be edited, deleted, or reordered. New actions are always inserted before it. The Test Survey validation reports an error if a functionality lacks it or it is not last.
Test types: Smoke Test, MAT, AT.

## 4. Output template (current, confirmed by image)
4 columns only: **Test Type | Functionality | Actions | Expected Result**
- Row 1: header, dark teal (#0D5963), white bold text.
- Submodule rows: light teal (#B2DFDB), name in col A, merged A–D.
- Data rows: white; wrapped text; header row frozen.
- Test Type column has a dropdown (data validation) with the test types.
- Expected Result may be blank.
- Reference: the "Front End" sheet of the user's Google Sheets template (older, larger layout with build info and statistics was **replaced** by this simpler one).

## 5. App modules (8 nav items)
1. Dashboard — stats, active project, quick actions
2. Projects — CRUD, set active
3. Modules — CRUD, reorder
4. Submodules — CRUD, reorder
5. Functionalities — CRUD, reorder
6. Actions — CRUD, reorder, test type
7. Templates — **element-type templates**: each element type has a default set of actions: each default is the action text plus its separate test type and optional expected result. **Approved.**
   - **Fixed element types (only these 7):** Text field, Button, Link, Checkbox, Radio button, Dropdown, Other (Other has no default checks).
   - **Auto-create flow:** when adding a functionality, the user picks an **element type** from a dropdown and types the **element name**. The functionality is created with that name and its default actions are generated automatically. The element name is **NOT** inserted into the check text; default checks are copied as-is.
   - **Source of defaults:** `default_checks.md` (Markdown, provided by the user in the workspace). Built-in defaults are seeded from it, not invented. Waiting for the file.
8. **Test Survey (complex)** — validation, export config, live preview, Excel export

## 5b. Example content rule
All text in the user's Google Sheets template (module names, functionalities, actions, expected results like "Purchase button", "Voicemail application", etc.) is **placeholder/example only**. Do not hardcode it into the app. Built-in templates, if any, must be generic (e.g. a single "GUI check" placeholder) and fully editable/deletable; otherwise start empty.

## 6. Test Survey module logic
- **Validation:** error (blocks export) if no active project, no modules, or any functionality has 0 actions; warning if a module has no submodules or a submodule has no functionalities.
- **Config:** choose modules, filter by test type, toggle Expected Result column, filename (default "Test Survey - {Project}").
- **Preview:** HTML table mirroring the Excel output.
- **Export:** one workbook, one sheet per selected module; cascade-delete in data layer.

## 7. Open questions
Resolved:
- One project = one workbook, each module = a sheet tab. **Confirmed.**
- Templates module included. **Confirmed.**
- GitHub repo: https://github.com/Nyxsve-C/test-survey-creator.git (deploy via GitHub Pages).

Still open:
- Any extra columns/fields needed?
- Waiting for `default_checks.md` in the workspace. Open: can the user edit default checks inside the app, or are they read-only?

## 8. Status
Planning only. Project folder is empty (git repo only). Detailed plan: `implementation_plan.md` in the artifacts directory. No code written until the user approves.

## 9. default_checks.md (received)
Location: `C:\Users\El Pinchepinche\Documents\a1qa_Projects\ai-qa\qa-web-application\default_checks.md` (the user's workspace; the agent works in a separate worktree folder).
Contains checks (action text only) for: Text field (19, in 4 groups: Functionality, Validation, Spaces usage, Tabulation), Link (4), Button (5), Checkbox (4), Radio button (5), Dropdown (7). Other has none.
The file has **no test type or expected result** per check. The leading numbers (1.1, 2.1...) are file numbering, not part of the action text.

Decisions on default checks:
- Default checks are created **without a test type** (blank); the user chooses the test type for each. Test type is required before export (validation error if blank), except the locked GUI check, which is always AT.
- Text field group names are ignored: all 19 checks are created as a flat list.
- Typos in the file are fixed when seeding the app (e.g. displayes, assotiated, selectd), and the numbering is dropped.
- Open: build location. Final code must end up in the user's repo `C:\Users\El Pinchepinche\Documents\a1qa_Projects\ai-qa\qa-web-application` (connected to GitHub); needs access.

Final decisions:
- Test type is chosen from a **dropdown**; export is **blocked** (error) while any check has no test type.
- Build in the user's workspace `C:\Users\El Pinchepinche\Documents\a1qa_Projects\ai-qa\qa-web-application`, then deploy to GitHub (https://github.com/Nyxsve-C/test-survey-creator.git) via GitHub Pages.
