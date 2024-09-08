const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {User} = require("./userModel")

const Department = sequelize.define("department", {
    id_department: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_department: { type: DataTypes.STRING, allowNull: false },
    slack: { type: DataTypes.STRING, unique: true },
  });

Department.hasMany(User);
User.belongsTo(Department);

module.exports = {
  Department,
};