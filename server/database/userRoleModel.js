const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {User} = require("./userModel")

const User_Role = sequelize.define("user_role", {
    id_user_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_role: { type: DataTypes.STRING, allowNull: false },
  });

User_Role.hasMany(User);
User.belongsTo(User_Role);

module.exports = {
  User_Role,
};
