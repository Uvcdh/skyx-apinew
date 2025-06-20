const axios = require('axios');

function generateAlias() {
  return Math.random().toString(36).substring(2, 8);
}

async function createShortlink(longUrl) {
  const token = "93ffffc5750be818467b75683f1d12114eed5f5d";
  const apiUrl = "https://safelinku.com/api/v1/links";
  const alias = generateAlias();

  try {
    const response = await axios.post(apiUrl, {
      url: longUrl,
      alias: alias
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return { success: true, data: response.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

module.exports = function(app) {
  app.get('/tools/sfl', async (req, res) => {
    const { link } = req.query;

    if (!link) {
      return res.status(400).json({
        status: false,
        error: 'Masukkan linknyoo'
      });
    }

    const sl = await createShortlink(link);

    if (sl.success) {
      return res.json({
        status: true,
        result: sl.data
      });
    } else {
      return res.status(500).json({
        status: false,
        error: sl.error
      });
    }
  });
};