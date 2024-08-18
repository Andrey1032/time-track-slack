const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
//const { Sequelize } = require("../database/db");
const {
  User,
  Message,
  Working_Hours,
  Reworking,
  Underworking,
  Reworking_month,
  Underworking_month,
  Calendar,
  User_Role,
  Department,
  Writing_off_time,
  Account_Data,
} = require("../database/models");

class UserController {
  async createUser(req, res) {
    const {
      surname,
      name,
      middle_name,
      accountDatumIdAccountData,
      userRoleIdUserRole,
      departmentIdDepartment,
    } = req.body;
    try {
      const user = await User.create({
        surname,
        name,
        middle_name,
        accountDatumIdAccountData,
        userRoleIdUserRole,
        departmentIdDepartment,
      });
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи личных данных");
    }
  }

  async getOneUser(req, res) {
    let { id_user, month, year } = req.query;

    let date = new Date(new Date(year, month - 1).toJSON().substring(0, 10));

    let currentDate = new Date();
    let yearMenu = currentDate.getFullYear() - 1;
    let firstDateCurrentYear;
    let lastDateCurrentYear;
    let menuYear = [currentDate.getFullYear()];
    let year_user;

    try {
      do {

        firstDateCurrentYear = await Calendar.findOne({
          where: {
            date: new Date(yearMenu, 1 - 1, 2).toJSON().substring(0, 10),
          },
        });

        lastDateCurrentYear = await Calendar.findOne({
          where: {
            date: new Date(yearMenu, 12).toJSON().substring(0, 10),
          },
        });

        if (!firstDateCurrentYear || !lastDateCurrentYear) break;

        year_user = await Working_Hours.findOne({
          where: {
            userIdUser: id_user,
            calendarIdCalendar: {
              [Sequelize.Op.between]: [
                firstDateCurrentYear.id_calendar,
                lastDateCurrentYear.id_calendar,
              ],
            },
          },
        });

        if (year_user) {
          menuYear.push(yearMenu);
          yearMenu--;
        }
      } while (year_user);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка получения информации о пользователе");
    }


    try {
      let dates = JSON.parse(
        JSON.stringify(
          await Calendar.findAll({
            where: {
              date: {
                [Sequelize.Op.between]: [
                  new Date(year, month - 1, 2).toJSON().substring(0, 10),
                  new Date(year, month).toJSON().substring(0, 10),
                ],
              },
            },
          })
        )
      );

      let datesMassiv = [];
      dates.forEach((i) => {
        datesMassiv.push(i.id_calendar);
      });

      let userF = [[]];
      let user = await User.findOne({
        where: { id_user },
        include: [
          {
            model: Message,
            where: { calendarIdCalendar: datesMassiv },
            required: false,
            include: [
              {
                model: Calendar,
                where: { id_calendar: datesMassiv },
                required: false,
                attributes: ["date"],
              },
            ],
          },
          {
            model: Working_Hours,
            where: { calendarIdCalendar: datesMassiv },
            required: false,
            include: [
              {
                model: Calendar,
                where: { id_calendar: datesMassiv },
                required: false,
                attributes: ["date"],
              },
            ],
          },
          {
            model: Reworking,
            where: { calendarIdCalendar: datesMassiv },
            required: false,
            include: [
              {
                model: Calendar,
                where: { id_calendar: datesMassiv },
                required: false,
                attributes: ["date"],
              },
            ],
          },
          {
            model: Underworking,
            where: { calendarIdCalendar: datesMassiv },
            required: false,
            include: [
              {
                model: Calendar,
                where: { id_calendar: datesMassiv },
                required: false,
                attributes: ["date"],
              },
            ],
          },
          {
            model: Reworking_month,
            where: {
              [Sequelize.Op.and]: [
                { month: date.getMonth() + 1, year: date.getFullYear() },
              ],
            },
            //where: [{month: month-1, year: year}],
            required: false,
          },
          {
            model: Underworking_month,
            where: {
              [Sequelize.Op.and]: [
                { month: date.getMonth() + 1, year: date.getFullYear() },
              ],
            },
            required: false,
            //where: {month: month-1, year: year}
          },
        ],
      });
      user = JSON.parse(JSON.stringify(user));

      if (user.working_hours.length === 0)
        return res
          .status(200)
          .send({title: "Информация о рабочем времени сотрудника отсутствует", menuYear: menuYear});

      user.working_hours.forEach((element) => {
        let index = userF[0].findIndex((el) => {
          return element.calendar.date === el.date;
        });

        if (!element.start_time && element.end_time)
          element.start_time = "--:--";
        if (element.start_time && !element.end_time) element.end_time = "--:--";

        if (index < 0 || userF[0].length == 0) {
          if (element.start_time !== null) {
            userF[0].push({
              date: element.calendar.date,
              worked_time: [
                {
                  start: element.start_time,
                  end: element.end_time,
                },
              ],
              reworked_time: [],
              underworking_time: [],
              otchet: [],
            });
          } else {
            userF[0].push({
              date: element.calendar.date,
              worked_time: [],
              reworked_time: [],
              underworking_time: [],
              otchet: [],
            });
          }
        } else if (element.start_time !== null) {
          userF[0][index].worked_time.push({
            start: element.start_time,
            end: element.end_time,
          });
          userF[0][index].worked_time.sort((a, b) => {
            return a.start?.localeCompare(b.start);
          });
        }
      });

      userF[0].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      user.reworkings.forEach((element) => {
        let index = userF[0].findIndex((el) => {
          return element.calendar.date === el.date;
        });
        let autocreater =
          element.typeOverUnderWorkIdTypeOverUnderWork === 1 ? true : false;
        userF[0][index]?.reworked_time.push({
          time: element.time_reworking,
          comment: element.comments,
          autocreater: autocreater,
        });
      });

      user.underworkings.forEach((element) => {
        let index = userF[0].findIndex((el) => {
          return element.calendar.date === el.date;
        });
        let autocreater =
          element.typeOverUnderWorkIdTypeOverUnderWork === 1 ? true : false;
        userF[0][index]?.underworking_time.push({
          time: element.time_underworking,
          comment: element.comments,
          autocreater: autocreater,
        });
      });

      user.messages.forEach((element) => {
        let index = userF[0].findIndex((el) => {
          return element.calendar.date === el.date;
        });
        userF[0][index]?.otchet.push(element.message_text);
      });

      userF.underworking_months?.map((el) => {
        el.newDate = new moment(el.year + el.month, "YYYY-MM-DD");
      });
      userF.reworking_months?.map((el) => {
        el.newDate = new moment(el.year + el.month, "YYYY-MM-DD");
      });

      let writtenWorked, writtenMissed;

      try {
        writtenWorked = await Writing_off_time.findAll({
          where: {
            typeOfWorkIdTypeOfWork: 1,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            userIdUser: user.id_user,
          },
          //where: { [Sequelize.and]: [{typeOfWorkIdTypeOfWork: 1}, {month: user.reworking_months.month}, {year: user.reworking_months.year}, {userIdUser: user.id_user}]},
        });
        writtenWorked = JSON.parse(JSON.stringify(writtenWorked))?.at(-1);
      } catch (error) {}

      try {
        writtenMissed = await Writing_off_time.findAll({
          where: {
            typeOfWorkIdTypeOfWork: 2,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            userIdUser: user.id_user,
          },
          //where: { [Sequelize.and]: [{typeOfWorkIdTypeOfWork: 2}, {month: user.underworking_months.month}, {year: user.underworking_months.year}, {userIdUser: user.id_user}]},
        });
        writtenMissed = JSON.parse(JSON.stringify(writtenMissed))?.at(-1);
      } catch (error) {}

      userF.underworking_months?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      userF.reworking_months?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      userF.push({
        missed:
          writtenMissed?.new_value ||
          user.underworking_months[0]?.time_underworking_month ||
          "00:00:00",
        worked:
          writtenWorked?.new_value ||
          user.reworking_months[0]?.time_reworking_month ||
          "00:00:00",
      });

      userF.push(menuYear)

      return res.status(200).send(userF);
      //return res.json(user)
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка получения информации о пользователе");
    }
  }

  async updateUser(req, res) {
    const { id_user } = req.params;
    const {
      surname,
      name,
      middle_name,
      userRoleIdUserRole,
      departmentIdDepartment,
      login,
      slack,
      password,
    } = req.body;
    try {
      const user_old = JSON.parse(
        JSON.stringify(
          await User.findOne({
            where: { id_user },
          })
        )
      );
      const accountData_old = JSON.parse(
        JSON.stringify(
          await Account_Data.findOne({
            where: { id_account_data: user_old.accountDatumIdAccountData },
          })
        )
      );
      const user = await User.update(
        {
          surname: surname ? surname : user_old.surname,
          name: name ? name : user_old.name,
          middle_name: middle_name ? middle_name : user_old.middle_name,
          userRoleIdUserRole: userRoleIdUserRole
            ? userRoleIdUserRole
            : user_old.userRoleIdUserRole,
          departmentIdDepartment: departmentIdDepartment
            ? departmentIdDepartment
            : user_old.departmentIdDepartment,
        },
        { where: { id_user } }
      );
      const accountData = await Account_Data.update(
        {
          login: login ? login : accountData_old.login,
          slack: slack ? slack : accountData_old.slack,
          password: password
            ? await bcrypt.hash(password, 5)
            : accountData_old.password,
        },
        {
          where: { id_account_data: user_old.accountDatumIdAccountData },
        }
      );

      return res.json([user, accountData]);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления личных данных");
    }
  }

  async deleteUser(req, res) {
    const { id_user } = req.params;
    try {
      const user = await User.findOne({ where: { id_user } });
      const accountData = await Account_Data.destroy({
        where: { id_account_data: user.accountDatumIdAccountData },
      });
      return res.json(accountData);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка удаления личных данных");
    }
  }
}

module.exports = new UserController();
