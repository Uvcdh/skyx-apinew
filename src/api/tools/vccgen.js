const { vccgen } = require('@ikanngeming/blubub');

module.exports = function (app) {
  app.get('/tools/vccgen', async (req, res) => {
    const { type, count } = req.query;

    if (!type) {
      return res.status(400).json({
        status: false,
        error: "Masukkan 'type' yang valid: visa, americanexpress, mastercard, jcb"
      });
    }

    if (!count) {
      return res.status(400).json({
        status: false,
        error: "Masukkan jumlah vcc nya"
      });
    }

    try {
      const respon = await vccgen(type, count)
      res.status(200).json({
        status: true,
        creator: 'ikann',
        result: respon.data
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message || String(err)
      });
    }
  });
}