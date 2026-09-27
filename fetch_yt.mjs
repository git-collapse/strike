(async () => {
  const getAvatar = async (username) => {
    const res = await fetch('https://www.youtube.com/@' + username);
    const html = await res.text();
    const match = html.match(/https:\/\/yt3\.googleusercontent\.com\/[^\"\']+/);
    console.log(username, match ? match[0] : 'not found');
  };
  await getAvatar('RohitNegi9');
  await getAvatar('adityatandon_');
})();
