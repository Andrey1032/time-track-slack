// const { Message, Calendar, Account_Data, User } = require("../database/models");
const { Message } = require("../database/messageModel");
const { Calendar } = require("../database/calendarModel");
const { Account_Data } = require("../database/accountDataModel");
const { User } = require("../database/userModel");

class MessageController {
  async createMessage(req, res) {
    const {
      time_message,
      message_text,
      messageTypeIdMessageType,
      slackIdUser,
      date,
      message_ts,
      messageTypeChangeIdMessageTypeChange,
    } = req.body;

    try {
      const calendar = await Calendar.findOne({ where: { date: date } });
      const account = await Account_Data.findOne({
        where: { slack: slackIdUser },
        attributes: ["id_account_data"],
      });
      const user = await User.findOne({
        where: { accountDatumIdAccountData: account.id_account_data },
        attributes: ["id_user"],
      });
      const message = await Message.create({
        time_message,
        message_text,
        messageTypeIdMessageType,
        userIdUser: user.id_user,
        calendarIdCalendar: calendar.id_calendar,
        message_ts,
        messageTypeChangeIdMessageTypeChange,
      });
      return res.json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи сообщения");
    }
  }

  async updateMessage(req, res) {
    const {
      message_text,
      time_message,
      date,
      message_ts,
      messageTypeChangeIdMessageTypeChange,
    } = req.body;
    try {
      const calendar = await Calendar.findOne({ where: { date: date } });
      const message = await Message.update(
        {
          time_message,
          message_text,
          calendarIdCalendar: calendar.id_calendar,
          messageTypeChangeIdMessageTypeChange,
        },
        { where: { message_ts: message_ts } }
      );

      return res.json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления сообщения");
    }
  }

  async deleteMessage(req, res) {
    const { message_ts } = req.body;
    try {
      const message = await Message.update(
        { messageTypeChangeIdMessageTypeChange: 1 },
        { where: { message_ts: message_ts } }
      );
      return res.json(message);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка удаления сообщения");
    }
  }
}

module.exports = new MessageController();
