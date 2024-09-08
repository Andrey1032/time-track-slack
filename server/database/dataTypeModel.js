const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {Calendar} = require("./calendarModel")

const Data_Type = sequelize.define("data_type", {
    id_data_type: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_data_type: { type: DataTypes.STRING, allowNull: false },
  });

Data_Type.hasMany(Calendar);
Calendar.belongsTo(Data_Type);

module.exports = {
  Data_Type,
};
