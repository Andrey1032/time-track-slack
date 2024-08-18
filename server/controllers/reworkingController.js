const { Reworking, Calendar } = require("../database/models");

class ReworkingController {
  async createUnderworking(req, res) {
    const {
      time_reworking,
      comments,
      userIdUser,
      date,
      typeOverUnderWorkIdTypeOverUnderWork,
    } = req.body;
    try {
      const calendar = await Calendar.findOne({where: {date: date}})
      const reworking = await Reworking.create({
        time_reworking,
        comments,
        userIdUser,
        calendarIdCalendar: calendar.id_calendar,
        typeOverUnderWorkIdTypeOverUnderWork,
      });
      return res.json(reworking);
    } catch (error) {
      console.log(error)
      return res.status(500).send("Ошибка записи переработки");
    }
  }

  // async updateUnderworking(req, res) {
  //   const { id_reworking } = req.params;
  //   const {
  //     time_reworking,
  //     comments,
  //     userIdUser,
  //     calendarIdCalendar,
  //     typeOverUnderWorkIdTypeOverUnderWork,
  //   } = req.body;
  //   try {
  //     const reworking = await Reworking.update(
  //       {
  //         time_reworking,
  //         comments,
  //         userIdUser,
  //         calendarIdCalendar,
  //         typeOverUnderWorkIdTypeOverUnderWork,
  //       },
  //       { where: { id_reworking } }
  //     );
  //     return res.json(reworking);
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(500).send("Ошибка обновления переработки");
  //   }
  // }

  // async deleteUnderworking(req, res) {
  //   const { id_reworking } = req.params;
  //   try {
  //     const reworking = await Reworking.destroy({ where: { id_reworking } });
  //     return res.json(reworking);
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(500).send("Ошибка удаления переработки");
  //   }
  // }
}

module.exports = new ReworkingController();
