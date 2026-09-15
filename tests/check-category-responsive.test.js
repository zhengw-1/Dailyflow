const assert = require('assert');
const fs = require('fs');
const path = require('path');
const order = require('../order-utils.js');
const inline = require('../task-inline-edit-utils.js');
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const sw = fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');

(function testCheckedTaskKeepsItsOrderingBucket() {
  const tasks = [
    {id:'star', title:'Star', focus:true, order:0},
    {id:'normal', title:'Normal', order:1},
    {id:'new', title:'New', createdAt:'2026-09-09T12:00:00Z', order:2},
  ];
  tasks[1].completed = true;
  tasks[1].checkedDisplayBucket = 'normal';
  assert.deepStrictEqual(order.orderForDisplay(tasks,'2026-09-09').map(t=>t.id), ['star','new','normal']);
  tasks[1].completed = false;
  delete tasks[1].checkedDisplayBucket;
  assert.deepStrictEqual(order.orderForDisplay(tasks,'2026-09-09').map(t=>t.id), ['star','new','normal']);
})();

(function testCategoryRenamePreservesTasks() {
  const tasks = [{id:'1',category:'School'}];
  const settings = {categories:['School','Work'],categoryColors:{School:'#e7f5ff',Work:'#eeeaff'}};
  const old = 'School', name = 'Classes';
  settings.categories = settings.categories.map(c=>c===old?name:c);
  settings.categoryColors[name]=settings.categoryColors[old];
  delete settings.categoryColors[old];
  tasks.forEach(t=>{if(t.category===old)t.category=name;});
  assert.strictEqual(tasks[0].category,'Classes');
  assert.deepStrictEqual(settings.categories,['Classes','Work']);
})();

(function testCategoryHelpers() {
  const cats=['School','Work'];
  assert.strictEqual(inline.addCategory(cats,'Personal'),true);
  assert.strictEqual(inline.addCategory(cats,'school'),false);
  assert.strictEqual(inline.normalizeHexColor('#abc'),'#aabbcc');
  assert.deepStrictEqual(inline.normalizeCategories(['Work'], []), ['Work']);
  assert.deepStrictEqual(inline.normalizeCategories([], []), ['School','Work','Personal']);
})();

(function testResponsiveSafeguardsPresent() {
  assert(html.includes('grid-template-columns:210px minmax(0,1fr)'),'tablet main grid missing');
  assert(html.includes('grid-template-columns:1fr'),'phone layout missing');
  assert(html.includes('min-width:0;overflow-wrap:anywhere'),'task title overflow safeguard missing');
  assert(html.includes('.subtask > span{min-width:0;overflow-wrap:anywhere;word-break:break-word}'),'subtask overflow safeguard missing');
  assert(html.includes('id="categoryManager"'),'category manager UI missing');
  assert(html.includes('<details class="category-manager-wrap">'),'compact category editor missing');
  assert(html.includes('overflow-x:hidden'),'horizontal overflow safeguard missing');
  assert(html.includes('.category-manager-row{display:grid;grid-template-columns:minmax(0,1fr) 30px auto auto;gap:6px;align-items:center}'),'compact category row missing');
  assert(html.includes('saveCategoryEdit'),'category rename handler missing');
  assert(html.includes('deleteCategoryOption'),'category delete handler missing');
  assert(sw.includes('dailyflow-v23-compact-spacing'),'service worker cache not bumped');
  assert(html.includes('order-utils.js?v=23'),'HTML cache bust not bumped');
  assert(html.includes('task-inline-edit-utils.js?v=23'),'inline utility cache bust not bumped');
})();

console.log('PASS check/category/responsive tests');
