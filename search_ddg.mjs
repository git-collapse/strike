(async () => {
  const q = encodeURIComponent('Rohit Negi Coder Army profile');
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${q}`);
  const html = await res.text();
  const urls = html.match(/https:\/\/[^\s\"\'\>]+/g);
  if (urls) {
    console.log(urls.filter(u => u.includes('image') || u.includes('photo') || u.includes('pic') || u.includes('profile') || u.includes('media')));
  }
})();
