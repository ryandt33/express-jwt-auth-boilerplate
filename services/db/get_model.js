const db = require("../../models/index");

const get_model = async (model_name) => {
  const model = require(`../../models/${model_name}`);

  return model(db.sequelize, db.Sequelize.DataTypes);
};

module.exports = get_model;
