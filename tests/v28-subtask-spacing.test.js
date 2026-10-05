const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('.subtasks{margin:9px calc(5cqw - var(--task-main-offset)) 0 5cqw;padding-top:9px;border-top:1px dashed var(--line);display:flex;flex-direction:column;gap:6px}'), 'expanded task subtask section should use compact spacing like the phone layout');
assert(html.includes('.quick-subtask-row{display:flex;align-items:center;gap:8px;margin-top:8px;margin-left:calc(5cqw - var(--task-main-offset));margin-right:5cqw}'), 'add-subtask row should sit closer to the last subtask');
console.log('PASS v28 compact subtask spacing rules');
