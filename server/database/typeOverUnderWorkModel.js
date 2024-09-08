const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {Reworking} = require("./reworkingModel")
const {Underworking} = require("./underworkingModel")

const Type_over_under_work = sequelize.define("type_over_under_work", {
  id_type_over_under_work: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_type_over_under_work: { type: DataTypes.STRING, allowNull: false },
});

Type_over_under_work.hasMany(Reworking);
Reworking.belongsTo(Type_over_under_work);

Type_over_under_work.hasMany(Underworking);
Underworking.belongsTo(Type_over_under_work);

module.exports = {
  Type_over_under_work,
};
