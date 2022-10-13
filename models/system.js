"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class system extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  system.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      school_route: {
        type: DataTypes.STRING,
      },
      client_id: {
        type: DataTypes.STRING,
      },
      client_secret: {
        type: DataTypes.STRING,
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "system",
    }
  );
  return system;
};
