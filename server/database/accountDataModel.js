const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {User} = require("./userModel")

const Account_Data = sequelize.define("account_data", {
  id_account_data: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slack: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.TEXT, allowNull: false },
  login: { type: DataTypes.STRING, unique: true },
});

Account_Data.hasOne(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.belongsTo(Account_Data);

module.exports = {
  Account_Data,
};
