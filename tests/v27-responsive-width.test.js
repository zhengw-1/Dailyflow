const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function assert(c,m){if(!c)throw new Error(m)}
assert(html.includes('.subtask > span[data-subtask-id]'), 'subtask title selector should not resize the tools span');
assert(html.includes('.subtask-tools{display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;min-width:0}'), 'subtask tools must stay fixed-width');
assert(html.includes('grid-template-columns:24px 30px minmax(0,1fr)'), 'small task rows should reserve most width for content');
assert(html.includes('padding:12px 5%') && html.includes('padding:9px 5%'), 'small layouts should keep about 10% total side padding');
assert(html.includes('overflow-wrap:anywhere'), 'long subtask text must wrap inside the card');
console.log('PASS v27 responsive width and overflow rules');
