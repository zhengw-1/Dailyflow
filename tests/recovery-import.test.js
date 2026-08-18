
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(cond,msg){ if(!cond) throw new Error(msg); }
assert(html.includes('id="restoreDataBtn"'), 'Recovery build must include Restore Data button');
assert(html.includes('id="restoreDataInput"'), 'Recovery build must include hidden JSON file input');
assert(html.includes('DailyFlow Recovery Backup'), 'Recovery import must validate DailyFlow recovery format');
assert(html.includes('localStorage.setItem(STORAGE_KEY'), 'Recovery must restore tasks');
assert(html.includes('localStorage.setItem(ARCHIVE_KEY'), 'Recovery must restore archive');
assert(html.includes('localStorage.setItem(SETTINGS_KEY'), 'Recovery must restore settings');
assert(!html.includes('DailyFlow_Recovered_Data_2026-08-18.json'), 'Personal recovery filename/data must not be embedded');
console.log('PASS recovery import markup and privacy checks');
