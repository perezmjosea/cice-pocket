const express = require("express");
const router = express.Router();
const scrap = require("scrap");

let dbClient = null;

router.get("/list", (req, res) => {
  dbClient.find({}).toArray((err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ list: data });
  });
});

router.post("/create", async (req, res) => {
  // Recojo los params de la petición (cuerpo)
  const urlWeb = req.body.url;
  const titleWeb = req.body.title;

  const urlScrapped = scrap(urlWeb, async (err, $, code, html) => {
    if (err) {
      return res.status(500).send();
    }

    // Scrapping para obtener Título y Descripción
    // Cogemos etiqueta title
    const titleScrap = $("title").html();
    // Buscamos entre los metas para encontrar el "Description"
    const $metas = $("meta");
    const metaDescription = Object.keys($metas).filter(item => $metas[item].attribs && $metas[item].attribs.name && $metas[item].attribs.name.toLowerCase() === "description");
    const descriptionScrap = $metas[metaDescription].attribs.content;

    // Creamos el documento
    const insertion = await dbClient
      .insertOne({
        url: urlWeb,
        title: titleScrap,
        description: descriptionScrap
      })
      .catch(err => res.status(500).json({ error: err.message }));

    return res.status(201).json({
      url: urlWeb,
      title: titleScrap,
      description: descriptionScrap
    });
  });


});

module.exports = {
  router,
  setMongoClient: client => (dbClient = client.collection("sites"))
};
