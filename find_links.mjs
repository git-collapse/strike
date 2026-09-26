import fs from 'fs';
const data = fs.readFileSync('api_responses.json', 'utf8');
const urls = data.match(/https?:\/\/[^\s"'`]+/g) || [];
console.log([...new Set(urls)].filter(u => u.toLowerCase().includes('plus') || u.toLowerCase().includes('ultra') || u.toLowerCase().includes('plan') || u.toLowerCase().includes('pricing')));
