const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
const order=require("../order-utils.js");
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('id="dueTime"'),"main task due time picker missing");
assert(html.includes('id="subtaskTime"'),"subtask due time picker missing");
assert(html.includes('settings.manualTaskOrder=true'),"manual task order persistence missing");
assert(html.includes('DailyFlowOrder.orderFocusItems'),"Daily Focus manual ordering missing");
assert(html.includes('startFocusDrag'),"Daily Focus drag handler missing");
const items=[{id:"a",order:0,due:"2026-09-20",subtasks:[]},{id:"b",order:1,due:"2026-09-10",subtasks:[]}];
assert(order.orderForDisplay(items,"2026-09-16",{manual:true}).map(x=>x.id).join(",")==="a,b","manual order must override overdue bucket");
assert(order.orderFocusItems([{id:"a",focus:true},{id:"b",focus:true}], ["b","a"]).map(x=>x.id).join(",")==="b,a","focus order should follow saved order");
console.log("PASS v25 manual order, due-time, and Daily Focus checks");
