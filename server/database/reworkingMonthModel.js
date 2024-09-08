const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Reworking_month = sequelize.define("reworking_month", {
  id_reworking_month: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  time_reworking_month: { type: DataTypes.TIME, allowNull: false },
});

  module.exports = {
    Reworking_month,
  };