const axios = require('axios');

module.exports = function (app) {
  app.get('/ai/ai-img', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: 'text wajib diisi.' });

    try {
      const imageRes = await axios.get('https://fastrestapis.fasturl.cloud/aiimage/flux/schnell', {
        params: { text, size: '1_1_HD' },
        responseType: 'arraybuffer'
      });

      res.setHeader('Content-Type', 'image/png');
      res.send(imageRes.data);
    } catch (err) {
      res.status(500).json({ status: false, error: 'Gagal mengambil gambar dari API.' });
    }
  });
};