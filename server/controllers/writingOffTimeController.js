const { Writing_off_time, Type_of_work, User } = require("../database/models");
const { Sequelize } = require("sequelize");

class WrittenOffTimeController {
  async createWrittenOffTime(req, res) {
    const {
      month,
      year,
      old_value,
      new_value,
      comments,
      userIdUser,
      writingByUserID,
      typeOfWorkIdTypeOfWork,
    } = req.body;
    try {
      const writingOffTime = await Writing_off_time.create({
        month,
        year,
        old_value,
        new_value,
        comments,
        userIdUser,
        writingByUserID,
        typeOfWorkIdTypeOfWork,
      });
      return res.json(writingOffTime);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи списания рабочего времени");
    }
  }

  async getAllWrittenOffTime(req, res) {
    let { id_writing_off_time } = req.query,
      writingOffTime;
    try {
      if (id_writing_off_time) {
        writingOffTime = await Writing_off_time.findOne(
          { where: { id_writing_off_time } },
          {
            include: [
              {
                model: User,
                where: {
                  [Sequelize.or]: [
                    { id_user: userIdUser },
                    { id_user: writingByUserID },
                  ],
                },
              },
            ],
          }
        );
      } else {
        writingOffTime = await Writing_off_time.findAll({
          include: [
            {
              model: User,
              // where: {
              //   [Sequelize.Op.or]: [{ id_user: userIdUser }, { id_user: writingByUserID }]
              // }
            },
          ],
        });
      }
      return res.json(writingOffTime);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка получения списания рабочего времени");
    }
  }

  async updateWrittenOffTime(req, res) {
    const { id_writing_off_time } = req.params;
    const {
      month,
      year,
      old_value,
      new_value,
      comments,
      userIdUser,
      writingByUserID,
      typeOfWorkIdTypeOfWork,
    } = req.body;
    try {
      const writingOffTime = await Writing_off_time.update(
        {
          month,
          year,
          old_value,
          new_value,
          comments,
          userIdUser,
          writingByUserID,
          typeOfWorkIdTypeOfWork,
        },
        { where: { id_writing_off_time } }
      );
      return res.json(writingOffTime);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Ошибка обновления списания рабочего времени");
    }
  }

  async deleteWrittenOffTime(req, res) {
    const { month, year } = req.params;
    try {
      const writingOffTime = await Writing_off_time.destroy({
        where: { month: month, year: year },
      });
      return res.json(writingOffTime);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка удаления списания рабочего времени");
    }
  }
}

module.exports = new WrittenOffTimeController();
