
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const utils=require(path.join(__dirname,'..','task-inline-edit-utils.js'));

function assert(cond,msg){ if(!cond) throw new Error(msg); }

assert(html.includes('pill-native-overlay'), 'native select/date controls must be overlayed instead of visible');
assert(html.includes('category-visible-text'), 'category pill needs visible text sized to its content');
assert(html.includes('due-visible-text'), 'due-date pill needs visible formatted text');
assert(html.includes('id="categoryColorPresets"'), 'task editor needs category color preset swatches');
assert(html.includes('id="customCategoryColor"'), 'task editor needs a custom color picker');
assert(html.includes('settings.categoryColors'), 'category colors must persist in settings');
assert(html.includes('categoryColorStyle(task.category)'), 'task card category pill must use saved category color');
assert(!html.includes('category-school{background:#eeeaff'), 'category presets must no longer have different hard-coded colors');

const colors=utils.normalizeCategoryColors({},['School','Work','Personal']);
assert(colors.School==='#e7f5ff' && colors.Work==='#e7f5ff' && colors.Personal==='#e7f5ff',
  'all three preset categories must default to pastel blue');

assert(utils.normalizeHexColor('#ABCDEF')==='#abcdef','custom hex colors should normalize');
assert(utils.normalizeHexColor('not-a-color')===null,'invalid custom colors should be rejected');

console.log('PASS category color + exact pill layout checks');
