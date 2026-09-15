const assert = require('assert');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

assert(html.includes('grid-template-areas:"drag check main actions"'), 'desktop/tablet task row must keep check beside drag and main content');
assert(html.includes('grid-template-areas:"drag check main" ". . actions"'), 'phone task row must keep check in the first row');
assert(html.includes('class="check ${isTaskDone(task)?"checked":""}"'), 'check button markup missing');
assert(html.includes('<div class="task-main">'), 'task main wrapper missing');
console.log('PASS task row layout tests');
