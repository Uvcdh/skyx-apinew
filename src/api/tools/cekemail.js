const { checkEmail } = require('ikann')

module.exports = function (app) {
  app.get('/tools/checkemail', async (req, res) => {
    const { mail } = req.query;
    
    if (!mail) {
      return res.status(400).json({
        status: false,
        error: 'Masukkan emailnyoo'
      });
    }
    
    try {
      const email = await checkEmail(mail)
      return email
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err?.response?.data?.error || err.message || 'Terjadi kesalahan saat memproses permintaan'
      });
    }
  });
};