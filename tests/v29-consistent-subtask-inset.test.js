const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('.task-row{display:grid;grid-template-columns:28px 36px minmax(0,1fr);grid-template-areas:"drag check main";'), 'task actions should not reserve a full-height grid column that narrows subtasks');
assert(/\.task-actions\{position:absolute;top:10px;right:10%;/.test(html), 'task actions should be anchored to the card corner');
assert(html.includes('.task-main{grid-area:main;min-width:0;padding-left:0;width:100%}'), 'task main should use the full available width');
assert(html.includes('margin:9px calc(5cqw - var(--task-main-offset)) 0 5cqw;padding-top:9px;border-top:1px dashed var(--line);'), 'subtask section should use the card-relative 5% inset corrected for nested task-main');
assert(html.includes('margin-top:8px;margin-left:calc(5cqw - var(--task-main-offset));margin-right:5cqw'), 'add-subtask row should use the same card-relative side inset');
assert(sw.includes('dailyflow-v32-card-relative-subtask-inset'), 'service worker cache must be bumped to v30');
console.log('PASS current consistent subtask inset and full-width layout rules');
