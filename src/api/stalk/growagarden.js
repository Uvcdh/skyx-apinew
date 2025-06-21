const axios = require('axios');
const { createCanvas } = require('canvas');

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

module.exports = function (app) {
  app.get('/stalk/grow', async (req, res) => {
    try {
      // Ambil data dari API Grow A Garden
      const [stockRes, specialRes, weatherRes] = await Promise.all([
        axios.get("https://growagardenstock.com/api/stock"),
        axios.get("https://growagardenstock.com/api/special-stock"),
        axios.get("https://growagardenstock.com/api/stock/weather"),
      ]);

      const stock = stockRes.data;
      const special = specialRes.data;
      const weather = weatherRes.data;

      // Siapkan canvas
      const width = 1000;
      const height = 800;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Latar belakang
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      // Judul
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 28px Sans-serif";
      ctx.fillText("Grow A Garden Stock Dashboard", 40, 50);

      // Waktu
      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px Sans-serif";
      ctx.fillText("Updated: " + new Date(stock.updatedAt).toLocaleString(), 40, 80);

      let y = 130;
      const maxWidth = 900;
      const lineHeight = 24;

      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Sans-serif";
      ctx.fillText("STOCK", 40, y);

      ctx.font = "16px Sans-serif";
      y = wrapText(ctx, "Gear: " + stock.gear.map(i => i.replace(/\*\*/g, "")).join(", "), 60, y + 30, maxWidth, lineHeight);
      y = wrapText(ctx, "Seeds: " + stock.seeds.map(i => i.replace(/\*\*/g, "")).join(", "), 60, y, maxWidth, lineHeight);
      y = wrapText(ctx, "Eggs: " + stock.egg.map(i => i.replace(/\*\*/g, "")).join(", "), 60, y, maxWidth, lineHeight);

      y += 30;
      ctx.font = "22px Sans-serif";
      ctx.fillText("SPECIAL STOCK", 40, y);
      ctx.font = "16px Sans-serif";
      y = wrapText(ctx, "Honey: " + special.honey.map(i => i.replace(/\*\*/g, "")).join(", "), 60, y + 30, maxWidth, lineHeight);
      y = wrapText(ctx, "Cosmetics: " + special.cosmetics.map(i => i.replace(/\*\*/g, "")).join(", "), 60, y, maxWidth, lineHeight);

      y += 30;
      ctx.font = "22px Sans-serif";
      ctx.fillText("WEATHER", 40, y);
      ctx.font = "16px Sans-serif";
      y = wrapText(ctx, `${weather.currentWeather} (${weather.weatherType})`, 60, y + 30, maxWidth, lineHeight);
      y = wrapText(ctx, "Description: " + weather.description, 60, y, maxWidth, lineHeight);
      y = wrapText(ctx, "Effect: " + weather.effectDescription, 60, y, maxWidth, lineHeight);
      y = wrapText(ctx, "Rarity: " + weather.rarity, 60, y, maxWidth, lineHeight);

      // Convert canvas to buffer
      const buffer = canvas.toBuffer('image/png');

      // Kirim sebagai response PNG
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
      });
      res.end(buffer);

    } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
    }
  });
};
