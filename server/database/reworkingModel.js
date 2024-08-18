const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Reworking = sequelize.define("reworking", {
    id_reworking: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    time_reworking: { type: DataTypes.TIME, allowNull: false },
    comments: { type: DataTypes.STRING },
  });

  module.exports = {
    Reworking,
  };