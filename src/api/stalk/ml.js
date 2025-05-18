const axios = require('axios');

async function getMobileLegendsProfile(userId, zoneId) {
  try {
    const response = await axios.get(
      `https://api.vreden.my.id/api/mlstalk?id=${userId}&zoneid=${zoneId}`,
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
      userId: userId,
      zoneId: zoneId,
      nickname: data.username,
      level: data.level,
      rank: data.rank,
      heroCount: data.hero,
      skinCount: data.skin,
      winRate: data.winrate
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Gagal mendapatkan data profil"
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/ml', async (req, res) => {
    const { id, zoneid } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        status: false, 
        message: "Parameter 'id' (User ID) tidak ditemukan" 
      });
    }
    
    if (!zoneid) {
      return res.status(400).json({ 
        status: false, 
        message: "Parameter 'zoneid' (Zone ID) tidak ditemukan" 
      });
    }

    const result = await getMobileLegendsProfile(id, zoneid);
    res.status(result.status ? 200 : 404).json(result);
  });
};