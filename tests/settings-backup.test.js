
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

function assert(cond,msg){if(!cond)throw new Error(msg);}

assert(html.includes('data-view="settings"'),'Settings must be in sidebar');
assert(html.includes('id="settingsView"'),'Settings view must exist');
assert(html.includes('id="exportBackupBtn"'),'Export Backup button missing');
assert(html.includes('id="restoreBackupBtn"'),'Restore Backup button missing');
assert(html.includes('id="restoreBackupInput"'),'Restore file input missing');
assert(html.includes('format:"DailyFlow Backup"'),'Backup format missing');
assert(html.includes('How backup works'),'Backup explanation missing');
assert(html.includes('How to restore'),'Restore guide missing');
assert(!html.includes('id="restoreDataBtn"'),'Old top Restore Data button must be removed');
assert(html.includes('DailyFlow_Backup_'),'Export filename missing');

console.log('PASS settings backup/restore UI');
