const assert = require('assert');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const sw = fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');

assert(html.includes('grid-template-columns:28px 36px minmax(0,1fr) auto'), 'task row should use tight fixed drag/check columns');
assert(html.includes('gap:8px;align-items:start'), 'task row should use compact gap');
assert(html.includes('border-radius:18px;padding:10px 12px'), 'task cards should use tighter left/right padding');
assert(html.includes('.task-main{grid-area:main;min-width:0;padding-left:0}'), 'task main should have no extra left padding');
assert(html.includes('.nav{flex-direction:row;flex-wrap:wrap;overflow-x:visible'), 'mobile navigation must wrap instead of horizontal scrolling');
assert(html.includes('max-width:100%;overflow-x:hidden'), 'mobile containers must prevent horizontal overflow');
assert(html.includes('.date-range-inline{width:100%}'), 'date metadata should be allowed to use the full compact row');
assert(html.includes('order-utils.js?v=24'), 'HTML cache bust must be bumped to v24');
assert(html.includes('task-inline-edit-utils.js?v=24'), 'inline utility cache bust must be bumped to v24');
assert(sw.includes('dailyflow-v24-responsive-spacing'), 'service worker cache must be bumped to v24');
console.log('PASS compact spacing v24 tests');
