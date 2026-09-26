import fs from 'fs';
const code = fs.readFileSync('main.js', 'utf8');
const apis = code.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s"'`]+)?/gi) || [];
const apiCalls = apis.filter(u => u.includes('api') || u.includes('backend') || u.includes('strike') || u.includes('course'));
console.log([...new Set(apiCalls)].slice(0, 50));
