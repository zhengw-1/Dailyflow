const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(__dirname, '..', 'service-worker.js'), 'utf8');

if (/Overdue\s*[·:-]/.test(html)) throw new Error('Overdue label must not be rendered');
if (!html.includes('.task.overdue-card')) throw new Error('Missing overdue task-card style');
if (!html.includes('.pill.blue.due-emphasis')) throw new Error('Overdue due-date pill must use pastel blue with emphasis');
if (!html.includes('pill blue inline-control-pill ${overdue?"due-emphasis":""}')) throw new Error('Overdue render path must keep pastel blue due-date emphasis');
if (html.includes('class="pill overdue"')) throw new Error('Overdue render path must not use red overdue pill');
if (!html.includes('overdue-card')) throw new Error('Missing overdue card class in render path');
if (!/dailyflow-v12-safari-click-fix/.test(sw)) throw new Error('Service worker cache version was not bumped');
console.log('Overdue styling checks passed.');
