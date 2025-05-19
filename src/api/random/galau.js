const axios = require('axios');

module.exports = function (app) {
  app.get('/random/galau', async (req, res) => {
    try {
      // Ambil URL video dari API
      const api = await axios.get('https://api.vreden.my.id/api/galau');
      const videoUrl = api.data

      if (!videoUrl) {
        return res.status(500).json({ status: false, error: 'No video URL found in API response.' });
      }

      // Stream video ke response
      const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });

      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': videoResponse.headers['content-length'],
      });

      videoResponse.data.pipe(res);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
