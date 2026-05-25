const fs = require('fs');
const s = fs.readFileSync('C:/yogesh/New folder (3)/date-picker/_bundle.js', 'utf8');
const i = s.indexOf('.hero-inner');
console.log('probe index:', i);
if (i < 0) { console.log('not found'); process.exit(0); }
// Walk backward to find the opening backtick of the template literal
let start = -1;
for (let k = i; k > 0; k--) {
  if (s[k] === '`') { start = k + 1; break; }
}
// Walk forward to find the closing backtick (skip escaped backticks)
let end = -1;
for (let k = i; k < s.length; k++) {
  if (s[k] === '`' && s[k-1] !== '\\') { end = k; break; }
}
console.log('start:', start, 'end:', end, 'length:', end - start);
fs.writeFileSync('C:/yogesh/New folder (3)/date-picker/_pagecss.txt', s.substring(start, end));
