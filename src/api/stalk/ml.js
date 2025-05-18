const axios = require('axios')

async function mlstalk(id, zone) {
    try {
        const response = await axios.get(`https://api.vreden.my.id/api/mlstalk?id=${encodeURIComponent(id)}&zoneid=${encodeURIComponent(zone)}`)
            return response.data.result.data
     } catch (error) {
        console.error(error)
        throw new Error('Error wak')
    }
}

module.exports = function (app) {
  app.get('/stalk/ml', async (req, res) => {
    const { id, zone } = req.query;

    if (!id) {
      return res.status(400).json({
        status: false,
        creator: 'ikann',
        message: "Parameter 'id' (User ID) tidak ditemukan"
      });
    }

    if (!zone) {
      return res.status(400).json({
        status: false,
        creator: 'ikann',
        message: "Parameter 'zone' (Zone ID) tidak ditemukan"
      });
    }

    const response = await mlstalk(id, zone);

    if (!response.status) {
      return res.status(404).json({
        status: false,
        creator: 'ikann',
        message: response.message
      });
    }

    res.status(200).json({
      status: true,
      creator: 'ikann',
      data: response
    });
  });
};
