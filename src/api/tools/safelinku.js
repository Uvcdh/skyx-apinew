async function sfl(longUrl) {
  const token = "93ffffc5750be818467b75683f1d12114eed5f5d";
  const apiUrl = "https://safelinku.com/api/v1/links";
  const alias = generateAlias(); // ✅ alias alfanumerik

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

    return response.data;
  } catch (err) {
    return err.response?.data || err.message;
  }
}

module.exports = function(app) {
    app.get('/tools/sfl', async (req, res) => {
        try {
          const { link } = req.query;
            const sl = await sfl(link);
      return res.json({
        status: true,
        result: sl
      });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
