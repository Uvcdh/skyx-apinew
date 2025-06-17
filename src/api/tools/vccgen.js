const { vccgen } = require('@ikanngeming/blubub')
let typecard = ["visa", "americanexpress", "mastercard", "jcb"];

module.exports = function (app) {
  app.get('/tools/vccgen', async (req, res) => {
    const { type, count } = req.query;
    
    if (!typecard.includes(type)) {
      return res.status(400).json({
          status: false,
          error: "Masukkan type nya, visa, americanexpress, mastercard, jcb"
        })
      }
    
      if (!count && count > 10) {
        return res.status(400).json({
          status: false,
          error: "Masukkan jumlah vcc nya, dan jangan sampai melebihi 10 generate vcc"
        })
      }
      
      let typeds;
    switch (type) {
      case 'visa': typeds = "Visa"; break;
      case 'mastercard': typeds = "Mastercard"; break;
      case 'americanexpress': typeds = "American%20Express"; break;
      case 'jcb': typeds = "JCB"; break;
      default: return res.status(400).json({ status: false, message: "Invalid card type" });
    }
      try {
        let respon = vccgen(type, count)
        res.status(200).json({
          status: true,
          creator: 'ikann',
          result: respon
        })
      } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
  })
}