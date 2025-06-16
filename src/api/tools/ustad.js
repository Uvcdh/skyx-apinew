const axios = require('axios');
module.exports = function (app) {
    const { text } = req.query;
    async function bluearchive() {
        try {
            const { response } = await axios.get(`https://api.taka.my.id/tanya-ustad?quest=${text}`)
            const anuxx = response.data
            return Buffer.from(anuxx);
        } catch (error) {
            throw error;
        }
    }
    
app.get('/tools/ustadz', async (req, res) => {
    try {
            const pedo = await bluearchive();
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