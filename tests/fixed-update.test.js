
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const order=fs.readFileSync(path.join(__dirname,"..","order-utils.js"),"utf8");
const sw=fs.readFileSync(path.join(__dirname,"..","service-worker.js"),"utf8");
function a(c,m){if(!c)throw new Error(m)}
a(order.includes("function orderForDisplay"),"orderForDisplay definition missing");
a(order.includes("return { orderForDisplay"),"orderForDisplay export missing");
a(html.includes("order-utils.js?v=18"),"HTML utility version not bumped");
a(sw.includes("order-utils.js?v=18"),"SW utility version not bumped");
a(sw.includes('dailyflow-v19-ordering-inline-edit-fixed'),"SW cache version not bumped");
a(html.includes("DailyFlowOrder.orderForDisplay"),"App must use display ordering");
a(html.includes("function enableSubtaskDoubleClickEditing"),"Inline subtask editing missing");
a(html.includes("exportBackupBtn")&&html.includes("restoreBackupBtn"),"Backup/restore missing");
console.log("PASS fixed update checks");
