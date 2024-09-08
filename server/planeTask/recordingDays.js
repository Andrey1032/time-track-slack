const cron = require("node-cron");
const { User, Calendar, Working_Hours, Underworking } = require("../database/models");
const Sequelize = require("sequelize");

cron.schedule("05 00 * * *", async function () {
  const userAll = await User.findAll({
    where: { userRoleIdUserRole: { [Sequelize.Op.not]: 1 } },
    attributes: ["id_user"],
  });
  let users = JSON.parse(JSON.stringify(userAll));

  let yesterday = new Date(Date.now() - 86400000);
  let date = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
  let calendar = await Calendar.findOne({ where: { date: date } });

  if (calendar.datatypeIdDatatype == 2){
    try {
      users.forEach(async (user) => {
        let work = await Working_Hours.findOne({
          where: {
            userIdUser: user.id_user,
            calendarIdCalendar: calendar.id_calendar,
          },
        });
        if (!work) {
          const workingHours = await Working_Hours.create({
            userIdUser: user.id_user,
            calendarIdCalendar: calendar.id_calendar,
            workflowTimeTypeIdWorkflowTimeType: 2,
          });
          const underworking = await Underworking.create({
              time_underworking: '08:00',
              userIdUser: user.id_user,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

});
