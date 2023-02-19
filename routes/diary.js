const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const diary = require("../services/diary/diary");

router.get("/", auth, async (req, res) => {
  res.send("Ok");
});

router.post("/", auth, async (req, res) => {
  const { title, content, organization_id } = req.body;

  if ((!title || !content, !organization_id))
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const new_diary = await diary.store(
      { title, content },
      req.user.id,
      organization_id
    );
    res.json({ id: new_diary, status: "Success" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

module.exports = router;
