const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const db = require("./models/index");
const db_prep = require("./services/db/db_prep");

dotenv.config();

const server = async () => {
  const app = express();
  app.use(cors());
  await db_prep();

  await db.sequelize.sync({});

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

  app.use(express.json({ extended: false }));

  app.use("/api/v1/system", require("./routes/system"));
  app.use("/api/v1/user", require("./routes/user"));
  app.use("/api/v1/auth", require("./routes/auth"));
  app.use("/api/v1/diary", require("./routes/diary"));
  app.use("/api/v1/category", require("./routes/category"));
  app.use("/api/v1/organization", require("./routes/organization"));
};

server();
