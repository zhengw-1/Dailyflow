const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('container-type:inline-size'), 'task cards should provide a card-relative container for consistent inset');
assert(/\.subtasks\{margin:9px calc\(5cqw - var\(--task-main-offset\)\) 0 5cqw;/.test(html), 'subtasks should use a card-relative 5% inset corrected for the nested task-main column');
assert(/\.quick-subtask-row\{display:flex;align-items:center;gap:8px;margin-top:8px;margin-left:calc\(5cqw - var\(--task-main-offset\)\);margin-right:5cqw\}/.test(html), 'add-subtask row should use the same card-relative left inset');
assert(!html.includes('.subtasks{margin:9px 10% 0;'), 'old nested 10% inset must be removed');
assert(sw.includes('dailyflow-v32-card-relative-subtask-inset'), 'service worker cache must be bumped to v32');
console.log('PASS v32 card-relative subtask inset');
