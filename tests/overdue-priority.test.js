
const order = require('../order-utils.js');

function assert(cond, msg){ if(!cond) throw new Error(msg); }

const date = '2026-08-18';

let tasks = [
  {id:'a', due:'2026-08-17', priority:'Low', completed:false, completedDate:null, subtasks:[]},
  {id:'b', due:'2026-08-17', priority:'Medium', completed:false, completedDate:null, subtasks:[], overduePriorityApplied:true},
  {id:'c', due:'2026-08-19', priority:'Low', completed:false, completedDate:null, subtasks:[]},
  {id:'d', due:'2026-08-17', priority:'Low', completed:true, completedDate:null, subtasks:[]}
];

const result = order.applyOverduePriority(tasks, date);

assert(result.changed === true, 'first overdue promotion should report a change');
assert(result.tasks[0].priority === 'High', 'newly overdue task should become High');
assert(result.tasks[0].overduePriorityApplied === true, 'newly overdue task should be marked as auto-promoted');

assert(result.tasks[1].priority === 'Medium', 'manual priority after auto-promotion must be respected');
assert(result.tasks[1].overduePriorityApplied === true, 'manual override marker must remain set');

assert(result.tasks[2].priority === 'Low', 'not-yet-overdue task must not change');
assert(!result.tasks[2].overduePriorityApplied, 'not-yet-overdue task must not be marked');

assert(result.tasks[3].priority === 'Low', 'completed task must not be auto-promoted');

const afterManualLow = order.applyOverduePriority([
  {...result.tasks[0], priority:'Low'}
], date);
assert(afterManualLow.tasks[0].priority === 'Low', 'manual Low after auto-promotion must stay Low');
assert(afterManualLow.changed === false, 'manual override must not trigger another promotion');

console.log('PASS overdue priority behavior');
