import https from 'https';

https.get('https://www.youtube.com/results?search_query=DSA+Playlist+in+C%2B%2B+CoderArmy+playlist', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/list=(PL[A-Za-z0-9_-]+)/);
    console.log(match ? match[1] : 'No match');
  });
});
