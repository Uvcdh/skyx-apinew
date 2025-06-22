const { createCanvas } = require('canvas');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = function(app) {
  app.get('/tools/ngl', async (req, res) => {
    const { title, text } = req.query;
    
    if (!title || !text) {
      return res.status(400).json({
        status: false,
        error: 'Parameter title dan text harus diisi!'
      });
    }
    
    try {
      const imageUrl = await nglgen(title, text);
      return res.json({
        status: true,
        result: imageUrl
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err?.response?.data?.error || err.message || 'Terjadi kesalahan saat memproses permintaan'
      });
    }
  });
};

// ========== FUNGSI UTAMA ==========

async function nglgen(title, subtitle) {
  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);
  
  const boxWidth = 440;
  const boxHeight = 220;
  const boxX = (width - boxWidth) / 2;
  const boxY = 160;
  
  const gradient = ctx.createLinearGradient(boxX, 0, boxX + boxWidth, 0);
  gradient.addColorStop(0, '#ff006e');
  gradient.addColorStop(1, '#ff8c00');
  
  ctx.fillStyle = '#fff';
  drawCapsule(ctx, boxX, boxY, boxWidth, boxHeight, 40);
  ctx.fill();
  
  ctx.fillStyle = gradient;
  drawRoundedTopRect(ctx, boxX, boxY, boxWidth, 70, 30);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, boxY + 42);
  
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  
  const textBox = {
    x: width / 2,
    y: boxY + 80,
    maxWidth: boxWidth - 40,
    maxHeight: boxHeight - 90,
  };
  
  const { fontSize, lines } = shrinkToFit(ctx, subtitle, textBox.maxWidth, textBox.maxHeight, 30);
  ctx.font = `bold ${fontSize}px sans-serif`;
  const lineHeight = fontSize + 10;
  const startY = textBox.y + (textBox.maxHeight - (lines.length * lineHeight)) / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, textBox.x, startY + i * lineHeight);
  });
  
  const bufferImage = canvas.toBuffer('image/png');
  const originalUrl = await CatBoxUpload(bufferImage);
  
  let finalUrl = originalUrl;
  try {
    const upscaleUrl = await upscaleImageFromURL(originalUrl);
    finalUrl = upscaleUrl;
  } catch (e) {
    console.warn('[!] Upscale gagal, pakai gambar asli');
  }
  
  return finalUrl;
}

// ========== HELPER ==========

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  let lines = [],
    line = '';
  for (let word of words) {
    if (ctx.measureText(word).width > maxWidth) {
      for (let char of word) {
        const testLine = line + char;
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(line);
          line = char;
        } else {
          line = testLine;
        }
      }
      line += ' ';
      continue;
    }
    
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  
  if (line) lines.push(line.trim());
  return lines;
}

function shrinkToFit(ctx, text, maxWidth, maxHeight, initialFontSize) {
  let fontSize = initialFontSize;
  let lines = [];
  
  do {
    ctx.font = `bold ${fontSize}px sans-serif`;
    lines = wrapText(ctx, text, maxWidth);
    const totalHeight = lines.length * (fontSize + 10);
    if (totalHeight <= maxHeight) break;
    fontSize--;
  } while (fontSize > 12);
  
  return { fontSize, lines };
}

function drawCapsule(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, height / 2, width / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawRoundedTopRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, height / 2, width / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function CatBoxUpload(buffer) {
  const tempPath = path.join(os.tmpdir(), `ngl-${Date.now()}.png`);
  fs.writeFileSync(tempPath, buffer);
  
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('userhash', '');
  form.append('fileToUpload', fs.createReadStream(tempPath));
  
  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
    },
  });
  
  fs.unlinkSync(tempPath);
  return res.data;
}

async function upscaleImageFromURL(url) {
  const form = new FormData();
  form.append('url', url);
  form.append('scale', '2');
  
  const res = await fetch('https://api2.pixelcut.app/image/upscale-url/v1', {
    method: 'POST',
    headers: {
      ...form.getHeaders(),
      'accept': 'application/json',
      'x-client-version': 'web',
      'x-locale': 'en'
    },
    body: form
  });
  
  const json = await res.json();
  if (!json?.result_url?.startsWith('http')) throw new Error('Upscale gagal');
  return json.result_url;
}