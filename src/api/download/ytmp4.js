  });
};const axios = require('axios');

module.exports = function (app) {
  app.get('/download/ytmp4', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: 'Parameter "url" tidak ditemukan'
      });
    }

    try {
      const response = await axios.get('https://api.vreden.my.id/api/ytmp4', {
        params: { url: url }
      });

      const data = response.data;

      if (!data || !data.status || !data.result || !data.result.url || !data.result.title) {
        return res.status(502).json({
          status: false,
          error: 'Gagal mengambil data video yang valid dari API'
        });
      }

      return res.json({
        status: true,
        creator: 'ikann',
        result: {
          title: data.result.title,
          download_url: data.result.url
        }
      });

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err?.response?.data?.error || err.message || 'Terjadi kesalahan saat memproses permintaan'
      });
    }
  });
};
