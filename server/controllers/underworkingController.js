// const { Underworking, Calendar } = require("../database/models");
const { Underworking } = require("../database/underworkingModel");
const { Calendar } = require("../database/calendarModel");

class UnderworkingController {
  async createUnderworking(req, res) {
    const {
      time_underworking,
      comments,
      userIdUser,
      date,
      typeOverUnderWorkIdTypeOverUnderWork,
    } = req.body;
    try {
      const calendar = await Calendar.findOne({ where: { date: date } });
      const underworking = await Underworking.create({
        time_underworking,
        comments,
        userIdUser,
        calendarIdCalendar: calendar.id_calendar,
        typeOverUnderWorkIdTypeOverUnderWork,
      });
      return res.json(underworking);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи недоработки");
    }
  }

  //   async updateUnderworking(req, res) {
  //     const { id_underworking } = req.params;
  //     const {
  //       time_underworking,
  //       comments,
  //       userIdUser,
  //       calendarIdCalendar,
  //       typeOverUnderWorkIdTypeOverUnderWork,
  //     } = req.body;
  //     try {
  //       const underworking = await Underworking.update(
  //         {
  //           time_underworking,
  //           comments,
  //           userIdUser,
  //           calendarIdCalendar,
  //           typeOverUnderWorkIdTypeOverUnderWork,
  //         },
  //         { where: { id_underworking } }
  //       );
  //       return res.json(underworking);
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(500).send("Ошибка обновления недоработки");
  //     }
  //   }

  //   async deleteUnderworking(req, res) {
  //     const { id_underworking } = req.params;
  //     try {
  //       const underworking = await Underworking.destroy({
  //         where: { id_underworking },
  //       });
  //       return res.json(underworking);
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(500).send("Ошибка удаления недоработки");
  //     }
  //   }
}

module.exports = new UnderworkingController();
