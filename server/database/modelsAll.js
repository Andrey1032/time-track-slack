const {
    Department,
  } = require("../database/userModel");
const {
    User,
  } = require("../database/userModel");
  const {
    Message,
  } = require("../database/messageModel");
  const {
    Working_Hours,
  } = require("../database/workingHoursModel");
  const {
    Reworking,
  } = require("../database/reworkingModel");
  const {
    Underworking,
  } = require("../database/underworkingModel");
  const {
    Reworking_month,
  } = require("../database/reworkingMonthModel");
  const {
    Underworking_month,
  } = require("../database/underworkingMonthModel");
  const {
    Calendar,
  } = require("../database/calendarModel");
  const {
    Writing_off_time,
  } = require("../database/writtenOffTimeModel");
  const {
    Account_Data,
  } = require("../database/accountDataModel");

  const {User_Role} = require('../database/userRoleModel')
  const {Message_Type} = require('../database/messageTypeModel')
  const {Workflow_Time_Type} = require('../database/workflowTimeTypeModel')
  const {Data_Type} = require('../database/dataTypeModel')
  const {Type_of_work} = require('../database/typeOfWorkModel')
  const {Type_over_under_work} = require('../database/typeOverUnderWorkModel')
  const { Message_Type_Change } = require("./messageTypeChangeModel");

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