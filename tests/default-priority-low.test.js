
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

if(!html.includes('document.getElementById("priority").value="Low";')){
  throw new Error('New tasks must default priority to Low');
}
if(html.includes('document.getElementById("priority").value="Medium";')){
  throw new Error('New tasks must not default priority to Medium');
}
if(/id="reminder"/.test(html)){
  throw new Error('Reminder field must remain removed');
}
console.log('PASS new task default priority is Low and reminder stays removed');
