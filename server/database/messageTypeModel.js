const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {Message} = require("./messageModel")

const Message_Type = sequelize.define("message_type", {
  id_message_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_message_type: { type: DataTypes.STRING, allowNull: false },
});

Message_Type.hasMany(Message);
Message.belongsTo(Message_Type);

module.exports = {
  Message_Type,
};
