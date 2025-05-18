const fetch = require('node-fetch')

module.exports = function(app) {
async function visitor(urlToTrack) {
  const apiUrl = `https://visitor.api.akuari.my.id/umum/view/tambah-ip?id=${encodeURIComponent(urlToTrack)}`;

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

    app.get('/random/visitor', async (req, res) => {
        try {
            const response = await visitor(q)
      res.status(200).json({
        status: true,
        creator: 'ikann',
        data: response.result || response
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
