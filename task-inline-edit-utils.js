(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.DailyFlowInlineEdit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function getTask(tasks,id){ return (tasks||[]).find(t=>t.id===id); }
  function updateCategory(tasks,id,category){
    const task=getTask(tasks,id); if(!task)return false;
    const clean=(category||'').trim(); if(!clean)return false;
    task.category=clean; return true;
  }
  function updatePriority(tasks,id,priority){
    const task=getTask(tasks,id); if(!task)return false;
    if(!['Low','Medium','High'].includes(priority))return false;
    task.priority=priority; return true;
  }
  function updateDueDate(tasks,id,due){
    const task=getTask(tasks,id); if(!task || !/^\d{4}-\d{2}-\d{2}$/.test(due||''))return false;
    if(task.start && due<task.start) return false;
    task.due=due;
    return true;
  }
  function updateStatus(tasks,id,status){
    const task=getTask(tasks,id); if(!task)return false;
    if(status==='completed'){
      task.completed=true;
      task.completedDate=null;
      (task.subtasks||[]).forEach(s=>s.done=true);
      return true;
    }
    if(status==='active'){
      task.completed=false;
      task.completedDate=null;
      (task.subtasks||[]).forEach(s=>s.done=false);
      return true;
    }
    return false;
  }
  function normalizeCategories(saved,tasks){
    const presets=['School','Work','Personal'];
    const out=[...presets];
    const seen=new Set(out.map(x=>x.toLowerCase()));
    for(const raw of [...(saved||[]), ...(tasks||[]).map(t=>t&&t.category)]){
      const clean=String(raw||'').trim();
      if(!clean) continue;
      const key=clean.toLowerCase();
      if(seen.has(key)) continue;
      seen.add(key); out.push(clean);
    }
    return out;
  }
  function addCategory(categories,name){
    const clean=String(name||'').trim(); if(!clean)return false;
    if((categories||[]).some(x=>String(x).toLowerCase()===clean.toLowerCase()))return false;
    categories.push(clean); return true;
  }
  function normalizeHexColor(value){
    const raw=String(value||'').trim().toLowerCase();
    if(/^#[0-9a-f]{6}$/.test(raw)) return raw;
    if(/^#[0-9a-f]{3}$/.test(raw)) return '#'+raw.slice(1).split('').map(x=>x+x).join('');
    return null;
  }
  function normalizeCategoryColors(saved,categories){
    const source=(saved && typeof saved==='object')?saved:{};
    const out={};
    for(const category of (categories||[])){
      const clean=String(category||'').trim();
      if(!clean) continue;
      out[clean]=normalizeHexColor(source[clean]) || '#e7f5ff';
    }
    return out;
  }
  function readableTextColor(hex){
    const clean=normalizeHexColor(hex) || '#e7f5ff';
    const r=parseInt(clean.slice(1,3),16), g=parseInt(clean.slice(3,5),16), b=parseInt(clean.slice(5,7),16);
    const lum=(0.2126*r+0.7152*g+0.0722*b)/255;
    return lum < .58 ? '#ffffff' : '#526274';
  }
  function formatDisplayDate(isoDate){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(isoDate||'')) return String(isoDate||'');
    const d=new Date(isoDate+'T12:00:00');
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  }
  function addSubtask(tasks,id,title,subtaskId){
    const task=getTask(tasks,id); const clean=(title||'').trim();
    if(!task || !clean)return false;
    task.subtasks=task.subtasks||[];
    task.subtasks.push({id:subtaskId,title:clean,done:false,order:task.subtasks.length});
    task.completed=false;
    task.completedDate=null;
    return true;
  }
  return {updateCategory,updatePriority,updateDueDate,updateStatus,addSubtask,normalizeCategories,addCategory,normalizeHexColor,normalizeCategoryColors,readableTextColor,formatDisplayDate};
});
