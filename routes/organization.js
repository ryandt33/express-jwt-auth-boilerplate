const express = require("express");
const router = express.Router();
const admin_auth = require("../middleware/admin_auth");
const org = require("../services/organization/organization");

router.get("/", admin_auth, async (req, res) => {
  res.send("Org");
});

router.post("/", admin_auth, async (req, res) => {
  const { name, parent_id = null } = req.body;

  if (!name) return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const new_org = await org.store(name, parent_id);
    res.json({ id: new_org, status: "Success" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

router.patch("/user", admin_auth, async (req, res) => {
  const { org_id, user_ids } = req.body;

  if (!org_id || !user_ids || !Array.isArray(user_ids))
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    await org.add_users(org_id, user_ids);

    res.json({ status: "Success" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

module.exports = router;
