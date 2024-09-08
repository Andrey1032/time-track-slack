// const {Type_over_under_work} = require('../database/models')
const { Type_over_under_work } = require("../database/typeOverUnderWorkModel");

class TypeOverUnderWorkController {
  async createTypeOverUnderWork(req, res) {
    const { name_type_over_under_work } = req.body;
    try {
      const typeOverUnderWork = await Type_over_under_work.create({
        name_type_over_under_work,
      });
      return res.json(typeOverUnderWork);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи типа пере/недоработки");
    }
  }

  async updateTypeOverUnderWork(req, res) {
    const { id_type_over_under_work } = req.params;
    const { name_type_over_under_work } = req.body;
    try {
      const typeOverUnderWork = await Type_over_under_work.update(
        { name_type_over_under_work },
        { where: { id_type_over_under_work } }
      );
      return res.json(typeOverUnderWork);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления типа пере/недоработки");
    }
  }

  async deleteTypeOverUnderWork(req, res) {
    const { id_type_over_under_work } = req.params;
    try {
      const typeOverUnderWork = await Type_over_under_work.destroy({
        where: { id_type_over_under_work },
      });
      return res.json(typeOverUnderWork);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка удаления типа пере/недоработки");
    }
  }
}

module.exports = new TypeOverUnderWorkController();
