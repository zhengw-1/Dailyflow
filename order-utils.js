(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DailyFlowOrder = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalizeItemOrder(items) {
    return items
      .slice()
      .sort((a, b) => {
        const aOrder = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
        const bOrder = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
      })
      .map((item, index) => ({ ...item, order: index }));
  }

  function reorderById(items, sourceId, targetId, position = 'before') {
    const normalized = normalizeItemOrder(items);
    const sourceIndex = normalized.findIndex(item => item.id === sourceId);
    if (sourceIndex < 0) return normalized;
    const [moved] = normalized.splice(sourceIndex, 1);
    const targetIndex = normalized.findIndex(item => item.id === targetId);
    if (targetIndex < 0) return normalizeItemOrder(normalized.concat(moved));
    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    normalized.splice(insertIndex, 0, moved);
    return normalized.map((item, index) => ({ ...item, order: index }));
  }

  function taskIsDone(task) {
    return Boolean(task.completed || (task.subtasks && task.subtasks.length && task.subtasks.every(s => s.done)));
  }

  function activeTasksForDate(tasks, date, isLiveToday) {
    return tasks.filter(task => {
      if (task.completedDate) return false;
      if (!task.start || task.start > date) return false;
      if (isLiveToday) return true;
      return !task.due || task.due >= date;
    });
  }

  function finishDay(tasks, date) {
    return tasks.map(task => {
      if (task.completedDate || !task.start || task.start > date || !taskIsDone(task)) return task;
      return { ...task, completed: true, completedDate: date };
    });
  }

  function isOverdue(task, date) {
    return Boolean(!task.completedDate && !taskIsDone(task) && task.due && task.due < date);
  }

  return { normalizeItemOrder, reorderById, activeTasksForDate, finishDay, isOverdue, taskIsDone };
});
