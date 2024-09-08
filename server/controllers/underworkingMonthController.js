// const {Underworking_month} = require('../database/models')
const { Underworking_month } = require("../database/underworkingMonthModel");

class UnderworkingMonthController {
  async createReworkingMonth(req, res) {
    const { month, year, time_underworking_month, userIdUser } = req.body;
    try {
      const underworkingMonth = await Underworking_month.create({
        month,
        year,
        time_underworking_month,
        userIdUser,
      });
      return res.json(underworkingMonth);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи недоработки за месяц");
    }
  }

  async updateReworkingMonth(req, res) {
    const { id_underworking_month } = req.params;
    const { month, year, time_underworking_month, userIdUser } = req.body;
    try {
      const underworkingMonth = await Underworking_month.update(
        { month, year, time_underworking_month, userIdUser },
        { where: { id_underworking_month } }
      );
      return res.json(underworkingMonth);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления недоработки за месяц");
    }
  }
}

module.exports = new UnderworkingMonthController();
