const sequelize = require("./db");
const { DataTypes } = require("sequelize");
// const {Department} = require("./departmentModel")
const {Message} = require("./messageModel")
const {Working_Hours} = require("./workingHoursModel")
const {Underworking} = require("./underworkingModel")
const {Reworking_month} = require("./reworkingMonthModel")
const {Underworking_month} = require("./underworkingMonthModel")
const {Writing_off_time} = require("./writtenOffTimeModel")
const {Reworking} = require("./reworkingModel")

const User = sequelize.define("user", {
  id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  surname: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING },
});

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

User.hasOne(Department);
Department.belongsTo(User);

User.hasMany(Message, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Message.belongsTo(User);

User.hasMany(Working_Hours, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Working_Hours.belongsTo(User);

User.hasMany(Working_Hours, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Working_Hours.belongsTo(User, { foreignKey: "changesByUserID" });


User.hasMany(Underworking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Underworking.belongsTo(User);

User.hasMany(Reworking_month, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Reworking_month.belongsTo(User);

User.hasMany(Underworking_month, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Underworking_month.belongsTo(User);

User.hasMany(Writing_off_time, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Writing_off_time.belongsTo(User);

User.hasMany(Writing_off_time, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Writing_off_time.belongsTo(User, { foreignKey: "writingByUserID" });


User.hasMany(Reworking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Reworking.belongsTo(User);

module.exports = {
  User,
  Department
};
