const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
const expected='margin:9px calc(5cqw - var(--task-main-offset)) 0 5cqw';
const quick='margin-left:calc(5cqw - var(--task-main-offset));margin-right:5cqw';
assert(html.includes(expected), 'subtasks should offset the nested task-main column so the final left/right inset is 5% of the task card');
assert(html.includes(quick), 'add-subtask row should use the same card-relative left inset');
assert(html.includes('--task-main-offset:80px'), 'desktop task-main offset should be explicit');
console.log('PASS v32 card-relative subtask inset');
