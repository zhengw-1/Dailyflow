const assert = require('assert');
const {
  reorderById,
  activeTasksForDate,
  finishDay,
  isOverdue,
} = require('../order-utils.js');

(function testReorderSupportsAfterPosition() {
  const items = [
    { id: 'a', order: 0 },
    { id: 'b', order: 1 },
    { id: 'c', order: 2 },
  ];
  const result = reorderById(items, 'a', 'b', 'after');
  assert.deepStrictEqual(result.map(x => x.id), ['b', 'a', 'c']);
})();

(function testTodayCarriesForwardUnfinishedPastDueTasks() {
  const tasks = [
    { id: 'overdue', start: '2026-08-10', due: '2026-08-12', completed: false, completedDate: null, subtasks: [] },
    { id: 'current', start: '2026-08-13', due: '2026-08-13', completed: false, completedDate: null, subtasks: [] },
    { id: 'future', start: '2026-08-14', due: '2026-08-14', completed: false, completedDate: null, subtasks: [] },
    { id: 'archived', start: '2026-08-10', due: '2026-08-12', completed: true, completedDate: '2026-08-12', subtasks: [] },
  ];
  const result = activeTasksForDate(tasks, '2026-08-13', true);
  assert.deepStrictEqual(result.map(x => x.id), ['overdue', 'current']);
})();

(function testHistoricalDateStillUsesOriginalRange() {
  const tasks = [
    { id: 'overdue', start: '2026-08-10', due: '2026-08-12', completed: false, completedDate: null, subtasks: [] },
    { id: 'later', start: '2026-08-13', due: '2026-08-13', completed: false, completedDate: null, subtasks: [] },
  ];
  const result = activeTasksForDate(tasks, '2026-08-11', false);
  assert.deepStrictEqual(result.map(x => x.id), ['overdue']);
})();

(function testFinishDayArchivesOnlyCheckedTasks() {
  const tasks = [
    { id: 'checked', start: '2026-08-13', due: '2026-08-13', completed: true, completedDate: null, subtasks: [] },
    { id: 'unchecked', start: '2026-08-12', due: '2026-08-12', completed: false, completedDate: null, subtasks: [] },
    { id: 'subtasks-done', start: '2026-08-11', due: '2026-08-12', completed: true, completedDate: null, subtasks: [{ done: true }, { done: true }] },
  ];
  const result = finishDay(tasks, '2026-08-13');
  assert.strictEqual(result.find(x => x.id === 'checked').completedDate, '2026-08-13');
  assert.strictEqual(result.find(x => x.id === 'subtasks-done').completedDate, '2026-08-13');
  assert.strictEqual(result.find(x => x.id === 'unchecked').completedDate, null);
})();

(function testOverdueOnlyAppliesToUnfinishedUnarchivedTask() {
  assert.strictEqual(isOverdue({ due: '2026-08-12', completed: false, completedDate: null, subtasks: [] }, '2026-08-13'), true);
  assert.strictEqual(isOverdue({ due: '2026-08-12', completed: true, completedDate: null, subtasks: [] }, '2026-08-13'), false);
  assert.strictEqual(isOverdue({ due: '2026-08-12', completed: true, completedDate: '2026-08-12', subtasks: [] }, '2026-08-13'), false);
})();

console.log('All DailyFlow utility tests passed.');
