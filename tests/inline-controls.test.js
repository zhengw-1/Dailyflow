const fs=require('fs'); const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
for (const expected of [
  'onchange="inlineCategory(',
  'onchange="inlinePriority(',
  'onchange="inlineDueDate(',
  '+ Subtask',
  'task-inline-edit-utils.js'
]) if(!html.includes(expected)) throw new Error(`Missing inline task control: ${expected}`);
if(html.includes('onchange="inlineStatus(')) throw new Error('Active/Checked inline status control should be removed');
if(!html.includes('category-pill')) throw new Error('Category control should use pastel pill styling');
if(!html.includes('priority-pill')) throw new Error('Priority control should use pastel pill styling');
if(!html.includes('type="date"')) throw new Error('Inline due date must use a date input');
console.log('Inline control markup checks passed.');
if(!html.includes('id="newCategoryName"')) throw new Error('Custom category input should exist in task editor');
if(!html.includes('saveNewCategory')) throw new Error('Custom category save action should exist');
if(!html.includes('["School","Work","Personal"]')) throw new Error('Category presets should start with School, Work, Personal');
if(!html.includes('formatDisplayDate(task.start)')) throw new Error('Task card should display formatted start date with year');
if(html.includes('Due ${task.due}')) throw new Error('Task card should not show a Due label');
if(!html.includes('start-date-display')) throw new Error('Start date should have display-only styling');
if(!html.includes('category-visible-text')) throw new Error('Category pill should size from its visible text');
if(!html.includes('due-visible-text')) throw new Error('Due-date pill should size from its visible formatted date');
if(!html.includes('pill-native-overlay')) throw new Error('Native controls should be transparent overlays so they do not add visual padding');
console.log('Custom category and date display markup checks passed.');
