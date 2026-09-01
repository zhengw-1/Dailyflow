
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const order=fs.readFileSync(path.join(__dirname,"..","order-utils.js"),"utf8");
function a(c,m){if(!c)throw new Error(m)}
a(html.includes('localStorage.getItem(STORAGE_KEY) || "null") || []'),"Fresh app must not seed demo tasks");
a(html.includes('createdAt:new Date().toISOString()'),"New tasks must record creation time");
a(html.includes('function enableSubtaskDoubleClickEditing'),"Double-click subtask editor missing");
a(html.includes('data-subtask-id="${s.id}"'),"Subtask must expose its id");
a(html.includes('requestAnimationFrame(enableSubtaskDoubleClickEditing)'),"Inline editor hook missing");
a(order.includes("function orderForDisplay"),"Display ordering function missing");
a(order.includes("overdue.push(item)"),"Overdue section missing");
a(order.includes("starred.push(item)"),"Starred section missing");
a(order.includes("newest.push(item)"),"New task section missing");
a(order.includes("return [...overdue, ...starred, ...newest, ...normal]"),"Ordering sequence incorrect");
a(html.includes("exportBackupBtn") && html.includes("restoreBackupBtn"),"Backup/restore must remain");
console.log("PASS new DailyFlow updates");
