# DailyFlow Category and Date Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add saved custom categories, content-sized category pills, and a start-then-due date display with inline due-only editing.

**Architecture:** Extend the existing utility module with category normalization, category saving, display-date formatting, and stricter due-date updates. Keep persistence in the existing settings object and render all task controls from `index.html`.

**Tech Stack:** HTML, CSS, vanilla JavaScript, localStorage, Node.js assertion tests.

## Global Constraints
- Preset categories are exactly `School`, `Work`, `Personal`.
- Existing task categories remain selectable after upgrade.
- Inline due-date edits must not change start dates.
- Start and due dates show the year and appear in that order without labels.
- Existing DailyFlow storage keys remain unchanged.

---

### Task 1: Utility behavior
**Files:**
- Modify: `task-inline-edit-utils.js`
- Modify: `tests/task-inline-edit.test.js`

**Interfaces:**
- Produces: `normalizeCategories(saved, tasks)`, `addCategory(categories, name)`, `formatDisplayDate(isoDate)`, stricter `updateDueDate(tasks,id,due)`.

- [ ] Write failing assertions for three presets, custom-category dedupe, existing-category merge, year-bearing date formatting, and rejecting due dates before start.
- [ ] Run `node tests/task-inline-edit.test.js` and confirm the new assertions fail.
- [ ] Implement the smallest utility changes required.
- [ ] Run `node tests/task-inline-edit.test.js` and confirm all assertions pass.

### Task 2: Category and date UI
**Files:**
- Modify: `index.html`
- Modify: `tests/inline-controls.test.js`

**Interfaces:**
- Consumes: utilities from Task 1.
- Produces: saved category field/editor, content-sized inline category selector, start-date display, inline due-date input.

- [ ] Add failing markup assertions for saved custom categories, three presets, start-date display, and no `Due ` label.
- [ ] Run `node tests/inline-controls.test.js` and confirm failure.
- [ ] Implement the UI and settings persistence.
- [ ] Run `node tests/inline-controls.test.js` and confirm pass.

### Task 3: Cache and regression verification
**Files:**
- Modify: `service-worker.js`

- [ ] Increment the cache key.
- [ ] Run all Node tests under `tests/*.test.js`.
- [ ] Parse/extract the inline scripts and run `node --check` against them.
- [ ] Package the updated app folder as a ZIP.
