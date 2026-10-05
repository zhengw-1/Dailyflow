const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

if (!html.includes('.subtasks{margin:9px 5cqw 0 calc(5cqw - var(--task-main-offset));')) {
  throw new Error('v33 expected the desktop/tablet subtask inset to use the card-relative left inset and 5cqw right inset.');
}
if (!html.includes('.subtasks{margin-left:calc(5cqw - var(--task-main-offset));margin-right:5cqw;')) {
  throw new Error('v33 expected the mobile subtask inset to keep the working phone layout.');
}
console.log('v33 desktop/tablet subtask padding test passed');
