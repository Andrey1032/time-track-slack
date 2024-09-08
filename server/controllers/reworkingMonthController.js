// const {Reworking_month} = require('../database/models')
const { Reworking_month } = require("../database/reworkingMonthModel");

class ReworkingMonthController {
  async createReworkingMonth(req, res) {
    const { month, year, time_reworking_month, userIdUser } = req.body;
    try {
      const reworkingMonth = await Reworking_month.create({
        month,
        year,
        time_reworking_month,
        userIdUser,
      });
      return res.json(reworkingMonth);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи переработки за месяц");
    }
  }

  async updateReworkingMonth(req, res) {
    const { id_reworking_month } = req.params;
    const { month, year, time_reworking_month, userIdUser } = req.body;
    try {
      const reworkingMonth = await Reworking_month.update(
        { month, year, time_reworking_month, userIdUser },
        { where: { id_reworking_month } }
      );
      return res.json(reworkingMonth);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления переработки за месяц");
    }
  }
}

module.exports = new ReworkingMonthController();
