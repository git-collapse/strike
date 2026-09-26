import fs from 'fs';

const data = fs.readFileSync('all_courses.json', 'utf8');
const urls = data.match(/https?:\/\/[^\s\"]+/g) || [];
const ytUrls = [...new Set(urls)].filter(u => u.includes('youtube') || u.includes('youtu.be'));
console.log(ytUrls);
