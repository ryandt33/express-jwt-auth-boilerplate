const jwt = require("jsonwebtoken");
const db_prep = require("../services/db/db_prep");

const jwt_secret = process.env.JWT_SECRET;

module.exports = async function (req, res, next) {
  const { User } = await db_prep();
  // Get token from header
  const token = req.header("Auth-Token");
  // Check if not token
  if (!token) {
    res.status(401).json({ msg: "Unauthorized Access - No token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwt_secret);
    const user = await User.findByPk(decoded.user.id);
    if (user.role !== "admin") {
      res.status(401).json({ msg: "Unauthorized Access - No admin token" });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
    return;
  }
};
