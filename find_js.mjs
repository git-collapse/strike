import fs from 'fs';
const code = fs.readFileSync('raw_strike.html', 'utf8');
const js = code.match(/src=["']([^"']+\.js)["']/g);
console.log(js);
