const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {Writing_off_time} = require("./writtenOffTimeModel")

const Type_of_work = sequelize.define("type_of_work", {
  id_type_of_work: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_type_of_work: { type: DataTypes.STRING, allowNull: false },
});


Type_of_work.hasMany(Writing_off_time);
Writing_off_time.belongsTo(Type_of_work);

module.exports = {
  Type_of_work,
};

  