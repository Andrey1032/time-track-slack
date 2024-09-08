const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const {Working_Hours} = require("./workingHoursModel")

const Workflow_Time_Type = sequelize.define("workflow_time_type", {
  id_workflow_time_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_workflow_time_type: { type: DataTypes.STRING, allowNull: false },
});

Workflow_Time_Type.hasMany(Working_Hours);
Working_Hours.belongsTo(Workflow_Time_Type);

module.exports = {
  Workflow_Time_Type,
};
