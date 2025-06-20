const { sfl } = require('@ikanngeming/blubub');

module.exports = function(app) {
    app.get('/tools/slf', async (req, res) => {
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
