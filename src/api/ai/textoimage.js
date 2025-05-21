const axios = require('axios');

module.exports = function (app) {
  app.get('/ai/textoimage', async (req, res) => {
    const { text } = req.query;
    if (!text) {
      return res.status(400).json({
        status: false,
        error: 'Parameter text wajib diisi.'
      });
    }

    try {
      const response = await axios.get('https://api.vreden.my.id/api/artificial/aiease/text2img', {
        params: {
          text,
          style: 19
        }
      });

      if (response.data?.result?.length) {
        const images = response.data.result.map(v => v.origin);
        res.json({
          status: true,
          creator: 'ikann',
          count: images.length,
          result: images
        });
      } else {
        res.status(500).json({
          status: false,
          error: 'Gagal mendapatkan gambar dari API.'
        });
      }
    } catch (e) {
      res.status(500).json({
        status: false,
        error: e.message
      });
    }
  });
};