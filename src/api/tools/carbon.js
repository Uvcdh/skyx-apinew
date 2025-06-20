const { carbon } = require('@ikanngeming/blubub');
module.exports = function(app) {
    app.get('/tools/carbon', async (req, res) => {
        try {
          const { text } = req.query;
            const pedo = await carbon(text);
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
