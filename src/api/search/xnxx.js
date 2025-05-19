const axios = require('axios')

module.exports = function (app) {
  app.get('/search/xnxx', async (req, res) => {

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
  }
  
  const xnxx = (anuuu) => {
  axios.get(`https://api.vreden.my.id/api/xnxxsearch?query=${anuuu}`);
  }
  
  try {
    const response = await xnxx(q);
    res.status(200).json({
      status: true,
      creator: 'ikann',
      data: response.data.result
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});
}