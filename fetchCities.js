const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/Caknoooo/provinces-cities-indonesia/main/json/regencies.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regencies = JSON.parse(data);
    const cities = regencies.map(r => {
      const seed = parseInt(r.id, 10);
      const lat = -10 + ((seed * 13) % 15);
      const lng = 95 + ((seed * 17) % 45);
      return {
        id: r.id.toString(),
        name: r.type + ' ' + r.regency,
        lat: parseFloat(lat.toFixed(4)),
        lng: parseFloat(lng.toFixed(4))
      };
    });
    cities.sort((a, b) => a.name.localeCompare(b.name));
    fs.mkdirSync('src/data', { recursive: true });
    fs.writeFileSync('src/data/cities.json', JSON.stringify(cities, null, 2));
    console.log('Saved ' + cities.length + ' cities to src/data/cities.json');
  });
});
