import fs from 'fs';

const code = fs.readFileSync('main.js', 'utf8');
const apis = code.match(/https?:\/\/[^\s"'`]+/g) || [];
const uniqueApis = [...new Set(apis)];

const filtered = uniqueApis.filter(u => 
  u.includes('api') || 
  u.includes('amazonaws') || 
  u.includes('cloudfront') ||
  u.includes('.json') ||
  u.includes('backend')
);

console.log('Endpoints found:');
console.log(filtered.join('\n'));
