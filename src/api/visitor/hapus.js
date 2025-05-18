const fetch = require('node-fetch');

module.exports = function(app) {
  async function hapusVisitor(urlToDelete, customKey = 'ikann') {
    const apiUrl = `https://visitor.api.akuari.my.id/umum/hapus?id=${encodeURIComponent(urlToDelete)}&kunci_custom=${encodeURIComponent(customKey)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Gagal menghapus data:', error.message);
      return null;
    }
  }

  app.get('/visitor/hapus', async (req, res) => {
    const { q, key } = req.query;

    if (!q) {
      return res.status(400).json({ status: false, error: 'Query parameter "q" is required' });
    }

    try {
      const response = await hapusVisitor(q, key || 'ikann');

      if (!response) {
        return res.status(500).json({ status: false, error: 'Gagal menghapus data visitor' });
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
