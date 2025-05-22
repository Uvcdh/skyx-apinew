const express = require('express');
const router = express.Router();
const validateApiKey = require('./middleware/apikey');

router.get('/api/test', validateApiKey, (req, res) => {
  res.json({ success: true, message: `Hello, ${req.apikeyOwner}!` });
});

module.exports = router;
