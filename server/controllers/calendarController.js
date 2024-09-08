const Sequelize = require("sequelize");
// const { Calendar } = require("../database/models");
const { Calendar } = require("../database/calendarModel");

class CalendarController {
  async createCalendar(req, res) {
    const { calendar } = req.body;

    let calendarMassiv = [];

    try {
      const curYear = await Calendar.findOne({
        where: { date: new Date(calendar.year, 2).toJSON().substring(0, 10) },
      });
      if (curYear) {
        return res.status(200).send("Календарь данного года загружен");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка заполнения календаря");
    }

    let month, lastDay, currentDay, typeDate, days;
    calendar.months.forEach((i) => {
      month = i.month;
      lastDay = new Date(calendar.year, month).toJSON().substring(0, 10);
      days = i.days.split(",");
      let d = 2,
        day = 1;
      while (true) {
        currentDay = new Date(calendar.year, month - 1, d++)
          .toJSON()
          .substring(0, 10);
        if (days.some((el) => parseInt(el) === day)) {
          typeDate = 1;
        } else typeDate = 2;
        day++;
        calendarMassiv.push({
          date: currentDay,
          dataTypeIdDataType: typeDate,
        });
        if (currentDay == lastDay) return;
      }
    });

    try {
      const calendar = await Calendar.bulkCreate(calendarMassiv);
      return res.json(calendar);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка заполнения календаря");
    }
  }

  async getAllCalendar(req, res) {
    const { year } = req.query;
    try {
      const calendar = await Calendar.findAll({
        where: {
          date: {
            [Sequelize.Op.between]: [
              new Date(year, 0, 2).toJSON().substring(0, 10),
              new Date(year, 12).toJSON().substring(0, 10),
            ],
          },
        },
      });

      let _calendar = JSON.parse(JSON.stringify(calendar));

      let calendarJSON = {
        year: year,
        months: [],
      };

      let monthCur = 1,
        massivDays = [],
        date;

      _calendar.forEach((el) => {
        date = new Date(el.date);

        if (date.getDate() == 1) {
          monthCur = date.getMonth() + 1;
        }

        if (el.dataTypeIdDataType == 1) {
          massivDays.push(date.getDate());
        }

        if (
          date.toJSON().substring(0, 10) ==
          new Date(year, monthCur).toJSON().substring(0, 10)
        ) {
          calendarJSON.months.push({
            month: monthCur,
            days: massivDays.join(),
          });
          massivDays.length = 0;
        }
      });

      return res.status(200).send(calendarJSON);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка получения календаря");
    }
  }
}

module.exports = new CalendarController();
