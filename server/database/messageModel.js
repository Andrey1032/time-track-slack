const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const Message = sequelize.define("message", {
    id_message: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // date_message: {type: DataTypes.DATE, allowNull: false},
    time_message: { type: DataTypes.TIME, allowNull: false },
    message_text: { type: DataTypes.STRING, allowNull: false },
  });

  module.exports = {
    Message,
  };