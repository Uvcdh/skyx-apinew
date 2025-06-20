async function carbon(input) {
  let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "code": input
      })
    })
    .then(response => response.blob())
  let arrayBuffer = await Blobs.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  return buffer
}

module.exports = function(app) {
    app.get('/tools/carbon', async (req, res) => {
        try {
          const { text } = req.query;
            const pedo = await carbon(text);
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
