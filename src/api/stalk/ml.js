const axios = require('axios');

async function getMobileLegendsProfile(userId, zone) {
  try {
    const response = await axios.get(
      `https://api.vreden.my.id/api/mlstalk?id=${userId}&zoneid=${zone}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const data = response.data;

    if (!data || data.status === "error") {
      throw new Error(data.message || "Profil tidak ditemukan");
    }

    return {
      status: true,
      result: {
        userId,               // dimasukkan manual
        zone,                 // dimasukkan manual
        nickname: data.username,
        level: data.level,
        rank: data.rank,
        heroCount: data.hero,
        skinCount: data.skin,
        winRate: data.winrate
      }
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Gagal mendapatkan data profil"
    };
  }
}

module.exports = function (app) {
  app.get('/tools/cekid-ml', async (req, res) => {
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

    const response = await getMobileLegendsProfile(id, zone);

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
      data: response.result
    });
  });
};
