const db_prep = require("../db/db_prep");

const create_log = async (level, message, dump = "", ip) => {
  const { Logger } = await db_prep();

  if (typeof dump === "object") {
    dump = JSON.stringify(dump);
  }

  const log = await Logger.create({ level, message, dump, ip });
};

module.exports = { create_log };
