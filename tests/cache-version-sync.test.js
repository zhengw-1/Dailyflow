
const fs=require('fs');
const path=require('path');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');
const order=fs.readFileSync(path.join(__dirname,'..','order-utils.js'),'utf8');

function assert(cond,msg){ if(!cond) throw new Error(msg); }

assert(order.includes('function applyOverduePriority'), 'order-utils must contain overdue priority function');
assert(html.includes('./order-utils.js?v=17'), 'index must cache-bust order-utils');
assert(html.includes('./task-inline-edit-utils.js?v=17'), 'index must cache-bust inline utility');
assert(/const CACHE\s*=\s*"dailyflow-v17-settings-backup"/.test(sw),
  'service worker cache name must be bumped using the actual CACHE constant');
assert(sw.includes('"./order-utils.js?v=17"'), 'service worker must cache the versioned order utility');
assert(sw.includes('"./task-inline-edit-utils.js?v=17"'), 'service worker must cache the versioned inline utility');

console.log('PASS recovery cache/version synchronization');
