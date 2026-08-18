# Overdue Card Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the word “Overdue” while retaining a red due-date pill and adding a light red/pink tint to the entire unfinished past-due task card.

**Architecture:** Keep the existing `DailyFlowOrder.isOverdue(task, date)` behavior unchanged. Update only the rendering and CSS in `index.html`, then bump the service-worker cache key so installed Safari web apps fetch the new styling.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js assertion tests, PWA service worker.

## Global Constraints

- Preserve all existing DailyFlow behaviors and browser-storage keys.
- Unfinished past-due tasks get a light red/pink card and red due-date pill.
- Do not display the literal word “Overdue”.
- Completed tasks use normal completed styling and must not retain the overdue card tint.
- Non-overdue tasks keep their normal styling.

---

### Task 1: Overdue visual state

**Files:**
- Modify: `index.html`
- Create: `tests/overdue-styling.test.js`
- Modify: `service-worker.js`

**Interfaces:**
- Consumes: `DailyFlowOrder.isOverdue(task, selectedDate): boolean`
- Produces: `.task.overdue-card` card state and `.pill.overdue` due-date pill without “Overdue” text.

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const sw = fs.readFileSync(require('path').join(__dirname, '..', 'service-worker.js'), 'utf8');

if (/Overdue\s*[·:-]/.test(html)) throw new Error('Overdue label must not be rendered');
if (!html.includes('.task.overdue-card')) throw new Error('Missing overdue task-card style');
if (!html.includes('overdue-card')) throw new Error('Missing overdue card class in render path');
if (!/dailyflow-v6/.test(sw)) throw new Error('Service worker cache version was not bumped');
console.log('Overdue styling checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/overdue-styling.test.js`
Expected: FAIL because the current HTML still renders “Overdue ·” and lacks the full-card overdue style.

- [ ] **Step 3: Implement minimal styling change**

Add `.task.overdue-card` with a soft red/pink background and border, add the class only when `isOverdue(...)` is true, and render the red pill as `Due YYYY-MM-DD` without the word “Overdue”. Ensure completed tasks cannot receive the class because `isOverdue` already returns false for completed tasks.

- [ ] **Step 4: Bump service worker cache**

Change the cache key from `dailyflow-v5-carryover-finish-day-drop-lines` to a `dailyflow-v6-...` key.

- [ ] **Step 5: Run tests**

Run: `node tests/order-utils.test.js && node tests/overdue-styling.test.js`
Expected: both test suites pass.
