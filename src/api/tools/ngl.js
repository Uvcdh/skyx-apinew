const { nglgen } = require('@ikanngeming/blubub');

module.exports = function (app) {
  app.get('/tools/ngl', async (req, res) => {
    const { text1, text2 } = req.query;
    
    if (!text1) {
      return res.status(400).json({
        status: false,
        error: 'Masukkan textnyooo'
      });
    }
    
    if (!text2) {
      return res.status(400).json({
        status: false,
        error: 'Masukkan textnyooo'
      });
    }
    
    try {
      const hasil = await nglgen(text1, text2);
      return res.json({
        status: true,
        result: hasil
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err?.response?.data?.error || err.message || 'Terjadi kesalahan saat memproses permintaan'
      });
    }
  });
};