const assert = require('assert');
let utils;
try { utils = require('../task-inline-edit-utils.js'); } catch (e) { utils = {}; }

const baseTask = () => ({
  id:'t1', title:'Task', start:'2026-08-13', due:'2026-08-13', category:'School', priority:'Medium', completed:false, completedDate:null,
  subtasks:[{id:'s1', title:'First', done:false, order:0}]
});

assert.strictEqual(typeof utils.updatePriority, 'function', 'updatePriority should exist');
assert.strictEqual(typeof utils.updateCategory, 'function', 'updateCategory should exist');
assert.strictEqual(typeof utils.updateDueDate, 'function', 'updateDueDate should exist');
assert.strictEqual(typeof utils.addSubtask, 'function', 'addSubtask should exist');

{
  const tasks=[baseTask()];
  utils.updatePriority(tasks,'t1','High');
  assert.strictEqual(tasks[0].priority,'High');
}
{
  const tasks=[baseTask()];
  utils.updateCategory(tasks,'t1','Work');
  assert.strictEqual(tasks[0].category,'Work');
}
{
  const tasks=[baseTask()];
  utils.updateDueDate(tasks,'t1','2026-08-20');
  assert.strictEqual(tasks[0].due,'2026-08-20');
}
{
  const tasks=[baseTask()];
  utils.addSubtask(tasks,'t1','Second','s2');
  assert.strictEqual(tasks[0].subtasks.length,2);
  assert.deepStrictEqual(tasks[0].subtasks[1],{id:'s2',title:'Second',done:false,order:1});
}
console.log('task-inline-edit tests passed');

assert.strictEqual(typeof utils.normalizeCategories, 'function', 'normalizeCategories should exist');
assert.strictEqual(typeof utils.addCategory, 'function', 'addCategory should exist');
assert.strictEqual(typeof utils.formatDisplayDate, 'function', 'formatDisplayDate should exist');
{
  const categories=utils.normalizeCategories([], [{category:'Appointment'},{category:'School'},{category:'Custom Long Category'}]);
  assert.deepStrictEqual(categories.slice(0,3), ['School','Work','Personal']);
  assert.ok(categories.includes('Appointment'));
  assert.ok(categories.includes('Custom Long Category'));
}
{
  const categories=['School','Work','Personal'];
  assert.strictEqual(utils.addCategory(categories,'  Studio  '), true);
  assert.deepStrictEqual(categories,['School','Work','Personal','Studio']);
  assert.strictEqual(utils.addCategory(categories,'studio'), false, 'category dedupe should be case-insensitive');
}
{
  assert.strictEqual(utils.formatDisplayDate('2026-08-18'), 'Aug 18, 2026');
}
{
  const tasks=[baseTask()];
  const changed=utils.updateDueDate(tasks,'t1','2026-08-12');
  assert.strictEqual(changed,false,'inline due date before start should be rejected');
  assert.strictEqual(tasks[0].start,'2026-08-13','inline due date must never change start date');
  assert.strictEqual(tasks[0].due,'2026-08-13');
}
