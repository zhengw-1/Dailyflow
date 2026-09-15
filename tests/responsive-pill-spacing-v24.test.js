const assert = require("assert");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const sw = fs.readFileSync(path.join(__dirname,"..","service-worker.js"),"utf8");

assert(html.includes("padding:2px 0 8px"), "compact task actions should have vertical breathing room");
assert(html.includes("padding-top:4px"), "tablet task content should have top spacing below controls");
assert(html.includes("padding-top:5px"), "phone task content should have top spacing below controls");
assert(html.includes("row-gap:7px"), "metadata pills should have vertical spacing when wrapping");
assert(html.includes("row-gap:6px"), "action buttons should have vertical spacing when wrapping");
assert(html.includes("max-width:100%;overflow-x:hidden"), "mobile layout should prevent horizontal overflow");
assert(html.includes("date-range-inline{width:100%}"), "phone date row should use full width");
console.log("PASS responsive pill spacing v24 tests");
