const bcryptjs = require("bcryptjs");
const db_prep = require("../db/db_prep");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const check_auth = async (req) => {
  if (req.header("Auth-Token")) {
    const { User } = await db_prep();
    // Get token from header
    const token = req.header("Auth-Token");
    // Check if not token
    if (!token) {
      throw {
        status: 401,
        message: "Unauthorized Access - No token",
      };
    }

    try {
      const decoded = jwt.verify(token, jwt_secret);
      const user = await User.findByPk(decoded.user.id);
      req.user = decoded.user;
      return user;
    } catch (error) {
      throw {
        status: 401,
        message: "Token is not valid",
      };
    }
  }

  const { User } = await db_prep();
  const users = await User.findAll({ attributes: ["id"] });

  if (users.length > 0) {
    throw {
      status: 401,
      message: "Unauthorized Access - No token",
    };
  }

  return { role: "admin", first_user: true };
};

const validation = (username, email, password) => {
  if (typeof username !== "string" || typeof password !== "string") {
    throw {
      status: 400,
      message: "Username and password must be strings",
    };
  }

  if (password.length < 10) {
    throw {
      status: 400,
      message: "Password must be at least 10 characters",
    };
  }

  const email_regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!email_regex.test(email)) {
    throw {
      status: 400,
      message: "Invalid email address",
    };
  }

  const username_regex = new RegExp(/^[a-zA-Z0-9._-]+$/);
  if (!username_regex.test(username)) {
    throw {
      status: 400,
      message: "Invalid username",
    };
  }

  const password_regex = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/
  );
  if (!password_regex.test(password)) {
    throw {
      status: 400,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number, and one special character",
    };
  }
};

const create = async (
  username,
  first_name,
  last_name,
  email,
  password,
  role
) => {
  const { User } = await db_prep();

  const existing_user = await User.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: email }],
    },
  });

  if (existing_user) {
    throw {
      status: 400,
      message: "User already exists",
    };
  }

  validation(username, email, password, User);

  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  const user = await User.create({
    username,
    first_name,
    last_name,
    email,
    password: hash,
    role,
  });

  return user;
};

module.exports = { create, check_auth };
