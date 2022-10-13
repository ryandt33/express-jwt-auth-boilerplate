const get_model = require("./get_model");

const db_prep = async () => {
  const System = await get_model("system");
  const Logger = await get_model("logger");
  const User = await get_model("user");

  return {
    System,
    Logger,
    User,
  };
};

module.exports = db_prep;
