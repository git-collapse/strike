import fs from 'fs';
const code = fs.readFileSync('main.js', 'utf8');
const apis = code.match(/['"`]\/[a-zA-Z0-9_\-\/]*api[a-zA-Z0-9_\-\/]*['"`]/gi) || [];
console.log([...new Set(apis)]);
