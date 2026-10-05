# DailyFlow v33 — Balanced Subtask Padding

Updates in v26:
- Due times can be picked or typed for tasks and subtasks.
- Main task start remains date-only; due supports date + optional time.
- Main tasks and subtasks have compact vector-style Notes buttons with editable note popovers.
- On phone/tablet, subtask due time collapses to a compact clock icon that opens a picker/typing popover.
- Subtask text keeps more width on small screens; no horizontal scrolling or overlap from due-time controls.
- Existing v25 manual task ordering, Daily Focus ordering, categories, backup/restore, and data keys are preserved.
- Tablet/phone content uses about 10% total side padding and prevents subtask controls from escaping the card.
- v27 responsive width behavior is preserved, with the subtask content now using the same 10% side inset at every screen size.
- Expanded subtask sections now use compact spacing matching the phone layout.
- The + Subtask row sits closer to the subtask list.
- Subtask and + Subtask areas now use an equal card-relative 5% inset on every screen size.
- Service worker/cache version is bumped to v33.

Do not include personal DailyFlow backup JSON files in this project or public GitHub uploads.

- The subtask and + Subtask rows use a tighter, equal 5% card-relative left/right inset so the subtask starts farther left while remaining balanced across phone, tablet, and desktop.
