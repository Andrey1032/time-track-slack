const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
// const {
//   User,
//   Account_Data,
//   User_Role,
//   Department,
//   Message,
//   Working_Hours,
//   Reworking,
//   Underworking,
//   Reworking_month,
//   Underworking_month,
//   Calendar,
//   Writing_off_time,
// } = require("../database/models");

const { User } = require("../database/userModel");
const { Account_Data } = require("../database/accountDataModel");
const { User_Role } = require("../database/userRoleModel");
const { Department } = require("../database/userModel");
const { Message } = require("../database/messageModel");
const { Working_Hours } = require("../database/workingHoursModel");
const { Reworking } = require("../database/reworkingModel");
const { Underworking } = require("../database/underworkingModel");
const { Reworking_month } = require("../database/reworkingMonthModel");
const { Underworking_month } = require("../database/underworkingMonthModel");
const { Calendar } = require("../database/calendarModel");
const { Writing_off_time } = require("../database/writtenOffTimeModel");

const generateJwt = (id, login, slack) => {
  return jwt.sign({ id, login, slack }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class AccountDataController {
  async registrationUser(req, res) {
    const { slack, password, login, aboutUser } = req.body;
    if (!login || !password) {
      //return next(ApiError.badRequest('Некорректный login или password'))
      return res.status(401).send("Некорректный login или password");
    }
    const candidate = await Account_Data.findOne({ where: { login } });
    if (candidate) {
      //return next(ApiError.badRequest('Пользователь с таким login уже существует'))
      return res.status(401).send("Пользователь с таким login уже существует");
    }
    const hashPassword = await bcrypt.hash(password, 5);
    let user, aboutUser2, user2;

    try {
      user = await Account_Data.create({
        slack,
        login,
        password: hashPassword,
      });

      if (aboutUser) {
        aboutUser2 = [aboutUser];
        aboutUser2.forEach(async (i) => {
          await User.create({
            surname: i.surname,
            name: i.name,
            middle_name: i.middle_name,
            userRoleIdUserRole: i.userRoleIdUserRole,
            departmentIdDepartment: i.departmentIdDepartment,
            accountDatumIdAccountData: user.id_account_data,
          });
          return res.json(
            await User.findOne({
              where: { accountDatumIdAccountData: user.id_account_data },
              attributes: ["id_user"],
            })
          );
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Ошибка заполнения идентификационных или личных данных");
    }

    //const token = generateJwt(user.id_user, user.login, user.slack);
    //return res.json({ token });
  }

  async loginUser(req, res, next) {
    const { login, password } = req.body;
    const userAD = await Account_Data.findOne({ where: { login } });
    if (!userAD) {
      //return next(ApiError.internal('Пользователь не найден'))
      return res.status(500).send("Пользователь не найден");
    }
    let comparePassword = bcrypt.compareSync(password, userAD.password);
    if (!comparePassword) {
      //return next(ApiError.internal('Указан неверный пароль'))
      return res.status(500).send("Указан неверный пароль");
    }
    const token = generateJwt(userAD.id_user, userAD.login, userAD.slack);
    let year = new Date().getFullYear(),
      month = new Date().getMonth() + 1;

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
        where: { accountDatumIdAccountData: userAD.id_account_data },
        include: [
          {
            model: User_Role,
            attributes: ["id_user_role"],
          },
          {
            model: Department,
            attributes: ["id_department", "name_department"],
          },
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
                {
                  month:
                    new Date(
                      new Date(year, month - 1).toJSON().substring(0, 10)
                    ).getMonth() + 1,
                  year: new Date(
                    new Date(year, month - 1).toJSON().substring(0, 10)
                  ).getFullYear(),
                },
              ],
            },
            //where: [{month: month-1, year: year}],
            required: false,
          },
          {
            model: Underworking_month,
            where: {
              [Sequelize.Op.and]: [
                {
                  month:
                    new Date(
                      new Date(year, month - 1).toJSON().substring(0, 10)
                    ).getMonth() + 1,
                  year: new Date(
                    new Date(year, month - 1).toJSON().substring(0, 10)
                  ).getFullYear(),
                },
              ],
            },
            required: false,
            //where: {month: month-1, year: year}
          },
        ],
      });

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
              userIdUser: user.id_user,
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
        return res
          .status(500)
          .send("Ошибка получения информации о пользователе");
      }

      user = JSON.parse(JSON.stringify(user));

      if (user.working_hours.length > 0) {
        user.working_hours.forEach((element) => {
          let index = userF[0].findIndex((el) => {
            return element.calendar.date === el.date;
          });

          if (!element.start_time && element.end_time)
            element.start_time = "--:--";
          if (element.start_time && !element.end_time)
            element.end_time = "--:--";

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
          const timeArr = element.time_message.split(":");
          let typeMessage = "";
          switch (element.messageTypeChangeIdMessageTypeChange) {
            case 1: {
              typeMessage = "(Удаленное)";
              break;
            }
            case 2: {
              typeMessage = "(Измененное)";
              break;
            }
          }
          userF[0][index]?.otchet.push(
            `${timeArr[0]}:${timeArr[1]} - ${element.message_text} ${typeMessage}`
          );
        });

        // userF.underworking_months?.map((el) => {
        //   el.newDate = new moment(el.year + el.month, "YYYY-MM-DD");
        // });
        // userF.reworking_months?.map((el) => {
        //   el.newDate = new moment(el.year + el.month, "YYYY-MM-DD");
        // });
      }

      userF.underworking_months?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      userF.reworking_months?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      let writtenWorked, writtenMissed;

      try {
        writtenWorked = await Writing_off_time.findAll({
          where: {
            typeOfWorkIdTypeOfWork: 1,
            month:
              new Date(
                new Date(year, month - 1).toJSON().substring(0, 10)
              ).getMonth() + 1,
            year: new Date(
              new Date(year, month - 1).toJSON().substring(0, 10)
            ).getFullYear(),
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
            month:
              new Date(
                new Date(year, month - 1).toJSON().substring(0, 10)
              ).getMonth() + 1,
            year: new Date(
              new Date(year, month - 1).toJSON().substring(0, 10)
            ).getFullYear(),
            userIdUser: user.id_user,
          },
          //where: { [Sequelize.and]: [{typeOfWorkIdTypeOfWork: 2}, {month: user.underworking_months.month}, {year: user.underworking_months.year}, {userIdUser: user.id_user}]},
        });
        writtenMissed = JSON.parse(JSON.stringify(writtenMissed))?.at(-1);
      } catch (error) {}

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

      let _user = {
        id_user: user.id_user,
        surname: user.surname,
        name: user.name,
        middleName: user.middle_name,
        slack: userAD.slack,
        role: user.user_role.id_user_role,
        departament: user.department,
        dataWork: userF,
        token: token,
        menuYear: menuYear,
      };

      return res.status(200).send(_user);
      //return res.json(user)
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка поиска данных о пользователе");
    }

    //return res.json({ token });
  }

  async check(req, res, next) {
    let year = new Date().getFullYear(),
      month = new Date().getMonth() + 1;

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
      const userAD = await Account_Data.findOne({
        where: { login: req.userToken.login },
      });
      const token = generateJwt(userAD.id_user, userAD.login, userAD.slack);
      let user = await User.findOne({
        where: { accountDatumIdAccountData: userAD.id_account_data },
        include: [
          {
            model: User_Role,
            attributes: ["id_user_role"],
          },
          {
            model: Department,
            attributes: ["id_department", "name_department"],
          },
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
                {
                  month:
                    new Date(
                      new Date(year, month - 1).toJSON().substring(0, 10)
                    ).getMonth() + 1,
                  year: new Date(
                    new Date(year, month - 1).toJSON().substring(0, 10)
                  ).getFullYear(),
                },
              ],
            },
            //where: [{month: month-1, year: year}],
            required: false,
          },
          {
            model: Underworking_month,
            where: {
              [Sequelize.Op.and]: [
                {
                  month:
                    new Date(
                      new Date(year, month - 1).toJSON().substring(0, 10)
                    ).getMonth() + 1,
                  year: new Date(
                    new Date(year, month - 1).toJSON().substring(0, 10)
                  ).getFullYear(),
                },
              ],
            },
            required: false,
            //where: {month: month-1, year: year}
          },
        ],
      });

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
              userIdUser: user.id_user,
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
        return res
          .status(500)
          .send("Ошибка получения информации о пользователе");
      }

      user = JSON.parse(JSON.stringify(user));

      if (user.working_hours.length > 0) {
        user.working_hours.forEach((element) => {
          let index = userF[0].findIndex((el) => {
            return element.calendar.date === el.date;
          });

          if (!element.start_time && element.end_time)
            element.start_time = "--:--";
          if (element.start_time && !element.end_time)
            element.end_time = "--:--";

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
          userF[0][index].reworked_time.push({
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
          userF[0][index].underworking_time.push({
            time: element.time_underworking,
            comment: element.comments,
            autocreater: autocreater,
          });
        });

        user.messages.forEach((element) => {
          let index = userF[0].findIndex((el) => {
            return element.calendar.date === el.date;
          });
          const timeArr = element.time_message.split(":");
          let typeMessage = "";
          switch (element.messageTypeChangeIdMessageTypeChange) {
            case 1: {
              typeMessage = "(Удаленное)";
              break;
            }
            case 2: {
              typeMessage = "(Измененное)";
              break;
            }
          }
          userF[0][index]?.otchet.push(
            `${timeArr[0]}:${timeArr[1]} - ${element.message_text} ${typeMessage}`
          );
        });
      }
      // userF.underworking_months?.map((el) => {
      //   el.newDate = new moment(el.year + el.month, "YYYY-MM-DD");
      // });
      // userF.reworking_months?.map((el) => {
      //   el.newDate = new moment(el.year + el.month, "YYYY-MM-DD");
      // });

      userF.underworking_months?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      userF.reworking_months?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      let writtenWorked, writtenMissed;

      try {
        writtenWorked = await Writing_off_time.findAll({
          where: {
            typeOfWorkIdTypeOfWork: 1,
            month:
              new Date(
                new Date(year, month - 1).toJSON().substring(0, 10)
              ).getMonth() + 1,
            year: new Date(
              new Date(year, month - 1).toJSON().substring(0, 10)
            ).getFullYear(),
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
            month:
              new Date(
                new Date(year, month - 1).toJSON().substring(0, 10)
              ).getMonth() + 1,
            year: new Date(
              new Date(year, month - 1).toJSON().substring(0, 10)
            ).getFullYear(),
            userIdUser: user.id_user,
          },
          //where: { [Sequelize.and]: [{typeOfWorkIdTypeOfWork: 2}, {month: user.underworking_months.month}, {year: user.underworking_months.year}, {userIdUser: user.id_user}]},
        });
        writtenMissed = JSON.parse(JSON.stringify(writtenMissed))?.at(-1);
      } catch (error) {}

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

      let _user = {
        id_user: user.id_user,
        surname: user.surname,
        name: user.name,
        middleName: user.middle_name,
        slack: req.slack,
        role: user.user_role.id_user_role,
        departament: user.department,
        dataWork: userF,
        token: token,
        menuYear: menuYear,
      };

      return res.status(200).send(_user);
      //return res.json(user)
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка поиска данных о пользователе");
    }
  }
}

module.exports = new AccountDataController();
