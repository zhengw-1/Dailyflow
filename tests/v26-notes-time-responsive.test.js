const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('function normalizeTimeValue'), 'typed time normalization missing');
assert(html.includes('id="timeTextInput"'), 'time popup text input missing');
assert(html.includes('id="timeNativeInput"'), 'time popup picker missing');
assert(html.includes('openSubtaskTime'), 'subtask clock interaction missing');
assert(html.includes('openTaskNotes'), 'task notes interaction missing');
assert(html.includes('openSubtaskNotes'), 'subtask notes interaction missing');
assert(html.includes('class="notes-icon-btn'), 'vector notes icon button missing');
assert(html.includes('<circle cx="12" cy="12" r="8.5"/>'), 'vector clock icon missing');
assert(html.includes('.subtask-time-pill{display:none}'), 'mobile subtask time pill should collapse to icon');
assert(html.includes('type="text" inputmode="text" placeholder="Optional time"'), 'time fields should support typing');
console.log('PASS v26 notes, typed/picked time, and responsive subtask controls');
