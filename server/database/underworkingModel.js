const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Underworking = sequelize.define("underworking", {
  id_underworking: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time_underworking: { type: DataTypes.TIME, allowNull: false },
  comments: { type: DataTypes.STRING },
});

  module.exports = {
    Underworking,
  };