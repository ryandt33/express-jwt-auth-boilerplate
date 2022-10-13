const express = require("express");
const dotenv = require("dotenv");

const db = require("./models/index");

dotenv.config();

const server = async () => {
  const app = express();

  await db.sequelize.sync({});

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

  app.use(express.json({ extended: false }));

  app.use("/api/v1/system", require("./routes/system"));
  app.use("/api/v1/user", require("./routes/user"));
  app.use("/api/v1/auth", require("./routes/auth"));
};

server();
