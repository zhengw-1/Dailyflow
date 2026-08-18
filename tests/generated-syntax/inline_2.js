
const STORAGE_KEY = "dailyflow_tasks_v1";
const ARCHIVE_KEY = "dailyflow_archive_v1";
const SETTINGS_KEY = "dailyflow_settings_v1";

const iso = d => {
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
};
const getToday = () => iso(new Date());
let selectedDate = getToday();
let lastKnownToday = selectedDate;
let followRealToday = true;
const plusDays = n => { const d=new Date(); d.setDate(d.getDate()+n); return iso(d); };

const defaults = [
  {id:crypto.randomUUID(),title:"Complete discussion board reply",start:getToday(),due:getToday(),category:"School",priority:"High",reminder:"1 hour before",focus:true,completed:false,notes:"",subtasks:[
    {id:crypto.randomUUID(),title:"Read peer response",done:true},
    {id:crypto.randomUUID(),title:"Write reply in my voice",done:false}
  ]},
  {id:crypto.randomUUID(),title:"Organize portfolio images",start:getToday(),due:plusDays(3),category:"School",priority:"Medium",reminder:"Off",focus:true,completed:false,notes:"",subtasks:[
    {id:crypto.randomUUID(),title:"Select final images",done:false},
    {id:crypto.randomUUID(),title:"Rename files",done:false},
    {id:crypto.randomUUID(),title:"Upload to portfolio",done:false}
  ]},
  {id:crypto.randomUUID(),title:"Drink water and take a break",start:getToday(),due:getToday(),category:"Personal",priority:"Low",reminder:"Off",focus:false,completed:true,notes:"",subtasks:[]},
  {id:crypto.randomUUID(),title:"Prepare co-op documents",start:plusDays(1),due:plusDays(7),category:"Work",priority:"Medium",reminder:"1 day before",focus:false,completed:false,notes:"",subtasks:[
    {id:crypto.randomUUID(),title:"Check onboarding email",done:false},
    {id:crypto.randomUUID(),title:"Prepare ID documents",done:false}
  ]}
];

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || defaults;
let archive = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || "{}");
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"notifications":true}');
settings.categories = DailyFlowInlineEdit.normalizeCategories(settings.categories || ["School","Work","Personal"], tasks);
let pendingSubtasks = [];
let editingTaskId = null;
let currentFilter = "all";
let draggedTaskId = null;
let draggedSubtask = null;
tasks = DailyFlowOrder.normalizeItemOrder(tasks).map(task => ({
  ...task,
  subtasks: DailyFlowOrder.normalizeItemOrder(task.subtasks || [])
}));
function ordered(list){ return DailyFlowOrder.normalizeItemOrder(list); }
function normalizeOrder(){ tasks=DailyFlowOrder.normalizeItemOrder(tasks); }

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function showToast(msg){
  const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1800);
}
function taskPercent(task){
  if(task.subtasks && task.subtasks.length){
    return Math.round(task.subtasks.filter(s=>s.done).length/task.subtasks.length*100);
  }
  return task.completed ? 100 : 0;
}
function isTaskDone(task){
  return task.completed || (task.subtasks?.length && task.subtasks.every(s=>s.done));
}
function syncTaskCompletion(task){
  if(task.subtasks?.length) task.completed = task.subtasks.every(s=>s.done);
}
function pillSlug(value){ return String(value||"other").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "other"; }
function categorySelectWidth(value){ return `${Math.max(5,Math.min(36,[...String(value||"")].length+1))}ch`; }
function categoryOptions(selected){
  return settings.categories.map(c=>`<option value="${escapeHtml(c)}" ${selected===c?"selected":""}>${escapeHtml(c)}</option>`).join("");
}
function refreshCategoryField(selected){
  const el=document.getElementById("category"); if(!el)return;
  const chosen=selected || el.value || "School";
  el.innerHTML=categoryOptions(chosen);
  el.value=settings.categories.includes(chosen)?chosen:"School";
}
function renderTask(task){
  const pct=taskPercent(task);
  const overdue=DailyFlowOrder.isOverdue(task,selectedDate);
  return `
  <div class="task ${isTaskDone(task)?"completed":""} ${overdue?"overdue-card":""}" data-id="${task.id}" ondragover="allowTaskDrop(event,'${task.id}')" ondragleave="clearTaskDrop(event)" ondrop="dropTask(event,'${task.id}')">
    <div class="task-row">
      <button class="drag-handle" draggable="true" title="Drag to reorder" ondragstart="startTaskDrag(event,'${task.id}')" ondragend="endTaskDrag(event)">⋮⋮</button>
      <button class="check ${isTaskDone(task)?"checked":""}" onclick="toggleTask('${task.id}')"></button>
      <div>
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="meta">
          <span class="pill category-pill category-${pillSlug(task.category)} inline-control-pill">
            <select class="inline-select" style="width:${categorySelectWidth(task.category)}" title="Change category" onchange="inlineCategory('${task.id}',this.value)">
              ${categoryOptions(task.category)}
            </select>
          </span>
          <span class="date-range-inline">
            <span class="start-date-display">${DailyFlowInlineEdit.formatDisplayDate(task.start)}</span>
            <span class="date-arrow">→</span>
            <span class="pill blue inline-control-pill ${overdue?"due-emphasis":""}">
              <input class="inline-date" type="date" value="${task.due}" title="Change due date" onchange="inlineDueDate('${task.id}',this.value)">
            </span>
          </span>
          <span class="pill priority-pill priority-${pillSlug(task.priority)} inline-control-pill">
            <select class="inline-select" title="Change priority" onchange="inlinePriority('${task.id}',this.value)">
              ${["Low","Medium","High"].map(p=>`<option value="${p}" ${task.priority===p?"selected":""}>${p}</option>`).join("")}
            </select>
          </span>
          ${task.reminder!=="Off" ? `<span class="pill">🔔 ${task.reminder}</span>`:""}
        </div>
        ${task.subtasks?.length ? `
          <div class="task-progress"><span style="width:${pct}%"></span></div>
          <div class="subtasks">
            ${ordered(task.subtasks).map(s=>`
              <div class="subtask ${s.done?"done":""}" data-subtask-id="${s.id}" ondragover="allowSubtaskDrop(event,'${task.id}','${s.id}')" ondragleave="clearSubtaskDrop(event)" ondrop="dropSubtask(event,'${task.id}','${s.id}')">
                <button class="subtask-drag-handle" draggable="true" title="Drag to reorder subtask" ondragstart="startSubtaskDrag(event,'${task.id}','${s.id}')" ondragend="endSubtaskDrag(event)">⋮⋮</button>
                <button class="mini-check ${s.done?"done":""}" onclick="toggleSubtask('${task.id}','${s.id}')"></button>
                <span>${escapeHtml(s.title)}</span>
              </div>`).join("")}
          </div>`:""}
        <div class="quick-subtask-row">
          <button class="quick-subtask-btn" type="button" onclick="showQuickSubtask('${task.id}')">+ Subtask</button>
          <div class="quick-subtask-editor" id="quick-subtask-${task.id}">
            <input id="quick-subtask-input-${task.id}" placeholder="Add subtask" onkeydown="quickSubtaskKey(event,'${task.id}')">
            <button type="button" class="primary-btn" onclick="saveQuickSubtask('${task.id}')">Add</button>
            <button type="button" class="secondary-btn" onclick="hideQuickSubtask('${task.id}')">Cancel</button>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button title="Edit task" onclick="editTask('${task.id}')">✎</button>
        <button title="Set focus" onclick="toggleFocus('${task.id}')">★</button>
        <button title="Delete" onclick="deleteTask('${task.id}')">×</button>
      </div>
    </div>
  </div>`;
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
}
window.toggleTask=id=>{
  const t=tasks.find(x=>x.id===id); if(!t)return;
  const next=!isTaskDone(t);
  t.completed=next;
  if(!next)t.completedDate=null;
  if(t.subtasks?.length) t.subtasks.forEach(s=>s.done=next);
  save(); render(); showToast(next?"Task completed":"Task moved back to active");
};
window.toggleSubtask=(tid,sid)=>{
  const t=tasks.find(x=>x.id===tid); const s=t?.subtasks.find(x=>x.id===sid); if(!s)return;
  s.done=!s.done; syncTaskCompletion(t);
  if(!isTaskDone(t))t.completedDate=null;
  save(); render();
};
window.deleteTask=id=>{
  tasks=tasks.filter(t=>t.id!==id); save(); render(); showToast("Task deleted");
};
window.toggleFocus=id=>{
  const t=tasks.find(x=>x.id===id); if(!t)return;
  t.focus=!t.focus; save(); render(); showToast(t.focus?"Added to Daily Focus":"Removed from Daily Focus");
};
window.inlineCategory=(id,value)=>{
  if(DailyFlowInlineEdit.updateCategory(tasks,id,value)){save();render();showToast(`Category changed to ${value}`);}
};
window.inlinePriority=(id,value)=>{
  if(DailyFlowInlineEdit.updatePriority(tasks,id,value)){save();render();showToast(`Priority changed to ${value}`);}
};
window.inlineDueDate=(id,value)=>{
  if(DailyFlowInlineEdit.updateDueDate(tasks,id,value)){save();render();showToast("Due date updated");}
  else { render(); showToast("Due date cannot be earlier than the start date"); }
};
window.showQuickSubtask=id=>{
  document.getElementById(`quick-subtask-${id}`)?.classList.add("open");
  setTimeout(()=>document.getElementById(`quick-subtask-input-${id}`)?.focus(),0);
};
window.hideQuickSubtask=id=>{
  const editor=document.getElementById(`quick-subtask-${id}`);
  const input=document.getElementById(`quick-subtask-input-${id}`);
  editor?.classList.remove("open"); if(input)input.value="";
};
window.saveQuickSubtask=id=>{
  const input=document.getElementById(`quick-subtask-input-${id}`);
  if(!input)return;
  const title=input.value.trim(); if(!title){showToast("Enter a subtask first");return;}
  if(DailyFlowInlineEdit.addSubtask(tasks,id,title,crypto.randomUUID())){save();render();showToast("Subtask added");}
};
window.quickSubtaskKey=(event,id)=>{
  if(event.key==="Enter"){event.preventDefault();saveQuickSubtask(id);}
  if(event.key==="Escape"){event.preventDefault();hideQuickSubtask(id);}
};

window.startTaskDrag=(event,id)=>{
  draggedTaskId=id;
  event.dataTransfer.effectAllowed="move";
  event.dataTransfer.setData("text/plain",id);
  event.currentTarget.closest(".task")?.classList.add("dragging");
};
function clearDropLines(selector=".drop-before,.drop-after"){
  document.querySelectorAll(selector).forEach(x=>x.classList.remove("drop-before","drop-after"));
}
function dropPositionForEvent(event,element){
  const rect=element.getBoundingClientRect();
  return event.clientY < rect.top + rect.height/2 ? "before" : "after";
}
window.allowTaskDrop=(event,id)=>{
  if(!draggedTaskId || draggedTaskId===id)return;
  event.preventDefault();
  const el=event.currentTarget;
  el.classList.remove("drop-before","drop-after");
  el.classList.add(`drop-${dropPositionForEvent(event,el)}`);
};
window.clearTaskDrop=event=>event.currentTarget.classList.remove("drop-before","drop-after");
window.endTaskDrag=event=>{
  event.currentTarget.closest(".task")?.classList.remove("dragging");
  clearDropLines();
  draggedTaskId=null;
};
window.dropTask=(event,targetId)=>{
  event.preventDefault();
  const el=event.currentTarget;
  const position=dropPositionForEvent(event,el);
  el.classList.remove("drop-before","drop-after");
  const sourceId=draggedTaskId || event.dataTransfer.getData("text/plain");
  if(!sourceId || sourceId===targetId)return;
  tasks=DailyFlowOrder.reorderById(tasks,sourceId,targetId,position);
  save(); render(); showToast("Task order updated");
};

window.startSubtaskDrag=(event,taskId,subtaskId)=>{
  draggedSubtask={taskId,subtaskId};
  event.stopPropagation();
  event.dataTransfer.effectAllowed="move";
  event.dataTransfer.setData("text/plain",`${taskId}:${subtaskId}`);
  event.currentTarget.closest(".subtask")?.classList.add("dragging");
};
window.allowSubtaskDrop=(event,taskId,targetSubtaskId)=>{
  if(!draggedSubtask || draggedSubtask.taskId!==taskId || draggedSubtask.subtaskId===targetSubtaskId)return;
  event.preventDefault();
  event.stopPropagation();
  const el=event.currentTarget;
  el.classList.remove("drop-before","drop-after");
  el.classList.add(`drop-${dropPositionForEvent(event,el)}`);
};
window.clearSubtaskDrop=event=>{ event.currentTarget.classList.remove("drop-before","drop-after"); };
window.endSubtaskDrag=event=>{
  event.currentTarget.closest(".subtask")?.classList.remove("dragging");
  clearDropLines(".subtask.drop-before,.subtask.drop-after");
  draggedSubtask=null;
};
window.dropSubtask=(event,taskId,targetSubtaskId)=>{
  event.preventDefault();
  event.stopPropagation();
  const el=event.currentTarget;
  const position=dropPositionForEvent(event,el);
  el.classList.remove("drop-before","drop-after");
  const task=tasks.find(t=>t.id===taskId);
  if(!task)return;
  let sourceSubtaskId=draggedSubtask?.subtaskId;
  if(!sourceSubtaskId){
    const raw=event.dataTransfer.getData("text/plain");
    const parts=raw.split(":");
    if(parts[0]===taskId)sourceSubtaskId=parts.slice(1).join(":");
  }
  if(!sourceSubtaskId || sourceSubtaskId===targetSubtaskId)return;
  task.subtasks=DailyFlowOrder.reorderById(task.subtasks||[],sourceSubtaskId,targetSubtaskId,position);
  save(); render(); showToast("Subtask order updated");
};

function updateSelectedDateHeader(){
  const d=new Date(selectedDate+"T12:00:00");
  const isToday=selectedDate===getToday();
  document.getElementById("pageTitle").textContent=isToday?"Today":d.toLocaleDateString(undefined,{month:"long",day:"numeric"});
  document.getElementById("dateText").textContent=d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
}
window.selectCalendarDate=date=>{
  selectedDate=date;
  followRealToday=date===getToday();
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.view==="today"));
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById("todayView").classList.add("active");
  updateSelectedDateHeader(); render();
};

function render(){
  const isLiveToday=followRealToday && selectedDate===getToday();
  const todays=ordered(DailyFlowOrder.activeTasksForDate(tasks,selectedDate,isLiveToday));
  const visible=todays.filter(t=>currentFilter==="all" || (currentFilter==="done"?isTaskDone(t):!isTaskDone(t)));
  document.getElementById("todayTasks").innerHTML=visible.length?visible.map(renderTask).join(""):`<div class="empty">No tasks in this view.</div>`;
  document.getElementById("todayCount").textContent=todays.length;

  const totalUnits=todays.reduce((sum,t)=>sum+(t.subtasks?.length||1),0);
  const doneUnits=todays.reduce((sum,t)=>sum+(t.subtasks?.length?t.subtasks.filter(s=>s.done).length:(isTaskDone(t)?1:0)),0);
  const pct=totalUnits?Math.round(doneUnits/totalUnits*100):0;
  document.getElementById("progressCopy").textContent=`${doneUnits} of ${totalUnits} completed`;
  document.getElementById("progressNumber").textContent=`${pct}%`;
  document.getElementById("progressFill").style.width=`${pct}%`;

  const focus=todays.filter(t=>t.focus && !isTaskDone(t)).slice(0,3);
  document.getElementById("focusItems").innerHTML=focus.length?focus.map(t=>`<div class="focus-chip">${escapeHtml(t.title)}</div>`).join(""):`<div style="color:var(--muted);font-size:14px">Choose up to three focus tasks using ★.</div>`;

  const upcoming=ordered(tasks.filter(t=>t.start>getToday() || t.due>getToday())).sort((a,b)=>a.due.localeCompare(b.due)||(a.order??0)-(b.order??0));
  document.getElementById("upcomingTasks").innerHTML=upcoming.length?upcoming.map(renderTask).join(""):`<div class="empty">No upcoming tasks.</div>`;
  document.getElementById("allTasks").innerHTML=tasks.length?ordered(tasks).map(renderTask).join(""):`<div class="empty">No tasks yet.</div>`;

  renderCompleted();
  renderCalendar();
  renderDeadlines();
  renderTimeline();

  const sw=document.getElementById("notificationSwitch");
  sw.classList.toggle("on",settings.notifications);
}
function renderCompleted(){
  const groups={};
  tasks.filter(t=>Boolean(t.completedDate)).forEach(t=>{
    const d=t.completedDate;
    if(!groups[d])groups[d]=[];
    groups[d].push(t);
  });
  const dates=Object.keys(groups).sort().reverse();
  document.getElementById("completedHistory").innerHTML=dates.length?dates.map(d=>`
    <div class="completed-day">
      <h3>${new Date(d+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</h3>
      <div class="task-list">${ordered(groups[d]).map(renderTask).join("")}</div>
    </div>`).join(""):`<div class="empty">Completed tasks will appear here by date. Uncheck any task to move it back.</div>`;
}
function buildCalendarHTML(large=false){
  const now=new Date(), y=now.getFullYear(), m=now.getMonth();
  const first=new Date(y,m,1), days=new Date(y,m+1,0).getDate();
  let cells=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>`<div class="dow">${d}</div>`);
  for(let i=0;i<first.getDay();i++)cells.push("<div></div>");
  for(let d=1;d<=days;d++){
    const date=iso(new Date(y,m,d));
    const has=DailyFlowOrder.activeTasksForDate(tasks,date,date===getToday()).length>0 || tasks.some(t=>t.completedDate===date);
    cells.push(`<div class="date-cell ${date===getToday()?"today":""} ${date===selectedDate?"selected":""} ${has?"has-task":""}" onclick="selectCalendarDate('${date}')">${d}</div>`);
  }
  return `<div class="calendar-grid">${cells.join("")}</div>`;
}
function renderCalendar(){
  const now=new Date();
  document.getElementById("monthLabel").textContent=now.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  document.getElementById("miniCalendar").innerHTML=buildCalendarHTML();
  document.getElementById("largeCalendar").innerHTML=buildCalendarHTML(true);
}
function renderDeadlines(){
  const upcoming=tasks.filter(t=>!isTaskDone(t) && t.due>=getToday()).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,4);
  document.getElementById("deadlineList").innerHTML=upcoming.length?upcoming.map(t=>`
    <div class="deadline"><div class="dot"></div><div><strong>${escapeHtml(t.title)}</strong><small>${t.due} · ${t.category}</small></div></div>`).join(""):`<div style="color:var(--muted);font-size:14px">No upcoming deadlines.</div>`;
}
function renderTimeline(){
  const rows=ordered(tasks.filter(t=>t.due>=getToday())).slice(0,8).map(t=>{
    const start=new Date(t.start), due=new Date(t.due);
    const span=Math.max(1,Math.round((due-start)/86400000)+1);
    const width=Math.min(100,15+span*8);
    return `<div class="timeline-row"><div><strong>${escapeHtml(t.title)}</strong><div style="font-size:12px;color:var(--muted)">${t.start} → ${t.due}</div></div><div class="bar-bg"><div class="bar" style="width:${width}%"></div></div></div>`;
  }).join("");
  document.getElementById("timelineRows").innerHTML=rows||`<div class="empty">No timeline tasks.</div>`;
}

const modal=document.getElementById("taskModal");
function renderPendingSubtasks(){
  pendingSubtasks=DailyFlowOrder.normalizeItemOrder(pendingSubtasks);
  document.getElementById("subtaskTags").innerHTML=pendingSubtasks.map((x,i)=>`<span class="subtask-tag">
    <button type="button" title="Move earlier" onclick="movePendingSubtask(${i},-1)" style="border:0;background:transparent;color:#6653c5;font-weight:800" ${i===0?"disabled":""}>↑</button>
    <button type="button" title="Move later" onclick="movePendingSubtask(${i},1)" style="border:0;background:transparent;color:#6653c5;font-weight:800" ${i===pendingSubtasks.length-1?"disabled":""}>↓</button>
    ${escapeHtml(x.title)} <button type="button" onclick="removePendingSubtask(${i})" style="border:0;background:transparent;color:#6653c5;font-weight:800">×</button></span>`).join("");
}
window.removePendingSubtask=i=>{ pendingSubtasks.splice(i,1); renderPendingSubtasks(); };
window.movePendingSubtask=(i,direction)=>{
  const target=i+direction;
  if(target<0 || target>=pendingSubtasks.length)return;
  [pendingSubtasks[i],pendingSubtasks[target]]=[pendingSubtasks[target],pendingSubtasks[i]];
  pendingSubtasks=pendingSubtasks.map((item,index)=>({...item,order:index}));
  renderPendingSubtasks();
};
function resetForm(){
  ["taskName","notes","subtaskInput"].forEach(id=>document.getElementById(id).value="");
  refreshCategoryField("School");
  document.getElementById("newCategoryName").value="";
  document.getElementById("priority").value="Medium";
  document.getElementById("reminder").value="Off";
  document.getElementById("focus").value="false";
  pendingSubtasks=[]; renderPendingSubtasks();
}
function openModal(task=null){
  modal.classList.add("open");
  editingTaskId=task?.id||null;
  document.getElementById("modalTitle").textContent=task?"Edit Task":"Add a Task";
  document.getElementById("saveTask").textContent=task?"Save Changes":"Save Task";
  if(task){
    document.getElementById("taskName").value=task.title;
    document.getElementById("startDate").value=task.start;
    document.getElementById("dueDate").value=task.due;
    refreshCategoryField(task.category);
    document.getElementById("priority").value=task.priority;
    document.getElementById("reminder").value=task.reminder;
    document.getElementById("focus").value=String(Boolean(task.focus));
    document.getElementById("notes").value=task.notes||"";
    pendingSubtasks=(task.subtasks||[]).map(x=>({...x}));
  }else{
    resetForm();
    document.getElementById("startDate").value=selectedDate;
    document.getElementById("dueDate").value=selectedDate;
  }
  renderPendingSubtasks();
}
window.editTask=id=>{ const task=tasks.find(x=>x.id===id); if(task)openModal(task); };
function closeModal(){modal.classList.remove("open"); editingTaskId=null; resetForm();}
document.getElementById("openModal").onclick=()=>openModal();
document.getElementById("closeModal").onclick=closeModal;
document.getElementById("cancelModal").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});

document.getElementById("saveNewCategory").onclick=()=>{
  const input=document.getElementById("newCategoryName");
  const name=input.value.trim();
  if(!name){showToast("Enter a category name");return;}
  if(DailyFlowInlineEdit.addCategory(settings.categories,name)){
    settings.categories=DailyFlowInlineEdit.normalizeCategories(settings.categories,tasks);
    save(); refreshCategoryField(name); input.value=""; render(); showToast("Category saved");
  }else{
    const existing=settings.categories.find(c=>c.toLowerCase()===name.toLowerCase());
    refreshCategoryField(existing||"School"); input.value=""; showToast("Category already saved");
  }
};

document.getElementById("addSubtask").onclick=()=>{
  const input=document.getElementById("subtaskInput");
  const val=input.value.trim(); if(!val)return;
  pendingSubtasks.push({id:crypto.randomUUID(),title:val,done:false,order:pendingSubtasks.length}); input.value=""; renderPendingSubtasks();
};
document.getElementById("saveTask").onclick=()=>{
  const title=document.getElementById("taskName").value.trim();
  if(!title){showToast("Please enter a task name");return}
  const start=document.getElementById("startDate").value||selectedDate;
  const due=document.getElementById("dueDate").value||start;
  const chosenCategory=document.getElementById("category").value;
  DailyFlowInlineEdit.addCategory(settings.categories,chosenCategory);
  settings.categories=DailyFlowInlineEdit.normalizeCategories(settings.categories,tasks);
  const data={
    title,start,due,category:chosenCategory,
    priority:document.getElementById("priority").value,reminder:document.getElementById("reminder").value,
    focus:document.getElementById("focus").value==="true",notes:document.getElementById("notes").value,
    subtasks:DailyFlowOrder.normalizeItemOrder(pendingSubtasks)
  };
  if(editingTaskId){
    const t=tasks.find(x=>x.id===editingTaskId);
    if(t){Object.assign(t,data); syncTaskCompletion(t); t.completedDate=isTaskDone(t)?(t.completedDate||getToday()):null;}
  }else{
    tasks.push({id:crypto.randomUUID(),completed:false,completedDate:null,order:tasks.length,...data});
  }
  const wasEditing=Boolean(editingTaskId);
  save();closeModal();render();showToast(wasEditing?"Task updated":"Task added");
};

document.querySelectorAll(".filter-btn").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");currentFilter=b.dataset.filter;render();
});
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById(b.dataset.view+"View").classList.add("active");
  if(b.dataset.view==="today"){
    followRealToday=true;
    selectedDate=getToday();
    updateSelectedDateHeader();
  }else{
    document.getElementById("pageTitle").textContent=b.textContent.trim().replace(/\d+$/," ").trim();
    document.getElementById("dateText").textContent="";
  }
  render();
});
document.getElementById("notificationSwitch").onclick=()=>{
  settings.notifications=!settings.notifications;save();render();showToast(settings.notifications?"Notifications on":"Notifications off");
};
document.getElementById("archiveDay").onclick=()=>{
  const before=tasks.filter(t=>!t.completedDate && t.start<=selectedDate && isTaskDone(t)).length;
  tasks=DailyFlowOrder.finishDay(tasks,selectedDate);
  save();render();
  if(before){
    showToast(`${before} checked task${before===1?"":"s"} moved to Completed. Unfinished tasks will carry forward.`);
  }else{
    showToast("No checked tasks to move. Unfinished tasks will carry forward.");
  }
};
document.getElementById("toggleTimeline").onclick=()=>{
  const p=document.getElementById("timelinePanel");
  const open=p.style.display!=="none"; p.style.display=open?"none":"block";
  document.getElementById("toggleTimeline").textContent=open?"Show Timeline":"Hide Timeline";
};

function checkRealDateRollover(){
  const nowToday=getToday();
  if(nowToday===lastKnownToday)return;
  const previousToday=lastKnownToday;
  lastKnownToday=nowToday;
  if(followRealToday && selectedDate===previousToday){
    selectedDate=nowToday;
    updateSelectedDateHeader();
    render();
    showToast("A new day has started. Unfinished tasks carried forward.");
  }
}
setInterval(checkRealDateRollover,60000);
window.addEventListener("focus",checkRealDateRollover);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkRealDateRollover();});

updateSelectedDateHeader();
normalizeOrder(); save(); render();
