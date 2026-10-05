const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('container-type:inline-size'), 'task cards should provide a card-relative container for consistent inset');
assert(html.includes('margin:9px calc(5cqw - var(--task-main-offset)) 0 5cqw'), 'subtasks should use an equal card-relative 5% inset on both sides');
assert(html.includes('margin-left:calc(5cqw - var(--task-main-offset));margin-right:5cqw'), 'add-subtask row should use the same equal card-relative inset');
assert(!html.includes('.subtasks{margin:9px 10% 0;'), 'old nested 10% inset must be removed');
assert(sw.includes('dailyflow-v32-card-relative-subtask-inset'), 'service worker cache must be bumped to v30');
console.log('PASS v31 left subtask inset');
