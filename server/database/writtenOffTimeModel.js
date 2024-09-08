const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Writing_off_time = sequelize.define("writing_off_time", {
    id_writing_off_time: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    old_value: { type: DataTypes.TIME, allowNull: false },
    new_value: { type: DataTypes.TIME, allowNull: false },
    comments: { type: DataTypes.STRING },
  });

  module.exports = {
    Writing_off_time,
  };