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

  function reorderById(items, sourceId, targetId) {
    const normalized = normalizeItemOrder(items);
    const sourceIndex = normalized.findIndex(item => item.id === sourceId);
    const targetIndex = normalized.findIndex(item => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return normalized;
    const [moved] = normalized.splice(sourceIndex, 1);
    normalized.splice(targetIndex, 0, moved);
    return normalized.map((item, index) => ({ ...item, order: index }));
  }

  return { normalizeItemOrder, reorderById };
});
