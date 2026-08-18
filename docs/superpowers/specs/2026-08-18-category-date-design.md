# DailyFlow Category and Date Display Design

## Goal
Add reusable custom categories and a clearer two-date task display without changing existing task behavior.

## Category behavior
- Start with three preset categories: School, Work, Personal.
- Users can add a custom category from the task editor.
- Saved custom categories persist in DailyFlow settings and appear in future task category lists.
- Existing task categories are merged into the saved list so upgrades do not lose access to older categories.
- Inline category pills size to the currently selected category text rather than the longest available option.

## Date behavior
- Each task card shows the start date first and due date second, including the year, with no Start/Due labels.
- The start date is display-only on the task card.
- The due date remains directly editable from the task card.
- Inline due-date edits never modify the start date. A due date earlier than the start date is rejected.
- The full Edit dialog remains the only place where both start and due dates can be changed together.

## Compatibility
- Keep the current storage key and existing task data.
- Preserve drag ordering, carryover, Finish Day, completed history, overdue card styling, quick subtasks, priority pills, and Mac PWA behavior.
