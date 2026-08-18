
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(c,m){if(!c)throw new Error(m);}
assert(!html.includes('id="restoreDataBtn"'),'temporary top restore button should be removed');
assert(html.includes('id="restoreBackupBtn"'),'restore must live in Settings');
assert(html.includes('DailyFlow Recovery Backup'),'legacy recovered JSON must still be accepted');
console.log('PASS legacy recovery compatibility through Settings');
