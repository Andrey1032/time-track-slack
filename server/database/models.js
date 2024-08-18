const sequelize = require("./db");
const { DataTypes } = require("sequelize");

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

const User_Role = sequelize.define("user_role", {
  id_user_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_role: { type: DataTypes.STRING, allowNull: false },
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

const User = sequelize.define("user", {
  id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  surname: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING },
});

const Message_Type = sequelize.define("message_type", {
  id_message_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_message_type: { type: DataTypes.STRING, allowNull: false },
});

const Message_Type_Change = sequelize.define("message_type_change", {
  id_message_type_change: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_message_type_change: { type: DataTypes.STRING, allowNull: false },
});

const Message = sequelize.define("message", {
  id_message: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // date_message: {type: DataTypes.DATE, allowNull: false},
  time_message: { type: DataTypes.TIME, allowNull: false },
  message_text: { type: DataTypes.STRING, },
  message_ts: { type: DataTypes.STRING },
});

const Workflow_Time_Type = sequelize.define("workflow_time_type", {
  id_workflow_time_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_workflow_time_type: { type: DataTypes.STRING, allowNull: false },
});

const Data_Type = sequelize.define("data_type", {
  id_data_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_data_type: { type: DataTypes.STRING, allowNull: false },
});

const Calendar = sequelize.define("calendar", {
  id_calendar: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: { type: DataTypes.DATEONLY, allowNull: false },
});

const Working_Hours = sequelize.define("working_hours", {
  id_working_hours: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  start_time: { type: DataTypes.TIME },
  end_time: { type: DataTypes.TIME},
  comments: { type: DataTypes.STRING },
});

const Type_of_work = sequelize.define("type_of_work", {
  id_type_of_work: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_type_of_work: { type: DataTypes.STRING, allowNull: false },
});

const Reworking_month = sequelize.define("reworking_month", {
  id_reworking_month: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  time_reworking_month: { type: DataTypes.TIME, allowNull: false },
});

const Underworking_month = sequelize.define("underworking_month", {
  id_underworking_month: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  time_underworking_month: { type: DataTypes.TIME, allowNull: false },
});

const Writing_off_time = sequelize.define("writing_off_time", {
  id_writing_off_time: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  old_value: { type: DataTypes.TIME, allowNull: false },
  new_value: { type: DataTypes.TIME, allowNull: false },
  comments: { type: DataTypes.STRING },
});

const Type_over_under_work = sequelize.define("type_over_under_work", {
  id_type_over_under_work: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_type_over_under_work: { type: DataTypes.STRING, allowNull: false },
});

const Reworking = sequelize.define("reworking", {
  id_reworking: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time_reworking: { type: DataTypes.TIME, allowNull: false },
  comments: { type: DataTypes.STRING },
});

const Underworking = sequelize.define("underworking", {
  id_underworking: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time_underworking: { type: DataTypes.TIME, allowNull: false },
  comments: { type: DataTypes.STRING },
});

User.hasOne(Department);
Department.belongsTo(User);

Account_Data.hasOne(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.belongsTo(Account_Data);

User_Role.hasMany(User);
User.belongsTo(User_Role);

Department.hasMany(User);
User.belongsTo(Department);

Message_Type.hasMany(Message);
Message.belongsTo(Message_Type);

Message_Type_Change.hasMany(Message)
Message.belongsTo(Message_Type_Change)

User.hasMany(Message, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Message.belongsTo(User);

Calendar.hasMany(Message);
Message.belongsTo(Calendar);

Data_Type.hasMany(Calendar);
Calendar.belongsTo(Data_Type);

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

Workflow_Time_Type.hasMany(Working_Hours);
Working_Hours.belongsTo(Workflow_Time_Type);

Calendar.hasMany(Working_Hours);
Working_Hours.belongsTo(Calendar);

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

Type_of_work.hasMany(Writing_off_time);
Writing_off_time.belongsTo(Type_of_work);

Calendar.hasMany(Reworking);
Reworking.belongsTo(Calendar);

Type_over_under_work.hasMany(Reworking);
Reworking.belongsTo(Type_over_under_work);

User.hasMany(Reworking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Reworking.belongsTo(User);

Calendar.hasMany(Underworking);
Underworking.belongsTo(Calendar);

Type_over_under_work.hasMany(Underworking);
Underworking.belongsTo(Type_over_under_work);

User.hasMany(Underworking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Underworking.belongsTo(User);

module.exports = {
  Account_Data,
  User_Role,
  Department,
  User,
  Message_Type,
  Message,
  Workflow_Time_Type,
  Data_Type,
  Calendar,
  Working_Hours,
  Type_of_work,
  Reworking_month,
  Underworking_month,
  Writing_off_time,
  Type_over_under_work,
  Reworking,
  Underworking,
  Message_Type_Change,
};
