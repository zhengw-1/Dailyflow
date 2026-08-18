const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(cond,msg){ if(!cond) throw new Error(msg); }

assert(!html.includes('id="reminder"'), 'Reminder field must be removed from Add/Edit Task');
assert(!html.includes('notificationSwitch'), 'Notification control must be removed');
assert((html.match(/task\.reminder/g)||[]).length===1 && html.includes('delete task.reminder'), 'Reminder data may appear only in the one-time migration');
assert((html.match(/settings\.notifications/g)||[]).length===1 && html.includes('delete settings.notifications'), 'Notification setting may appear only in the one-time migration');
assert(!/reminder\s*:/.test(html), 'New/default tasks must not store reminder properties');
assert(html.includes('delete task.reminder'), 'Existing saved reminder properties must be migrated away');
assert(/\.priority-pill \.pill-visible-text\{font-weight:650\}/.test(html), 'Priority pill text must match category pill weight');
console.log('PASS no reminders + matching priority pill typography');
