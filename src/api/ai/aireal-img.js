const axios = require('axios');

module.exports = function (app) {
  app.get('/ai/aireal-img', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: 'text wajib diisi.' });

    try {
      const response = await axios.get('https://fastrestapis.fasturl.cloud/aiimage/bodygenerator', {
        params: {
          text,
          type: 'Realistic',
          visualStyle: 'Covering breasts, Concept Pool Ladder',
          characterStyle: 'Realistic Doll V4'
        },
        responseType: 'arraybuffer'
      });

      res.setHeader('Content-Type', 'image/png');
      res.send(response.data);
    } catch {
      res.status(500).json({ status: false, error: 'Gagal mengambil gambar dari API.' });
    }
  });
};