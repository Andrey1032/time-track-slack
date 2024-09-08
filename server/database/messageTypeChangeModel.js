const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const { Message } = require("./messageModel");

const Message_Type_Change = sequelize.define("message_type_change", {
    id_message_type_change: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_message_type_change: { type: DataTypes.STRING, allowNull: false },
  });

  Message_Type_Change.hasMany(Message)
  Message.belongsTo(Message_Type_Change)
  
  module.exports = {
    Message_Type_Change,
  };