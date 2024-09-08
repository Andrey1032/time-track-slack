const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {Message} = require("./messageModel")
const {Working_Hours} = require("./workingHoursModel")
const {Reworking} = require("./reworkingModel")
const {Underworking} = require("./underworkingModel")

const Calendar = sequelize.define("calendar", {
    id_calendar: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: { type: DataTypes.DATE, allowNull: false },
  });

Calendar.hasMany(Message);
Message.belongsTo(Calendar);

Calendar.hasMany(Working_Hours);
Working_Hours.belongsTo(Calendar);

Calendar.hasMany(Reworking);
Reworking.belongsTo(Calendar);

Calendar.hasMany(Underworking);
Underworking.belongsTo(Calendar);

module.exports = {
  Calendar,
};
