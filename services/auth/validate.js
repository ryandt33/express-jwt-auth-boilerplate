const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db_prep = require("../db/db_prep");
const { Op } = require("sequelize");

const login = async (username, email, password, expires_in) => {
  const { User } = await db_prep();

  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: username ? username : null },
        { email: email ? email : null },
      ],
    },
  });

  if (!user) {
    throw {
      status: 400,
      message: "Invalid credentials",
    };
  }

  const is_match = await bcrypt.compare(password, user.password);

  if (!is_match) {
    throw {
      status: 400,
      message: "Invalid credentials",
    };
  }

  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expires_in,
  });

  return token;
};

module.exports = { login };
