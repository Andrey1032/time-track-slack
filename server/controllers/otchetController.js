const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const { Department, Reworking, Calendar, Underworking, Reworking_month, Underworking_month, Writing_off_time, User, Working_Hours } = require("../database/models");

class OtchetController {
  async getOtchet(req, res) {
    //const { month, year } = req.query
    const {id_department, month, year } = req.query
     let department,
      departmentF;

      let date = new Date(new Date(year, month - 1).toJSON().substring(0, 10));
      let lastDayCurrentMonth = new Date(new Date(year, month).toJSON().substring(0, 10));

      let massivDates = new Array(lastDayCurrentMonth.getDate()).fill(null)

      let usersMassiv = []

    try {

      if (id_department) {

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

        department = await Department.findOne({
          where: { id_department },
          include: [
            {
              association: "users",
              attributes: ["id_user", "surname", "name",],
              include: [
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
                {model: Writing_off_time,
                  where: {month: date.getMonth() + 1, year: date.getFullYear()},
                  required: false,
                }
              ],
            },
          ],
          attributes: [
            "id_department",
            ["name_department", "title"],
          ],
        });



      } else {
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
        department = await Department.findAll({
          include: [
            {
              association: "users",
              attributes: ["id_user", "surname", "name",],
              include: [
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
                {model: Writing_off_time,
                  where: {month: date.getMonth() + 1, year: date.getFullYear()},
                  required: false,
                }
              ],
            },
          ],
          attributes: [
            "id_department",
            ["name_department", "title"],
          ],
        });
      }

      departmentF = JSON.parse(JSON.stringify(department));



      if (Array.isArray(departmentF)) {
        departmentF.sort((a, b) => {
          return a.id_department - b.id_department;
        });
        departmentF.forEach((el) => {
          el.users.sort((a, b) =>
            a.surname.localeCompare(b.surname, undefined, {
              sensitivity: "base",
            })
          );
        });
        
        let departmentForOtchet = []
        let months = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ]

        departmentF.forEach(async (department) => {
          departmentForOtchet.push({
            title: department.title,
            subtitle: `Табель рабочего времени ${months[month-1]} ${year} г. ${department.title}`,
            underworking: [],
            reworking: []
          })
        })

        const convertTime = (time) => {
          if (time === null) time = "00:00:00";
          const timeArr = time.split(":");
          const newTime = +timeArr[0] * 60 + +timeArr[1];
          return newTime;
      };

      function sumTime(a, b) {
          if (a === null || b === null) return 0;
          let time = a + b;
          return time;
      }

      departmentF.forEach((department, index) => {
          department.users.forEach(async(user) => {

            let massivDatesRework = new Array(lastDayCurrentMonth.getDate()).fill(null)
            let massivDatesUnderwork = new Array(lastDayCurrentMonth.getDate()).fill(null)

            user.reworkings.forEach((rework) => {
              let day = new Date(rework.calendar.date).getDate()
              let time = sumTime(convertTime(rework.time_reworking), convertTime(massivDatesRework[day-1]))
              massivDatesRework[day-1] = `${Math.floor(time / 60)}:${
                time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
            }`
            })
            user.underworkings.forEach((rework) => {
              let day = new Date(rework.calendar.date).getDate()
              let time = sumTime(convertTime(rework.time_underworking), convertTime(massivDatesUnderwork[day-1]))
              massivDatesUnderwork[day-1] = `${Math.floor(time / 60)}:${
                time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
            }`
            })

            let writtenRe = user.writing_off_times.reverse().find(type => type.typeOfWorkIdTypeOfWork === 1)
            let writtenUnder = user.writing_off_times.reverse().find(type => type.typeOfWorkIdTypeOfWork === 2)

            departmentForOtchet[index].underworking.push({
              name: `${user.surname} ${user.name[0]}.`,
              missed: writtenUnder?.new_value || user.underworking_months[0]?.time_underworking_month || null,
              date: massivDatesUnderwork
            })
            departmentForOtchet[index].reworking.push({
              name: `${user.surname} ${user.name[0]}.`,
              worked: writtenRe?.new_value || user.reworking_months[0]?.time_reworking_month || null,
              date: massivDatesRework
            })    
            
          })
        })
        

        return res.status(200).send(departmentForOtchet);
      } else {
        departmentF.users.sort((a, b) =>
          a.surname.localeCompare(b.surname, undefined, { sensitivity: "base" }) 
      );
      let departmentForOtchet
      let months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ]

        departmentForOtchet = {
          idDer: departmentF.id_department,
          title: departmentF.title,
          subtitle: `Табель рабочего времени ${months[month-1]} ${year} г. ${departmentF.title}`,
          underworking: [],
          reworking: []
        }

      const convertTime = (time) => {
        if (time === null) time = "00:00:00";
        const timeArr = time.split(":");
        const newTime = +timeArr[0] * 60 + +timeArr[1];
        return newTime;
    };

    function sumTime(a, b) {
        if (a === null || b === null) return 0;
        let time = a + b;
        return time;
    }

      departmentF.users.forEach(async(user) => {

          let massivDatesRework = new Array(lastDayCurrentMonth.getDate()).fill(null)
          let massivDatesUnderwork = new Array(lastDayCurrentMonth.getDate()).fill(null)

          user.reworkings.forEach((rework) => {
            let day = new Date(rework.calendar.date).getDate()
            let time = sumTime(convertTime(rework.time_reworking), convertTime(massivDatesRework[day-1]))
            massivDatesRework[day-1] = `${Math.floor(time / 60)}:${
              time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
          }`
          })
          user.underworkings.forEach((rework) => {
            let day = new Date(rework.calendar.date).getDate()
            let time = sumTime(convertTime(rework.time_underworking), convertTime(massivDatesUnderwork[day-1]))
            massivDatesUnderwork[day-1] = `${Math.floor(time / 60)}:${
              time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
          }`
          })

          let writtenRe = user.writing_off_times.reverse().find(type => type.typeOfWorkIdTypeOfWork === 1)
          let writtenUnder = user.writing_off_times.reverse().find(type => type.typeOfWorkIdTypeOfWork === 2)

          departmentForOtchet.underworking.push({
            name: `${user.surname} ${user.name[0]}.`,
            missed: writtenUnder?.new_value || user.underworking_months[0]?.time_underworking_month || null,
            date: massivDatesUnderwork
          })
          departmentForOtchet.reworking.push({
            name: `${user.surname} ${user.name[0]}.`,
            worked: writtenRe?.new_value || user.reworking_months[0]?.time_reworking_month || null,
            date: massivDatesRework
          })    
          
        })
      

      return res.status(200).send(departmentForOtchet);


    }
    
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка получения отдела(отделов)");
    }
  }
}

module.exports = new OtchetController();
