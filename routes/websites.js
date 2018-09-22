const express = require("express");
const router = express.Router();

let dbClient = null;

router.get("/list", (req, res) => {});

router.post("/create", (req, res) => {});

module.exports = {
  router,
  setMongoClient: client => (dbClient = client.collection("sites"))
};
