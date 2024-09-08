const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Working_Hours = sequelize.define("working_hours", {
    id_working_hours: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    comments: { type: DataTypes.STRING },
  });

  module.exports = {
    Working_Hours,
  };