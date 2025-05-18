const fetch = require('node-fetch');

module.exports = function(app) {
  async function daftarVisitor(urlToTrack, customKey = 'ikann') {
    const apiUrl = `https://visitor.api.akuari.my.id/umum/daftar?id=${encodeURIComponent(urlToTrack)}&kunci_custom=${encodeURIComponent(customKey)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Gagal mengambil data:', error.message);
      return null;
    }
  }

  app.get('/visitor/daftar', async (req, res) => {
    const { q, key } = req.query;

    if (!q) {
      return res.status(400).json({ status: false, error: 'Query parameter "q" is required' });
    }

    try {
      const response = await daftarVisitor(q, key || 'ikann');

      if (!response) {
        return res.status(500).json({ status: false, error: 'Gagal mendapatkan data daftar visitor' });
      }

      res.status(200).json({
        status: true,
        creator: 'ikann',
        data: response.data || response
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
