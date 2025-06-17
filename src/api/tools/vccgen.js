  })
}const { vccgen } = require('@ikanngeming/blubub');

module.exports = function (app) {
  app.get('/tools/vccgen', async (req, res) => {
    const { type, count } = req.query;

    const allowedTypes = ['visa', 'mastercard', 'americanexpress', 'jcb'];
    
    if (!type || !allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        status: false,
        error: "Masukkan 'type' yang valid: visa, americanexpress, mastercard, jcb"
      });
    }

    const countInt = parseInt(count);
    if (!count || isNaN(countInt) || countInt < 1 || countInt > 10) {
      return res.status(400).json({
        status: false,
        error: "Masukkan 'count' antara 1 sampai 10"
      });
    }

    try {
      const respon = vccgen(type.toLowerCase(), countInt);
      res.status(200).json({
        status: true,
        creator: 'ikann',
        result: respon
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message || String(err)
      });
    }
  });
}