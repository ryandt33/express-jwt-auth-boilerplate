const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { create_log } = require("../services/logger/logger");
const { login } = require("../services/auth/validate");

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const expires_in = 36000;

  if ((!username && !email) || !password)
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const token = await login(username, email, password, expires_in);
    create_log(
      "info",
      `User logged in - ${email ? email : username}`,
      "",
      req.ip
    );
    res.json({ token, expires_in });
  } catch (error) {
    if (error.status) {
      await create_log("info", error.message, "", req.ip);
      res.status(error.status).json({ message: error.message });
    } else {
      await create_log(
        "error",
        `User creation Unhandled Error - ${error.message}`,
        error,
        req.ip
      );
      res.status(500).json({ message: "Server Error" });
    }
  }
});

router.get("/", auth, async (req, res) => {
  res.json({ id: req.user.id });
});

module.exports = router;
