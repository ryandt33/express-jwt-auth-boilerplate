"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class logger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  logger.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dump: {
        type: DataTypes.TEXT,
      },
      ip: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "logger",
      tableName: "logger",
    }
  );
  return logger;
};
