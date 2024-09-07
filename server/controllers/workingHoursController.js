const Sequelize = require("sequelize");
const {
  Working_Hours,
  Calendar,
  User,
  Account_Data,
  Reworking,
  Underworking,
} = require("../database/models");

class WorkingHoursController {
  async createWorkingHours(req, res) {
    const {
      start_time,
      end_time,
      comments,
      userIdUser,
      date,
      changesByUserID,
      workflowTimeTypeIdWorkflowTimeType,
      slackIdUser,
    } = req.body;
    try {
      let account, user;
      if (slackIdUser) {
        account = await Account_Data.findOne({
          where: { slack: slackIdUser },
          attributes: ["id_account_data"],
        });
        user = await User.findOne({
          where: {
            accountDatumIdAccountData: account.id_account_data,
          },
          attributes: ["id_user"],
        });
      }
      const calendar = await Calendar.findOne({ where: { date: date } });
      const workingHours = await Working_Hours.create({
        start_time,
        end_time,
        comments,
        userIdUser: userIdUser || user.id_user,
        calendarIdCalendar: calendar.id_calendar,
        changesByUserID,
        workflowTimeTypeIdWorkflowTimeType,
      });

      if (!slackIdUser) {
        let underworking = JSON.parse(
          JSON.stringify(
            await Underworking.findOne({
              where: {
                userIdUser: userIdUser,
                calendarIdCalendar: calendar.id_calendar,
                typeOverUnderWorkIdTypeOverUnderWork: 1,
              },
            })
          )
        );
        let reworking = JSON.parse(
          JSON.stringify(
            await Reworking.findOne({
              where: {
                userIdUser: userIdUser,
                calendarIdCalendar: calendar.id_calendar,
                typeOverUnderWorkIdTypeOverUnderWork: 1,
              },
            })
          )
        );

        let workingTimes = JSON.parse(
          JSON.stringify(
            await Working_Hours.findAll({
              where: {
                userIdUser: userIdUser,
                calendarIdCalendar: calendar.id_calendar,
              },
            })
          )
        );

        const convertTime = (time) => {
          if (time === null) return 0;
          const timeArr = time.split(":");
          const newTime = +timeArr[0] * 60 + +timeArr[1];
          return newTime;
        };

        function sumTime(a, b) {
          if (a === null || b === null) return 0;
          let time = a + b;
          return time;
        }

        function raznTime(b, a) {
          if (a === null || b === null) return 0;
          let time = b - a;
          return time;
        }

        function timeConvert(time) {
          return `${Math.floor(time / 60)}:${
            time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
          }`;
        }

        let timeInterval = 0,
          reworkingsTimes = 0,
          underworkingsTimes = 0;
        let dayHours = convertTime(process.env.TIME_WORKING_HOURS_8);
        let startDayTime = convertTime(process.env.TIME_WORKING_HOURS_START);
        let endDayTime = convertTime(process.env.TIME_WORKING_HOURS_END);
        let startLunchTime = convertTime(process.env.TIME_LUNCH_TIME_START);
        let endLunchTime = convertTime(process.env.TIME_LUNCH_TIME_END);

        workingTimes.forEach((el) => {
          let s = convertTime(el.start_time),
            e = convertTime(el.end_time);

          if (s >= startDayTime && e <= endDayTime) {
            if (s <= startLunchTime && e >= endLunchTime) {
              timeInterval = sumTime(
                raznTime(
                  raznTime(e, s),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
            } else if (s >= startLunchTime && s < endLunchTime) {
              timeInterval = sumTime(raznTime(e, endLunchTime), timeInterval);
            } else if (e > startLunchTime && e <= endLunchTime) {
              timeInterval = sumTime(raznTime(startLunchTime, e), timeInterval);
            }
          } else if (e > endDayTime && s < startDayTime) {
            reworkingsTimes = sumTime(
              sumTime(raznTime(startDayTime, s), raznTime(e, endDayTime)),
              reworkingsTimes
            );
            timeInterval = dayHours;
          } else if (e <= startDayTime || s >= endDayTime) {
            reworkingsTimes = sumTime(raznTime(e, s), reworkingsTimes);
          } else if (e > startDayTime && s < startDayTime) {
            if (e >= endLunchTime) {
              timeInterval = sumTime(
                sumTime(
                  raznTime(e, startDayTime),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            } else if (e > startLunchTime && e <= endLunchTime) {
              timeInterval = sumTime(
                raznTime(startLunchTime, startDayTime),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            } else {
              timeInterval = sumTime(raznTime(e, startDayTime), timeInterval);
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            }
          } else if (e > endDayTime && s < endDayTime) {
            if (s >= startLunchTime && s < endLunchTime) {
              timeInterval = sumTime(
                raznTime(endLunchTime, endDayTime),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            } else if (s < startLunchTime) {
              timeInterval = sumTime(
                raznTime(
                  raznTime(endDayTime, s),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            } else {
              timeInterval = sumTime(raznTime(endDayTime, s), timeInterval);
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            }
          }
        });

        underworkingsTimes = raznTime(dayHours, timeInterval);

        if (reworkingsTimes != 0) {
          if (reworking) {
            await Reworking.update(
              {
                time_reworking: timeConvert(reworkingsTimes),
              },
              {
                where: {
                  id_reworking: reworking.id_reworking,
                },
              }
            );
          } else {
            await Reworking.create({
              time_reworking: timeConvert(reworkingsTimes),
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
          }
        } else if (reworkingsTimes == 0) {
          if (reworking) {
            await Reworking.destroy({
              where: {
                id_reworking: reworking.id_reworking,
              },
            });
          }
        } else if (underworkingsTimes != 0) {
          if (underworking) {
            await Underworking.update(
              {
                time_underworking: timeConvert(underworkingsTimes),
              },
              {
                where: {
                  id_inderworking: underworking.id_inderworking,
                },
              }
            );
          } else {
            await Underworking.create({
              time_underworking: timeConvert(underworkingsTimes),
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
          }
        } else if (underworkingsTimes == 0) {
          if (underworking) {
            await Underworking.destroy({
              where: {
                id_inderworking: underworking.id_inderworking,
              },
            });
          }
        }
      }

      return res.json(workingHours);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи рабочего времени");
    }
  }

  async updateWorkingHours(req, res) {
    const year = req.params.year;
    const month = req.params.month;
    const day = req.params.day;
    const {
      start_time_old,
      end_time_old,
      start_time_new,
      end_time_new,
      comments,
      userIdUser,
      changesByUserID,
      workflowTimeTypeIdWorkflowTimeType,
      slackIdUser,
    } = req.body;
    console.log("11111111111111111111111", req.body);
    if (slackIdUser) {
      try {
        const account = await Account_Data.findOne({
          where: { slack: slackIdUser },
          attributes: ["id_account_data"],
        });
        const user = await User.findOne({
          where: {
            accountDatumIdAccountData: account.id_account_data,
          },
          attributes: ["id_user"],
        });
        const calendar = await Calendar.findOne({
          where: { date: `${year}-${month}-${day}` },
        });

        const workingHoursLast = await Working_Hours.findOne({
          order: Sequelize.fn("max", Sequelize.Op.col("id_working_hours")),
          where: {
            userIdUser: user.id_user,
            calendarIdCalendar: calendar.id_calendar,
            end_time: null,
          },
        });

        if (workingHoursLast) {
          await Working_Hours.update(
            {
              end_time: end_time_new,
            },
            {
              where: {
                id_working_hours: workingHoursLast.id_working_hours,
              },
            }
          );
        } else {
          await Working_Hours.create({
            start_time: "00:00:00",
            end_time: end_time_new,
            comments,
            userIdUser: userIdUser || user.id_user,
            calendarIdCalendar: calendar.id_calendar,
            changesByUserID,
            workflowTimeTypeIdWorkflowTimeType: 2,
          });

          let date = `${year}-${month}-${day}`;
          let dateCurrent = new Date(date);
          let date_1 = new Date(dateCurrent - 1);

          const calendarPast = await Calendar.findOne({
            where: { date: `${date_1.getFullYear()}-${date_1.getMonth() + 1}-${date_1.getDate()}` },
          });

          const workingHoursLastPast = await Working_Hours.findOne({
            order: Sequelize.fn("max", Sequelize.Op.col("id_working_hours")),
            where: {
              userIdUser: user.id_user,
              calendarIdCalendar: calendarPast.id_calendar,
              end_time: null,
            },
          });

          if (workingHoursLastPast) {
            await Working_Hours.update(
              {
                end_time: '23:59:59',
              },
              {
                where: {
                  id_working_hours: workingHoursLastPast.id_working_hours,
                },
              }
            );

            let underworking = JSON.parse(
              JSON.stringify(
                await Underworking.findOne({
                  where: {
                    userIdUser: user.id_user,
                    calendarIdCalendar: calendarPast.id_calendar,
                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                  },
                })
              )
            );
            let reworking = JSON.parse(
              JSON.stringify(
                await Reworking.findOne({
                  where: {
                    userIdUser: user.id_user,
                    calendarIdCalendar: calendarPast.id_calendar,
                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                  },
                })
              )
            );
            let workingTimes = JSON.parse(
              JSON.stringify(
                await Working_Hours.findAll({
                  where: {
                    userIdUser: user.id_user,
                    calendarIdCalendar: calendarPast.id_calendar,
                  },
                })
              )
            );
            const convertTime = (time) => {
              if (time === null) return 0;
              const timeArr = time.split(":");
              const newTime = +timeArr[0] * 60 + +timeArr[1];
              return newTime;
            };
    
            function sumTime(a, b) {
              if (a === null || b === null) return 0;
              let time = a + b;
              return time;
            }
    
            function raznTime(b, a) {
              if (a === null || b === null) return 0;
              let time = b - a;
              return time;
            }
    
            function timeConvert(time) {
              return `${Math.floor(time / 60)}:${
                time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
              }`;
            }
    
            let timeInterval = 0,
              reworkingsTimes = 0,
              underworkingsTimes = 0;
            let dayHours = convertTime(process.env.TIME_WORKING_HOURS_8);
            let startDayTime = convertTime(process.env.TIME_WORKING_HOURS_START);
            let endDayTime = convertTime(process.env.TIME_WORKING_HOURS_END);
            let startLunchTime = convertTime(process.env.TIME_LUNCH_TIME_START);
            let endLunchTime = convertTime(process.env.TIME_LUNCH_TIME_END);
    
            workingTimes.forEach((el) => {
              let s = convertTime(el.start_time),
                e = convertTime(el.end_time);
    
              if (s >= startDayTime && e <= endDayTime) {
                if (s <= startLunchTime && e >= endLunchTime) {
                  timeInterval = sumTime(
                    raznTime(
                      raznTime(e, s),
                      raznTime(endLunchTime, startLunchTime)
                    ),
                    timeInterval
                  );
                } else if (s >= startLunchTime && s < endLunchTime) {
                  timeInterval = sumTime(raznTime(e, endLunchTime), timeInterval);
                } else if (e > startLunchTime && e <= endLunchTime) {
                  timeInterval = sumTime(raznTime(startLunchTime, e), timeInterval);
                }
              } else if (e > endDayTime && s < startDayTime) {
                reworkingsTimes = sumTime(
                  sumTime(raznTime(startDayTime, s), raznTime(e, endDayTime)),
                  reworkingsTimes
                );
                timeInterval = dayHours;
              } else if (e <= startDayTime || s >= endDayTime) {
                reworkingsTimes = sumTime(raznTime(e, s), reworkingsTimes);
              } else if (e > startDayTime && s < startDayTime) {
                if (e >= endLunchTime) {
                  timeInterval = sumTime(
                    sumTime(
                      raznTime(e, startDayTime),
                      raznTime(endLunchTime, startLunchTime)
                    ),
                    timeInterval
                  );
                  reworkingsTimes = sumTime(
                    raznTime(startDayTime, s),
                    reworkingsTimes
                  );
                } else if (e > startLunchTime && e <= endLunchTime) {
                  timeInterval = sumTime(
                    raznTime(startLunchTime, startDayTime),
                    timeInterval
                  );
                  reworkingsTimes = sumTime(
                    raznTime(startDayTime, s),
                    reworkingsTimes
                  );
                } else {
                  timeInterval = sumTime(raznTime(e, startDayTime), timeInterval);
                  reworkingsTimes = sumTime(
                    raznTime(startDayTime, s),
                    reworkingsTimes
                  );
                }
              } else if (e > endDayTime && s < endDayTime) {
                if (s >= startLunchTime && s < endLunchTime) {
                  timeInterval = sumTime(
                    raznTime(endLunchTime, endDayTime),
                    timeInterval
                  );
                  reworkingsTimes = sumTime(
                    raznTime(e, endDayTime),
                    reworkingsTimes
                  );
                } else if (s < startLunchTime) {
                  timeInterval = sumTime(
                    raznTime(
                      raznTime(endDayTime, s),
                      raznTime(endLunchTime, startLunchTime)
                    ),
                    timeInterval
                  );
                  reworkingsTimes = sumTime(
                    raznTime(e, endDayTime),
                    reworkingsTimes
                  );
                } else {
                  timeInterval = sumTime(raznTime(endDayTime, s), timeInterval);
                  reworkingsTimes = sumTime(
                    raznTime(e, endDayTime),
                    reworkingsTimes
                  );
                }
              }
            });
    
            underworkingsTimes = raznTime(dayHours, timeInterval);
    
            if (reworkingsTimes != 0) {
              if (reworking) {
                await Reworking.update(
                  {
                    time_reworking: timeConvert(reworkingsTimes),
                  },
                  {
                    where: {
                      id_reworking: reworking.id_reworking,
                    },
                  }
                );
              } else {
                await Reworking.create({
                  time_reworking: timeConvert(reworkingsTimes),
                  userIdUser: user.id_user,
                  calendarIdCalendar: calendar.id_calendar,
                  typeOverUnderWorkIdTypeOverUnderWork: 1,
                });
              }
            } else if (reworkingsTimes == 0) {
              if (reworking) {
                await Reworking.destroy({
                  where: {
                    id_reworking: reworking.id_reworking,
                  },
                });
              }
            } else if (underworkingsTimes != 0) {
              if (underworking) {
                await Underworking.update(
                  {
                    time_underworking: timeConvert(underworkingsTimes),
                  },
                  {
                    where: {
                      id_inderworking: underworking.id_inderworking,
                    },
                  }
                );
              } else {
                await Underworking.create({
                  time_underworking: timeConvert(underworkingsTimes),
                  userIdUser: user.id_user,
                  calendarIdCalendar: calendar.id_calendar,
                  typeOverUnderWorkIdTypeOverUnderWork: 1,
                });
              }
            } else if (underworkingsTimes == 0) {
              if (underworking) {
                await Underworking.destroy({
                  where: {
                    id_inderworking: underworking.id_inderworking,
                  },
                });
              }
            }

          }

        }

        let underworking = JSON.parse(
          JSON.stringify(
            await Underworking.findOne({
              where: {
                userIdUser: user.id_user,
                calendarIdCalendar: calendar.id_calendar,
                typeOverUnderWorkIdTypeOverUnderWork: 1,
              },
            })
          )
        );
        let reworking = JSON.parse(
          JSON.stringify(
            await Reworking.findOne({
              where: {
                userIdUser: user.id_user,
                calendarIdCalendar: calendar.id_calendar,
                typeOverUnderWorkIdTypeOverUnderWork: 1,
              },
            })
          )
        );
        let workingTimes = JSON.parse(
          JSON.stringify(
            await Working_Hours.findAll({
              where: {
                userIdUser: user.id_user,
                calendarIdCalendar: calendar.id_calendar,
              },
            })
          )
        );
        const convertTime = (time) => {
          if (time === null) return 0;
          const timeArr = time.split(":");
          const newTime = +timeArr[0] * 60 + +timeArr[1];
          return newTime;
        };

        function sumTime(a, b) {
          if (a === null || b === null) return 0;
          let time = a + b;
          return time;
        }

        function raznTime(b, a) {
          if (a === null || b === null) return 0;
          let time = b - a;
          return time;
        }

        function timeConvert(time) {
          return `${Math.floor(time / 60)}:${
            time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
          }`;
        }

        let timeInterval = 0,
          reworkingsTimes = 0,
          underworkingsTimes = 0;
        let dayHours = convertTime(process.env.TIME_WORKING_HOURS_8);
        let startDayTime = convertTime(process.env.TIME_WORKING_HOURS_START);
        let endDayTime = convertTime(process.env.TIME_WORKING_HOURS_END);
        let startLunchTime = convertTime(process.env.TIME_LUNCH_TIME_START);
        let endLunchTime = convertTime(process.env.TIME_LUNCH_TIME_END);

        workingTimes.forEach((el) => {
          let s = convertTime(el.start_time),
            e = convertTime(el.end_time);

          if (s >= startDayTime && e <= endDayTime) {
            if (s <= startLunchTime && e >= endLunchTime) {
              timeInterval = sumTime(
                raznTime(
                  raznTime(e, s),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
            } else if (s >= startLunchTime && s < endLunchTime) {
              timeInterval = sumTime(raznTime(e, endLunchTime), timeInterval);
            } else if (e > startLunchTime && e <= endLunchTime) {
              timeInterval = sumTime(raznTime(startLunchTime, e), timeInterval);
            }
          } else if (e > endDayTime && s < startDayTime) {
            reworkingsTimes = sumTime(
              sumTime(raznTime(startDayTime, s), raznTime(e, endDayTime)),
              reworkingsTimes
            );
            timeInterval = dayHours;
          } else if (e <= startDayTime || s >= endDayTime) {
            reworkingsTimes = sumTime(raznTime(e, s), reworkingsTimes);
          } else if (e > startDayTime && s < startDayTime) {
            if (e >= endLunchTime) {
              timeInterval = sumTime(
                sumTime(
                  raznTime(e, startDayTime),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            } else if (e > startLunchTime && e <= endLunchTime) {
              timeInterval = sumTime(
                raznTime(startLunchTime, startDayTime),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            } else {
              timeInterval = sumTime(raznTime(e, startDayTime), timeInterval);
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            }
          } else if (e > endDayTime && s < endDayTime) {
            if (s >= startLunchTime && s < endLunchTime) {
              timeInterval = sumTime(
                raznTime(endLunchTime, endDayTime),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            } else if (s < startLunchTime) {
              timeInterval = sumTime(
                raznTime(
                  raznTime(endDayTime, s),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            } else {
              timeInterval = sumTime(raznTime(endDayTime, s), timeInterval);
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            }
          }
        });

        underworkingsTimes = raznTime(dayHours, timeInterval);

        if (reworkingsTimes != 0) {
          if (reworking) {
            await Reworking.update(
              {
                time_reworking: timeConvert(reworkingsTimes),
              },
              {
                where: {
                  id_reworking: reworking.id_reworking,
                },
              }
            );
          } else {
            await Reworking.create({
              time_reworking: timeConvert(reworkingsTimes),
              userIdUser: user.id_user,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
          }
        } else if (reworkingsTimes == 0) {
          if (reworking) {
            await Reworking.destroy({
              where: {
                id_reworking: reworking.id_reworking,
              },
            });
          }
        } else if (underworkingsTimes != 0) {
          if (underworking) {
            await Underworking.update(
              {
                time_underworking: timeConvert(underworkingsTimes),
              },
              {
                where: {
                  id_inderworking: underworking.id_inderworking,
                },
              }
            );
          } else {
            await Underworking.create({
              time_underworking: timeConvert(underworkingsTimes),
              userIdUser: user.id_user,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
          }
        } else if (underworkingsTimes == 0) {
          if (underworking) {
            await Underworking.destroy({
              where: {
                id_inderworking: underworking.id_inderworking,
              },
            });
          }
        }
        return res.json();
      } catch (error) {
        console.log(error);
        return res.status(500).send("Ошибка обновления рабочего времени");
      }
    } else {
      try {
        let start_old = start_time_old;
        let end_old = end_time_old;
        if (start_time_old == "--:--") start_old = null;
        if (end_time_old == "--:--") end_old = null;
        const calendar = await Calendar.findOne({
          where: { date: `${year}-${month}-${day}` },
        });
        const workingHours = await Working_Hours.update(
          {
            start_time: start_time_new,
            end_time: end_time_new,
            comments,
            changesByUserID,
            workflowTimeTypeIdWorkflowTimeType,
          },
          {
            where: {
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              start_time: start_old,
              end_time: end_old,
            },
          }
        );

        let underworking = JSON.parse(
          JSON.stringify(
            await Underworking.findOne({
              where: {
                userIdUser: userIdUser,
                calendarIdCalendar: calendar.id_calendar,
                typeOverUnderWorkIdTypeOverUnderWork: 1,
              },
            })
          )
        );
        let reworking = JSON.parse(
          JSON.stringify(
            await Reworking.findOne({
              where: {
                userIdUser: userIdUser,
                calendarIdCalendar: calendar.id_calendar,
                typeOverUnderWorkIdTypeOverUnderWork: 1,
              },
            })
          )
        );
        let workingTimes = JSON.parse(
          JSON.stringify(
            await Working_Hours.findAll({
              where: {
                userIdUser: userIdUser,
                calendarIdCalendar: calendar.id_calendar,
              },
            })
          )
        );
        const convertTime = (time) => {
          if (time === null) return 0;
          const timeArr = time.split(":");
          const newTime = +timeArr[0] * 60 + +timeArr[1];
          return newTime;
        };

        function sumTime(a, b) {
          if (a === null || b === null) return 0;
          let time = a + b;
          return time;
        }

        function raznTime(b, a) {
          if (a === null || b === null) return 0;
          let time = b - a;
          return time;
        }

        function timeConvert(time) {
          return `${Math.floor(time / 60)}:${
            time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
          }`;
        }

        let timeInterval = 0,
          reworkingsTimes = 0,
          underworkingsTimes = 0;
        let dayHours = convertTime(process.env.TIME_WORKING_HOURS_8);
        let startDayTime = convertTime(process.env.TIME_WORKING_HOURS_START);
        let endDayTime = convertTime(process.env.TIME_WORKING_HOURS_END);
        let startLunchTime = convertTime(process.env.TIME_LUNCH_TIME_START);
        let endLunchTime = convertTime(process.env.TIME_LUNCH_TIME_END);

        workingTimes.forEach((el) => {
          let s = convertTime(el.start_time),
            e = convertTime(el.end_time);

          if (s >= startDayTime && e <= endDayTime) {
            if (s <= startLunchTime && e >= endLunchTime) {
              timeInterval = sumTime(
                raznTime(
                  raznTime(e, s),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
            } else if (s >= startLunchTime && s < endLunchTime) {
              timeInterval = sumTime(raznTime(e, endLunchTime), timeInterval);
            } else if (e > startLunchTime && e <= endLunchTime) {
              timeInterval = sumTime(raznTime(startLunchTime, e), timeInterval);
            }
          } else if (e > endDayTime && s < startDayTime) {
            reworkingsTimes = sumTime(
              sumTime(raznTime(startDayTime, s), raznTime(e, endDayTime)),
              reworkingsTimes
            );
            timeInterval = dayHours;
          } else if (e <= startDayTime || s >= endDayTime) {
            reworkingsTimes = sumTime(raznTime(e, s), reworkingsTimes);
          } else if (e > startDayTime && s < startDayTime) {
            if (e >= endLunchTime) {
              timeInterval = sumTime(
                sumTime(
                  raznTime(e, startDayTime),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            } else if (e > startLunchTime && e <= endLunchTime) {
              timeInterval = sumTime(
                raznTime(startLunchTime, startDayTime),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            } else {
              timeInterval = sumTime(raznTime(e, startDayTime), timeInterval);
              reworkingsTimes = sumTime(
                raznTime(startDayTime, s),
                reworkingsTimes
              );
            }
          } else if (e > endDayTime && s < endDayTime) {
            if (s >= startLunchTime && s < endLunchTime) {
              timeInterval = sumTime(
                raznTime(endLunchTime, endDayTime),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            } else if (s < startLunchTime) {
              timeInterval = sumTime(
                raznTime(
                  raznTime(endDayTime, s),
                  raznTime(endLunchTime, startLunchTime)
                ),
                timeInterval
              );
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            } else {
              timeInterval = sumTime(raznTime(endDayTime, s), timeInterval);
              reworkingsTimes = sumTime(
                raznTime(e, endDayTime),
                reworkingsTimes
              );
            }
          }
        });

        underworkingsTimes = raznTime(dayHours, timeInterval);

        if (reworkingsTimes != 0) {
          if (reworking) {
            await Reworking.update(
              {
                time_reworking: timeConvert(reworkingsTimes),
              },
              {
                where: {
                  id_reworking: reworking.id_reworking,
                },
              }
            );
          } else {
            await Reworking.create({
              time_reworking: timeConvert(reworkingsTimes),
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
          }
        } else if (reworkingsTimes == 0) {
          if (reworking) {
            await Reworking.destroy({
              where: {
                id_reworking: reworking.id_reworking,
              },
            });
          }
        } else if (underworkingsTimes != 0) {
          if (underworking) {
            await Underworking.update(
              {
                time_underworking: timeConvert(underworkingsTimes),
              },
              {
                where: {
                  id_inderworking: underworking.id_inderworking,
                },
              }
            );
          } else {
            await Underworking.create({
              time_underworking: timeConvert(underworkingsTimes),
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            });
          }
        } else if (underworkingsTimes == 0) {
          if (underworking) {
            await Underworking.destroy({
              where: {
                id_inderworking: underworking.id_inderworking,
              },
            });
          }
        }

        return res.json(workingHours);
      } catch (error) {
        console.log(error);
        return res.status(500).send("Ошибка обновления рабочего времени");
      }
    }
  }

  async deleteWorkingHours(req, res) {
    //const { date } = req.params;
    const year = req.params.year;
    const month = req.params.month;
    const day = req.params.day;
    const {
      start_time_old,
      end_time_old,
      userIdUser,
      comments,
      changesByUserID,
    } = req.body;

    try {
      const calendar = await Calendar.findOne({
        where: { date: `${year}-${month}-${day}` },
      });

      const workingHours = await Working_Hours.update(
        {
          start_time: null,
          end_time: null,
          comments,
          changesByUserID,
          //workflowTimeTypeIdWorkflowTimeType: 1,
        },
        {
          where: {
            userIdUser: userIdUser,
            calendarIdCalendar: calendar.id_calendar,
            start_time: start_time_old,
            end_time: end_time_old,
          },
        }
      );

      let underworking = JSON.parse(
        JSON.stringify(
          await Underworking.findOne({
            where: {
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            },
          })
        )
      );
      let reworking = JSON.parse(
        JSON.stringify(
          await Reworking.findOne({
            where: {
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
              typeOverUnderWorkIdTypeOverUnderWork: 1,
            },
          })
        )
      );

      let workingTimes = JSON.parse(
        JSON.stringify(
          await Working_Hours.findAll({
            where: {
              userIdUser: userIdUser,
              calendarIdCalendar: calendar.id_calendar,
            },
          })
        )
      );

      const convertTime = (time) => {
        if (time === null) return 0;
        const timeArr = time.split(":");
        const newTime = +timeArr[0] * 60 + +timeArr[1];
        return newTime;
      };

      function sumTime(a, b) {
        if (a === null || b === null) return 0;
        let time = a + b;
        return time;
      }

      function raznTime(b, a) {
        if (a === null || b === null) return 0;
        let time = b - a;
        return time;
      }

      function timeConvert(time) {
        return `${Math.floor(time / 60)}:${
          time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
        }`;
      }

      let timeInterval = 0,
        reworkingsTimes = 0,
        underworkingsTimes = 0;
      let dayHours = convertTime(process.env.TIME_WORKING_HOURS_8);
      let startDayTime = convertTime(process.env.TIME_WORKING_HOURS_START);
      let endDayTime = convertTime(process.env.TIME_WORKING_HOURS_END);
      let startLunchTime = convertTime(process.env.TIME_LUNCH_TIME_START);
      let endLunchTime = convertTime(process.env.TIME_LUNCH_TIME_END);

      workingTimes.forEach((el) => {
        let s = convertTime(el.start_time),
          e = convertTime(el.end_time);

        if (s >= startDayTime && e <= endDayTime) {
          if (s <= startLunchTime && e >= endLunchTime) {
            timeInterval = sumTime(
              raznTime(raznTime(e, s), raznTime(endLunchTime, startLunchTime)),
              timeInterval
            );
          } else if (s >= startLunchTime && s < endLunchTime) {
            timeInterval = sumTime(raznTime(e, endLunchTime), timeInterval);
          } else if (e > startLunchTime && e <= endLunchTime) {
            timeInterval = sumTime(raznTime(startLunchTime, e), timeInterval);
          }
        } else if (e > endDayTime && s < startDayTime) {
          reworkingsTimes = sumTime(
            sumTime(raznTime(startDayTime, s), raznTime(e, endDayTime)),
            reworkingsTimes
          );
          timeInterval = dayHours;
        } else if (e <= startDayTime || s >= endDayTime) {
          reworkingsTimes = sumTime(raznTime(e, s), reworkingsTimes);
        } else if (e > startDayTime && s < startDayTime) {
          if (e >= endLunchTime) {
            timeInterval = sumTime(
              sumTime(
                raznTime(e, startDayTime),
                raznTime(endLunchTime, startLunchTime)
              ),
              timeInterval
            );
            reworkingsTimes = sumTime(
              raznTime(startDayTime, s),
              reworkingsTimes
            );
          } else if (e > startLunchTime && e <= endLunchTime) {
            timeInterval = sumTime(
              raznTime(startLunchTime, startDayTime),
              timeInterval
            );
            reworkingsTimes = sumTime(
              raznTime(startDayTime, s),
              reworkingsTimes
            );
          } else {
            timeInterval = sumTime(raznTime(e, startDayTime), timeInterval);
            reworkingsTimes = sumTime(
              raznTime(startDayTime, s),
              reworkingsTimes
            );
          }
        } else if (e > endDayTime && s < endDayTime) {
          if (s >= startLunchTime && s < endLunchTime) {
            timeInterval = sumTime(
              raznTime(endLunchTime, endDayTime),
              timeInterval
            );
            reworkingsTimes = sumTime(raznTime(e, endDayTime), reworkingsTimes);
          } else if (s < startLunchTime) {
            timeInterval = sumTime(
              raznTime(
                raznTime(endDayTime, s),
                raznTime(endLunchTime, startLunchTime)
              ),
              timeInterval
            );
            reworkingsTimes = sumTime(raznTime(e, endDayTime), reworkingsTimes);
          } else {
            timeInterval = sumTime(raznTime(endDayTime, s), timeInterval);
            reworkingsTimes = sumTime(raznTime(e, endDayTime), reworkingsTimes);
          }
        }
      });

      underworkingsTimes = raznTime(dayHours, timeInterval);

      if (reworkingsTimes != 0) {
        if (reworking) {
          await Reworking.update(
            {
              time_reworking: timeConvert(reworkingsTimes),
            },
            {
              where: {
                id_reworking: reworking.id_reworking,
              },
            }
          );
        } else {
          await Reworking.create({
            time_reworking: timeConvert(reworkingsTimes),
            userIdUser: userIdUser,
            calendarIdCalendar: calendar.id_calendar,
            typeOverUnderWorkIdTypeOverUnderWork: 1,
          });
        }
      } else if (reworkingsTimes == 0) {
        if (reworking) {
          await Reworking.destroy({
            where: {
              id_reworking: reworking.id_reworking,
            },
          });
        }
      } else if (underworkingsTimes != 0) {
        if (underworking) {
          await Underworking.update(
            {
              time_underworking: timeConvert(underworkingsTimes),
            },
            {
              where: {
                id_inderworking: underworking.id_inderworking,
              },
            }
          );
        } else {
          await Underworking.create({
            time_underworking: timeConvert(underworkingsTimes),
            userIdUser: userIdUser,
            calendarIdCalendar: calendar.id_calendar,
            typeOverUnderWorkIdTypeOverUnderWork: 1,
          });
        }
      } else if (underworkingsTimes == 0) {
        if (underworking) {
          await Underworking.destroy({
            where: {
              id_inderworking: underworking.id_inderworking,
            },
          });
        }
      }

      return res.json(workingHours);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления рабочего времени");
    }
  }
}

module.exports = new WorkingHoursController();
