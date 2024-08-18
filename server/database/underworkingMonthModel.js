const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Underworking_month = sequelize.define("underworking_month", {
    id_underworking_month: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    time_underworking_month: { type: DataTypes.TIME, allowNull: false },
  });

  module.exports = {
    Underworking_month,
  };