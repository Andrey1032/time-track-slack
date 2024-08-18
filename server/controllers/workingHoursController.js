const { where } = require("sequelize");
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

                let timeInterval = 0;
                workingTimes.forEach((el) => {
                    timeInterval = sumTime(
                        raznTime(
                            convertTime(el.end_time),
                            convertTime(el.start_time)
                        ),
                        timeInterval
                    );
                });
                let opred = raznTime(8 * 60, timeInterval);

                                if (opred > 0) {
                                    if (reworking) {
                                        const rewDest = await Reworking.destroy(
                                            {
                                                where: {
                                                    userIdUser: userIdUser,
                                                    calendarIdCalendar:
                                                        calendar.id_calendar,
                                                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                                                },
                                            }
                                        );
                                        console.log("reworking");
                                    }
                                    if (underworking) {
                                        let underWork =
                                            await Underworking.update(
                                                {
                                                    time_underworking: `${Math.floor(
                                                        opred / 60
                                                    )}:${
                                                        opred % 60 < 10
                                                            ? `0${opred % 60}`
                                                            : `${opred % 60}`
                                                    }`,
                                                },
                                                {
                                                    where: {
                                                        userIdUser: userIdUser,
                                                        calendarIdCalendar:
                                                            calendar.id_calendar,
                                                        typeOverUnderWorkIdTypeOverUnderWork: 1,
                                                    },
                                                }
                                            );
                                        console.log("underworking");
                                    } else {
                                        const underworking =
                                            await Underworking.create({
                                                time_underworking: `${Math.floor(
                                                    opred / 60
                                                )}:${
                                                    opred % 60 < 10
                                                        ? `0${opred % 60}`
                                                        : `${opred % 60}`
                                                }`,
                                                userIdUser: userIdUser,
                                                calendarIdCalendar:
                                                    calendar.id_calendar,
                                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                                            });
                                        console.log("else");
                                    }
                                } else if (opred < 0) {
                                    opred = -opred;
                                    if (underworking) {
                                        const underDest =
                                            await Underworking.destroy({
                                                where: {
                                                    userIdUser: userIdUser,
                                                    calendarIdCalendar:
                                                        calendar.id_calendar,
                                                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                                                },
                                            });
                                    }
                                    if (reworking) {
                                        let reWork = await Reworking.update(
                                            {
                                                time_reworking: `${Math.floor(
                                                    opred / 60
                                                )}:${
                                                    opred % 60 < 10
                                                        ? `0${opred % 60}`
                                                        : `${opred % 60}:00`
                                                }`,
                                            },
                                            {
                                                where: {
                                                    id_reworking:
                                                        reworking.id_reworking,
                                                },
                                            }
                                        );
                                    } else {
                                        const reworking =
                                            await Reworking.create({
                                                time_reworking: `${Math.floor(
                                                    opred / 60
                                                )}:${
                                                    opred % 60 < 10
                                                        ? `0${opred % 60}`
                                                        : `${opred % 60}`
                                                }`,
                                                userIdUser: userIdUser,
                                                calendarIdCalendar:
                                                    calendar.id_calendar,
                                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                                            });
                                    }
                                } else if (opred === 0) {
                                    if (underworking) {
                                        const underDest =
                                            await Underworking.destroy({
                                                where: {
                                                    userIdUser: userIdUser,
                                                    calendarIdCalendar:
                                                        calendar.id_calendar,
                                                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                                                },
                                            });
                                    }
                                    if (reworking) {
                                        const rewDest = await Reworking.destroy(
                                            {
                                                where: {
                                                    userIdUser: userIdUser,
                                                    calendarIdCalendar:
                                                        calendar.id_calendar,
                                                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                                                },
                                            }
                                        );
                                        console.log("reworking");
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
                const workingHours = await Working_Hours.update(
                    {
                        end_time: end_time_new,
                    },
                    {
                        where: {
                            userIdUser: user.id_user,
                            calendarIdCalendar: calendar.id_calendar,
                            end_time: null,
                        },
                    }
                );
                const workingHoursGet = await Working_Hours.findOne({
                    where: {
                        userIdUser: user.id_user,
                        calendarIdCalendar: calendar.id_calendar,
                    },
                });
                let workedTime = JSON.parse(JSON.stringify(workingHoursGet));
                const convertTime = (time) => {
                    if (time === null) return 0;
                    const timeArr = time.split(":");
                    const newTime = +timeArr[0] * 60 + +timeArr[1];
                    return newTime;
                };
                if (workedTime.start_time && workedTime.end_time) {
                    let start = convertTime(workedTime.start_time);
                    let end = convertTime(workedTime.end_time);
                    let timeItog = end - start;
                    let difference = convertTime("08:00:00") - timeItog;
                    if (difference > 0) {
                        let differenceTime = `${Math.floor(difference / 60)}:${
                            difference % 60 < 10
                                ? `0${difference % 60}`
                                : `${difference % 60}`
                        }`;
                        const underworking = await Underworking.create({
                            time_underworking: differenceTime,
                            userIdUser: user.id_user,
                            calendarIdCalendar: calendar.id_calendar,
                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                        });
                    } else if (difference < 0) {
                        difference = -difference;
                        let differenceTime = `${Math.floor(difference / 60)}:${
                            difference % 60 < 10
                                ? `0${difference % 60}`
                                : `${difference % 60}`
                        }`;
                        const reworking = await Reworking.create({
                            time_reworking: differenceTime,
                            userIdUser: user.id_user,
                            calendarIdCalendar: calendar.id_calendar,
                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                        });
                    }
                }
                return res.json(workingHours);
            } catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .send("Ошибка обновления рабочего времени");
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

                let timeInterval = 0;
                workingTimes.forEach((el) => {
                    timeInterval = sumTime(
                        raznTime(
                            convertTime(el.end_time),
                            convertTime(el.start_time)
                        ),
                        timeInterval
                    );
                });

                let opred = raznTime(8 * 60, timeInterval);

                if (opred > 0) {
                    if (reworking) {
                        const rewDest = await Reworking.destroy({
                            where: {
                                userIdUser: userIdUser,
                                calendarIdCalendar: calendar.id_calendar,
                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                            },
                        });
                        console.log("reworking");
                    }
                    if (underworking) {
                        let underWork = await Underworking.update(
                            {
                                time_underworking: `${Math.floor(opred / 60)}:${
                                    opred % 60 < 10
                                        ? `0${opred % 60}`
                                        : `${opred % 60}`
                                }`,
                            },
                            {
                                where: {
                                    userIdUser: userIdUser,
                                    calendarIdCalendar: calendar.id_calendar,
                                    typeOverUnderWorkIdTypeOverUnderWork: 1,
                                },
                            }
                        );
                        console.log("underworking");
                    } else {
                        const underworking = await Underworking.create({
                            time_underworking: `${Math.floor(opred / 60)}:${
                                opred % 60 < 10
                                    ? `0${opred % 60}`
                                    : `${opred % 60}`
                            }`,
                            userIdUser: userIdUser,
                            calendarIdCalendar: calendar.id_calendar,
                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                        });
                        console.log("else");
                    }
                } else if (opred < 0) {
                    opred = -opred;
                    if (underworking) {
                        const underDest = await Underworking.destroy({
                            where: {
                                userIdUser: userIdUser,
                                calendarIdCalendar: calendar.id_calendar,
                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                            },
                        });
                    }
                    if (reworking) {
                        let reWork = await Reworking.update(
                            {
                                time_reworking: `${Math.floor(opred / 60)}:${
                                    opred % 60 < 10
                                        ? `0${opred % 60}`
                                        : `${opred % 60}:00`
                                }`,
                            },
                            {
                                where: {
                                    id_reworking: reworking.id_reworking,
                                },
                            }
                        );
                    } else {
                        const reworking = await Reworking.create({
                            time_reworking: `${Math.floor(opred / 60)}:${
                                opred % 60 < 10
                                    ? `0${opred % 60}`
                                    : `${opred % 60}`
                            }`,
                            userIdUser: userIdUser,
                            calendarIdCalendar: calendar.id_calendar,
                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                        });
                    }
                } else if (opred === 0) {
                    if (underworking) {
                        const underDest = await Underworking.destroy({
                            where: {
                                userIdUser: userIdUser,
                                calendarIdCalendar: calendar.id_calendar,
                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                            },
                        });
                    }
                    if (reworking) {
                        const rewDest = await Reworking.destroy({
                            where: {
                                userIdUser: userIdUser,
                                calendarIdCalendar: calendar.id_calendar,
                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                            },
                        });
                        console.log("reworking");
                    }
                }

                //res.status(200).send(workingTimes);

                return res.json(workingHours);
            } catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .send("Ошибка обновления рабочего времени");
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

            let timeInterval = 0;
            workingTimes.forEach((el) => {
                timeInterval = sumTime(
                    raznTime(
                        convertTime(el.end_time),
                        convertTime(el.start_time)
                    ),
                    timeInterval
                );
            });

            let opred = raznTime(8 * 60, timeInterval);

                            if (opred > 0) {
                                if (reworking) {
                                    const rewDest = await Reworking.destroy({
                                        where: {
                                            userIdUser: userIdUser,
                                            calendarIdCalendar:
                                                calendar.id_calendar,
                                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                                        },
                                    });
                                    console.log("reworking");
                                }
                                if (underworking) {
                                    let underWork = await Underworking.update(
                                        {
                                            time_underworking: `${Math.floor(
                                                opred / 60
                                            )}:${
                                                opred % 60 < 10
                                                    ? `0${opred % 60}`
                                                    : `${opred % 60}`
                                            }`,
                                        },
                                        {
                                            where: {
                                                userIdUser: userIdUser,
                                                calendarIdCalendar:
                                                    calendar.id_calendar,
                                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                                            },
                                        }
                                    );
                                    console.log("underworking");
                                } else {
                                    const underworking =
                                        await Underworking.create({
                                            time_underworking: `${Math.floor(
                                                opred / 60
                                            )}:${
                                                opred % 60 < 10
                                                    ? `0${opred % 60}`
                                                    : `${opred % 60}`
                                            }`,
                                            userIdUser: userIdUser,
                                            calendarIdCalendar:
                                                calendar.id_calendar,
                                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                                        });
                                    console.log("else");
                                }
                            } else if (opred < 0) {
                                opred = -opred;
                                if (underworking) {
                                    const underDest =
                                        await Underworking.destroy({
                                            where: {
                                                userIdUser: userIdUser,
                                                calendarIdCalendar:
                                                    calendar.id_calendar,
                                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                                            },
                                        });
                                }
                                if (reworking) {
                                    let reWork = await Reworking.update(
                                        {
                                            time_reworking: `${Math.floor(
                                                opred / 60
                                            )}:${
                                                opred % 60 < 10
                                                    ? `0${opred % 60}`
                                                    : `${opred % 60}:00`
                                            }`,
                                        },
                                        {
                                            where: {
                                                id_reworking:
                                                    reworking.id_reworking,
                                            },
                                        }
                                    );
                                } else {
                                    const reworking = await Reworking.create({
                                        time_reworking: `${Math.floor(
                                            opred / 60
                                        )}:${
                                            opred % 60 < 10
                                                ? `0${opred % 60}`
                                                : `${opred % 60}`
                                        }`,
                                        userIdUser: userIdUser,
                                        calendarIdCalendar:
                                            calendar.id_calendar,
                                        typeOverUnderWorkIdTypeOverUnderWork: 1,
                                    });
                                }
                            } else if (opred === 0) {
                                if (underworking) {
                                    const underDest =
                                        await Underworking.destroy({
                                            where: {
                                                userIdUser: userIdUser,
                                                calendarIdCalendar:
                                                    calendar.id_calendar,
                                                typeOverUnderWorkIdTypeOverUnderWork: 1,
                                            },
                                        });
                                }
                                if (reworking) {
                                    const rewDest = await Reworking.destroy({
                                        where: {
                                            userIdUser: userIdUser,
                                            calendarIdCalendar:
                                                calendar.id_calendar,
                                            typeOverUnderWorkIdTypeOverUnderWork: 1,
                                        },
                                    });
                                    console.log("reworking");
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
