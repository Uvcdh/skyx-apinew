const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  function loadApiKeys() {
    const filePath = path.join(__dirname, 'apikeys.json');
    if (!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, 'utf8');
    try {
      const json = JSON.parse(data);
      return json.keys || [];
    } catch (e) {
      console.error('Error parsing apikeys.json:', e.message);
      return [];
    }
  }

  app.get('/apikey', async (req, res) => {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ status: false, error: "Tolong masukkan API key-nya" });
    }

    const apiKeys = loadApiKeys();

    if (apiKeys.includes(key)) {
      res.status(200).json({
        status: true,
        creator: 'ikann',
        message: "API key valid"
      });
    } else {
      res.status(403).json({
        status: false,
        creator: 'ikann',
        message: "API key tidak valid"
      });
    }
  });
};
