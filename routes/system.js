const express = require("express");
const router = express.Router();

const db_prep = require("../services/db/db_prep");

router.get("/", async (req, res) => {
  const { System } = await db_prep();

  const systems = await System.findAll();

  res.json(systems);
});

module.exports = router;
