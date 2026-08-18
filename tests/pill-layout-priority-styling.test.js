const fs = require('fs');
const path=require('path');
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const checks = [
  ['overdue card stays white with thicker red border', /\.task\.overdue-card\{background:#fff;border:2px solid #e87989/.test(html)],
  ['low priority uses green pill', /priority-low\{background:#e8f6ec;color:#73778b/.test(html)],
  ['medium priority uses yellow pill', /priority-medium\{background:#fff7d9;color:#73778b/.test(html)],
  ['high priority uses red pill', /priority-high\{background:#fdebed;color:#73778b/.test(html)],
  ['priority text stays neutral', /\.priority-pill\{color:#73778b\}/.test(html)],
  ['native controls are transparent overlays', /pill-native-overlay/.test(html)],
  ['completed tasks do not keep overdue class', /overdue && !isTaskDone\(task\)\?"overdue-card"/.test(html)]
];
for (const [name, ok] of checks) if (!ok) throw new Error(name);
console.log('Pill layout and priority styling checks passed.');
