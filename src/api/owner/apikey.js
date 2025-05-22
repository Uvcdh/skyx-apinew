const fs = require('fs');

function validateApiKey(req, res, next) {
  const apikey = (req.query && req.query.apikey) || (req.headers && req.headers['x-api-key']);

  if (!apikey) {
    return res.status(401).json({ success: false, message: 'API key required' });
  }

  const data = JSON.parse(fs.readFileSync('apikeys.json'));
  const keyExists = data.apikeys.find(k => k.key === apikey);

  if (keyExists) {
    req.apikeyOwner = keyExists.owner;
    next();
  } else {
    res.status(403).json({ success: false, message: 'Invalid API key' });
  }
}

module.exports = validateApiKey;
