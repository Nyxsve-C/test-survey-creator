# TestSurvey Builder — Project Instructions & Specification

## 1. Purpose
Web application for functional-testing (QA) training and practice. It speeds up creating the **Test Survey** Excel (`.xlsx`) document.

Training workflow:
1. Decompose the application into testing **Modules** and **Submodules**
2. Decompose each submodule into specific **Functionalities**
3. Create all possible **Actions (Checks)** per functionality
4. **Build and export the Test Survey Excel workbook**

The app organizes steps 1–3, auto-generates standard checks, and automates step 4.

---

## 2. Core Technical & Functional Requirements
- **8 navigation modules** (exceeds the `> 5` modules requirement) and one complex business-logic section (**Test Survey** validation, preview, and Excel export).
- **Accessible via public link**: Hosted on **GitHub Pages** (`https://nyxsve-c.github.io/test-survey-creator/`) from `https://github.com/Nyxsve-C/test-survey-creator.git`.
- **Tech Stack**: Plain **HTML / CSS / JS** (zero build step, no framework), **ExcelJS 4.4.0** (via CDN) for styled `.xlsx` generation, and **`localStorage`** (`tsb_data_v1`) for persistence.
- **Branding**:
  - Page `<title>` and sidebar `.brand-title`: **`TestSurvey Builder`** (no subtitle).
  - Favicon (`favicon.svg`) and sidebar `.brand-icon`: dark-teal circle (`#0D5963`) with light-teal border and checkmark (`#B2DFDB`).

---

## 3. Data Hierarchy & Business Rules

`Project → Module → Submodule → Functionality → Action (Check)`

| Hierarchy Level | Excel Output Mapping |
|---|---|
| **Project** | Workbook file name (`Test Survey - {ProjectName}.xlsx`) |
| **Module** | One worksheet tab per module (e.g., `"Front End"`, `"General mobile checks"`) |
| **Submodule** | Colored (`#7FAEC0`) group header row spanning columns A–D, with title in Column B |
| **Functionality** | Column B (`Functionality`), vertically merged across all action rows of that functionality |
| **Action (Check)** | One row: **Test Type** (Col A), **Actions** check text (Col C), **Expected Result** (Col D) |

### Terminology & Field Separation
- **"Checks" and "Actions" mean the same thing.** The Excel column header and the app navigation use **"Actions"**; "checks" is how testers refer to them.
- **A check/action is only the text in Column C (`Actions`).**
- **Test Type** (Col A) and **Expected Result** (Col D, optional) are separate fields, never embedded inside the check text.

### Check Text Formatting Rule
- Every check must begin with **`"Verify "`** and must **not** end with a period (`.`).
- This rule is enforced both on all seeded checks (`default_checks.md` and `mobile_default_module.md`) and on any check added or edited by the user (`Defaults.formatCheckText()`).

### Test Types (Dropdown)
- Allowed options (only these 3): **`Smoke Test`**, **`MAT`**, **`AT`**.
- Default checks are created **without a Test Type** (blank); the user selects the Test Type from a dropdown (either row-by-row or using the bulk-fill helpers per Functionality or per Module).
- **Export is blocked** (validation error) if any check in the selected modules has a blank Test Type.

### Mandatory Locked GUI Check Rule
- Every UI functionality (including `"Other"` and any functionality with 0 default checks) automatically receives, as its **last** action:
  - **Test Type**: `AT`
  - **Action text**: `"Verify the GUI satisfies the requirements"`
  - **Locked**: `true` (cannot be edited, deleted, or moved; new actions are always inserted before it).
- **Exception for Mobile General Checks**: Functionalities auto-generated inside the **"General mobile checks"** module represent system/device-level checks (`skipGuiCheck: true`) and do **not** have the locked GUI check appended.

---

## 4. Excel Output Template Specification

Each exported `.xlsx` workbook contains one worksheet tab per selected Module with **4 columns** (or 3 if Expected Result is toggled off):

| Column | Header | Width | Formatting |
|---|---|---|---|
| **A** | `Test Type` | `16` | Centered; includes Excel Data Validation dropdown (`Smoke Test,MAT,AT`) |
| **B** | `Functionality` | `26` | Vertically merged across all action rows for each functionality; middle-aligned, wrapped |
| **C** | `Actions` | `58` | Check description text; left-aligned, text wrapping enabled |
| **D** | `Expected Result` | `42` | Optional (may be left blank); left-aligned, text wrapping enabled |

- **Row 1 (Header)**: Dark teal fill (`#386B78`), white bold text, frozen (`ySplit: 1`).
- **Submodule Rows**: Medium-light teal fill (`#7FAEC0`) across all columns, submodule name in Column B.
- **Data Rows**: White background, thin borders (`#90A4AE`).

---

## 5. Application Modules (8 Navigation Items)

1. **Dashboard** — Active project summary, hierarchy counts, missing Test Type alerts, and 4-step QA workflow overview.
2. **Projects** — Create, edit, delete, and set active project. Choose **Project Type**:
   - **Web App Testing**: Starts empty.
   - **Mobile App Testing**: Automatically creates the **"General mobile checks"** module seeded from `./mobile_default_module.md` (**18 submodules**, **22 functionalities**, **163 checks**).
3. **Modules** — CRUD and up/down reordering for modules within the active project.
4. **Submodules** — CRUD and up/down reordering for submodules within a selected module.
5. **Functionalities** — Select an **Element Type** from the dropdown and enter the **Functionality Name**. Automatically generates the default checks for that element type (without inserting the element name into the text, and with blank Test Types) plus the locked final GUI check.
6. **Actions** — View, add, edit, delete, and reorder checks; select **Test Type** via inline dropdowns; bulk-fill blank Test Types for the current **Functionality** or **Entire Module**.
7. **Templates** — Inspect, add, edit, delete, or reset default checks for the **7 fixed Element Types**:
   - `Text field` (16 default checks)
   - `Button` (5 default checks)
   - `Link` (4 default checks)
   - `Checkbox` (4 default checks)
   - `Radio button` (5 default checks)
   - `Dropdown` (7 default checks)
   - `Other` (0 default checks; still receives the locked final GUI check)
8. **Test Survey ★ (Complex Business Logic)** — Multi-rule validation engine, export configuration (module selection, Test Type filter, Expected Result column toggle, custom filename), live multi-tab HTML worksheet preview, and ExcelJS `.xlsx` download.

---

## 6. Seeded Data Sources in Workspace

- **`./default_checks.md`**: Source of default checks for the 6 UI element types (`Text field`, `Link`, `Button`, `Checkbox`, `Radio button`, `Dropdown`). Group headings are ignored, typos are fixed, leading numbers and trailing periods are stripped, and `"Verify "` is prefixed.
- **`./mobile_default_module.md`**: Source of the `"General mobile checks"` module for `Mobile App Testing` projects:
  - `# Heading` → Submodule (18)
  - `## Subheading` → Functionality (22)
  - `- Bullet` → Action / Check (163, prefixed with `"Verify "` and no trailing period)
- **Example Content Rule**: Any domain-specific text from external reference screenshots (e.g., `"Purchase button"`, `"Voicemail application"`) is treated strictly as layout reference and is never hardcoded into the application.
