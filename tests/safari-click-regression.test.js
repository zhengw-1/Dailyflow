const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
function assert(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1); } }
assert(!html.includes('field-sizing:content'), 'experimental field-sizing must not be used');
assert(html.includes('id="openModal"'), 'Add Task button exists');
assert(html.includes("document.getElementById(\"openModal\").onclick"), 'Add Task click handler exists');
assert(html.includes('onclick="toggleTask('), 'task check click handlers are rendered');
assert(html.includes('onchange="inlineCategory('), 'category inline edit handler exists');
assert(html.includes('onchange="inlinePriority('), 'priority inline edit handler exists');
assert(html.includes('onchange="inlineDueDate('), 'due-date inline edit handler exists');
assert(html.includes('onclick="showQuickSubtask('), 'quick subtask handler exists');
console.log('PASS safari click regression checks');
