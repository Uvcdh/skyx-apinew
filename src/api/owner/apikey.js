const fs = require('fs');

function getApiKeyList() {
  const data = fs.readFileSync('apikeys.json');
  const parsed = JSON.parse(data);
  return parsed.apikeys || [];
}

function validateApiKey(req) {
  const apikey = req.query.apikey || req.headers['x-api-key'];
  const apikeys = getApiKeyList();
  return apikeys.find(k => k.key === apikey);
}

module.exports = { validateApiKey };
