const axios = require('axios');
module.exports = function (app) {
app.get('/tools/ustadz', async (req, res) => {
    try {
        const { text } = req.query;
            const pedo = `https://api.taka.my.id/tanya-ustad?quest=${text}`
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
  })
}