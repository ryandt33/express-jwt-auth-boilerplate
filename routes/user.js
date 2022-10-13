const express = require("express");
const router = express.Router();

const { create_log } = require("../services/logger/logger");

const user = require("../services/users/user");

router.post("/", async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !first_name || !last_name || !email || !password)
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const check_auth = await user.check_auth(req);

    if (check_auth.role !== "admin") {
      create_log(
        "warn",
        "Unauthorized Access - User creation",
        check_auth.id ? check_auth : "",
        req.ip
      );
      throw {
        status: 401,
        message: "Unauthorized Access - No token",
      };
    }

    const new_user = await user.create(
      username,
      first_name,
      last_name,
      email,
      password,
      check_auth.first_user ? "admin" : "user"
    );
    await create_log(
      "info",
      `User created - ${email}`,
      {
        username: new_user.username,
        first_name: new_user.first_name,
        last_name: new_user.last_name,
        email: new_user.email,
      },
      req.ip
    );

    res.json({
      first_name: new_user.first_name,
      last_name: new_user.last_name,
      username: new_user.username,
      email: new_user.email,
    });
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

module.exports = router;
