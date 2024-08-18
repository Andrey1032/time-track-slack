const cron = require("node-cron");
const {
  User,
  Calendar,
  Reworking,
  Underworking,
  Reworking_month,
  Underworking_month,
  Writing_off_time,
} = require("../database/models");
const Sequelize = require("sequelize");

cron.schedule("10 0 1 * *", async function () {

let date = new Date(new Date(new Date().getFullYear(), new Date().getMonth()).toJSON().substring(0, 10))

  let dates = JSON.parse(
    JSON.stringify(
      await Calendar.findAll({
        where: {
          date: {
            [Sequelize.Op.between]: [
              new Date(date.getFullYear(), date.getMonth(), 2)
                .toJSON()
                .substring(0, 10),
              new Date(date.getFullYear(), date.getMonth() + 1)
                .toJSON()
                .substring(0, 10),
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

  let userAll = await User.findAll({
    where: { userRoleIdUserRole: { [Sequelize.Op.not]: 1 } },
    attributes: ["id_user"],
    include: [
      {
        model: Reworking,
        where: { calendarIdCalendar: datesMassiv },
        required: false,
      },
      {
        model: Underworking,
        where: { calendarIdCalendar: datesMassiv },
        required: false,
      },
      {
        model: Reworking_month,
        where: {
          [Sequelize.Op.and]: [
            { month: date.getMonth(), year: date.getFullYear() },
          ],
        },
        required: false,
      },
      {
        model: Underworking_month,
        where: {
          [Sequelize.Op.and]: [
            { month: date.getMonth(), year: date.getFullYear() },
          ],
        },
        required: false,
      },
    ],
  });

  let users = JSON.parse(JSON.stringify(userAll));

  const convertTime = (time) => {
    if (time === null) return 0;
    const timeArr = time.split(":");
    const newTime = +timeArr[0] * 60 + +timeArr[1];
    return newTime;
  };

  try {
    users.forEach(async (user) => {
      let newReworkingMonth = user.reworkings.reduce(
        (acc, curVal) => acc + convertTime(curVal.time_reworking),
        0
      );
      let newUnderworkingMonth = user.underworkings.reduce(
        (acc, curVal) => acc + convertTime(curVal.time_underworking),
        0
      );

      let writtenWorked = await Writing_off_time.findAll({
        where: {
          typeOfWorkIdTypeOfWork: 1,
          month: date.getMonth(),
          year: date.getFullYear(),
          userIdUser: user.id_user,
        },
      });
      writtenWorked = JSON.parse(JSON.stringify(writtenWorked))?.at(-1);

      let writtenMissed = await Writing_off_time.findAll({
        where: {
          typeOfWorkIdTypeOfWork: 2,
          month: date.getMonth(),
          year: date.getFullYear(),
          userIdUser: user.id_user,
        },
      });
      writtenMissed = JSON.parse(JSON.stringify(writtenMissed))?.at(-1);

      let oldUnderworking =
        writtenMissed?.new_value ||
        user.underworking_months[0]?.time_underworking_month ||
        "00:00:00";
      let oldUnderworkingMonth = convertTime(oldUnderworking);
      let oldReworking =
        writtenWorked?.new_value ||
        user.reworking_months[0]?.time_reworking_month ||
        "00:00:00";
      let oldReworkingMonth = convertTime(oldReworking);
      let timeUnderWorkings = newUnderworkingMonth + oldUnderworkingMonth;
      let timeReworkings = newReworkingMonth + oldReworkingMonth;
      let itogReworkings = `${Math.floor(timeReworkings / 60)}:${
        timeReworkings % 60 < 10
          ? `0${timeReworkings % 60}`
          : `${timeReworkings % 60}`
      }`;
      let itogUnderworkings = `${Math.floor(timeUnderWorkings / 60)}:${
        timeUnderWorkings % 60 < 10
          ? `0${timeUnderWorkings % 60}`
          : `${timeUnderWorkings % 60}`
      }`;

      const underworkingMonth = await Underworking_month.create({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        time_underworking_month: itogUnderworkings,
        userIdUser: user.id_user,
      });
      const reworkingMonth = await Reworking_month.create({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        time_reworking_month: itogReworkings,
        userIdUser: user.id_user,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
