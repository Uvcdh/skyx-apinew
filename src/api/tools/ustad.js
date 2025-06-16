const axios = require('axios');
module.exports = function (app) {
    async function anua(isixx) {
        try {
            const { response } = await axios.get(`https://api.taka.my.id/tanya-ustad?quest=${isixx}`)
            const anuxx = response.data
            return Buffer.from(anuxx);
        } catch (error) {
            throw error;
        }
    }
    
app.get('/tools/ustadz', async (req, res) => {
    try {
        const { text } = req.query;
            const pedo = await anua(text);
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