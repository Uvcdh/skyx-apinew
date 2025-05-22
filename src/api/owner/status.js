const validateApiKey = require('./middleware');

 module.exports = function (app) {
app.get('/api/test', validateApiKey, (req, res) => {
  res.json({ success: true, message: `Hello, ${req.apikeyOwner}!` });
});
}