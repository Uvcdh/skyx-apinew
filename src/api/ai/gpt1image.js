const axios = require('axios')

const gpt1image = async (yourImagination) => {

    if (!yourImagination) throw Error("deskripsikan gambar yang ingin kamu buat.")

    const headers = {
        "content-type": "application/json",
        "referer": "https://gpt1image.exomlapi.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
    }

    // ini adalah setting minimal, sengaja biar server generate nya tidak cepat mokad :D
    const body = JSON.stringify(
        {
            "prompt": yourImagination,
            "n": 1,
            "size": "1024x1024",
            "is_enhance": true,
            "response_format": "url"
        }
    )

    const respose = await fetch("https://gpt1image.exomlapi.com/v1/images/generations", {
        headers,
        body,
        "method": "POST"
    });

    if (!respose.ok) throw Error(`fetch gagal di alamat ${respose.url} ${respose.status} ${respose.statusText}.`)

    console.log("sabar yah, sedang membuat " + yourImagination + ".\nemang agak lama prosesnya. tunggu aja yah...")

    const json = await respose.json()

    const url = json?.data?.[0]?.url
    if (!url) throw Error("fetch berhasil tapi url result nya kosong. how strange... aku hitung ini sebagai kegagalan. pastikan semua payload benar" +
         (json.error ? ", oh ya ada info tambahan error dari server " + json.error : "."))
    return url
}

module.exports = function(app) {
    app.get('/ai/gpt1image', async (req, res) => {

  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
  }

  try {
    const response = await gpt1image(text);
    res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': response.length,
            });
            res.end(response);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});
}