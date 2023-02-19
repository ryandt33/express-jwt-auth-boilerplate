const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const category = require("../services/category/category");

router.get("/", auth, async (req, res) => {
  res.send("Ok");
});

router.post("/", auth, async (req, res) => {
  const { name, organization_id } = req.body;

  if (!name || !organization_id)
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const new_category = await category.store(name, organization_id);
    res.json({ id: new_category, status: "Success" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

module.exports = router;
