import React, { useCallback, useEffect, useState } from "react";
import { months, weeks } from "../../assets/temp/data";

export default function AppCalendar({ calendar }) {
    const getDayMonth = useCallback(
        (index_month) => {
            const d = [7, 1, 2, 3, 4, 5, 6][
                new Date(
                    `${calendar.year}-${calendar.months[index_month].month}-1`
                ).getDay()
            ];
            return d;
        },
        [calendar.months, calendar.year]
    );
    const [days, setDays] = useState(
        calendar.months.map((month, index_month) => ({
            dStart: Array(getDayMonth(index_month) - 1)
                .fill(0)
                .map(
                    (d, d_i) =>
                        new Date(
                            calendar.year,
                            calendar.months[
                                index_month > 1 ? index_month - 1 : index_month
                            ].month,
                            0
                        ).getDate() - d_i
                )
                .reverse(),
            d: Array(
                new Date(
                    calendar.year,
                    calendar.months[index_month].month,
                    0
                ).getDate()
            )
                .fill(0)
                .map((d, d_i) => d_i + 1),
            dEnd: Array(
                (getDayMonth(index_month) -
                    1 +
                    new Date(
                        calendar.year,
                        calendar.months[index_month].month,
                        0
                    ).getDate()) %
                    7 ===
                    0
                    ? 0
                    : getDayMonth(index_month) -
                          1 +
                          new Date(
                              calendar.year,
                              calendar.months[index_month].month,
                              0
                          ).getDate() >
                      35
                    ? 42 -
                      (getDayMonth(index_month) -
                          1 +
                          new Date(
                              calendar.year,
                              calendar.months[index_month].month,
                              0
                          ).getDate())
                    : 35 -
                      (getDayMonth(index_month) -
                          1 +
                          new Date(
                              calendar.year,
                              calendar.months[index_month].month,
                              0
                          ).getDate())
            )
                .fill(0)
                .map((d, d_i) => d_i + 1),
            days_chill: month.days.split(","),
        }))
    );
    useEffect(() => {
        setDays(
            calendar.months.map((month, index_month) => ({
                dStart: Array(getDayMonth(index_month) - 1)
                    .fill(0)
                    .map(
                        (d, d_i) =>
                            new Date(
                                calendar.year,
                                calendar.months[
                                    index_month > 1
                                        ? index_month - 1
                                        : index_month
                                ].month,
                                0
                            ).getDate() - d_i
                    )
                    .reverse(),
                d: Array(
                    new Date(
                        calendar.year,
                        calendar.months[index_month].month,
                        0
                    ).getDate()
                )
                    .fill(0)
                    .map((d, d_i) => d_i + 1),
                dEnd: Array(
                    (getDayMonth(index_month) -
                        1 +
                        new Date(
                            calendar.year,
                            calendar.months[index_month].month,
                            0
                        ).getDate()) %
                        7 ===
                        0
                        ? 0
                        : getDayMonth(index_month) -
                              1 +
                              new Date(
                                  calendar.year,
                                  calendar.months[index_month].month,
                                  0
                              ).getDate() >
                          35
                        ? 42 -
                          (getDayMonth(index_month) -
                              1 +
                              new Date(
                                  calendar.year,
                                  calendar.months[index_month].month,
                                  0
                              ).getDate())
                        : 35 -
                          (getDayMonth(index_month) -
                              1 +
                              new Date(
                                  calendar.year,
                                  calendar.months[index_month].month,
                                  0
                              ).getDate())
                )
                    .fill(0)
                    .map((d, d_i) => d_i + 1),
                days_chill: month.days.split(","),
            }))
        );
    }, [calendar, getDayMonth]);
    return (
        <div className="my-calendar">
            <p className="title">Календарь на {calendar.year} г.</p>
            {Array(3)
                .fill(0)
                .map((block, index_block) => (
                    <div key={index_block} className="cvartal">
                        {Array(4)
                            .fill(0)
                            .map((month, index_month) => (
                                <div key={index_month} className="month">
                                    <p className="name">
                                        {
                                            months[
                                                index_month + index_block * 4
                                            ].label
                                        }
                                    </p>
                                    <div className="week">
                                        {weeks?.map((week) => (
                                            <div key={week}>
                                                <p className="day_name">
                                                    {week}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="days">
                                        {days[
                                            index_month + index_block * 4
                                        ].dStart?.map((day) => (
                                            <div
                                                key={day}
                                                className={"day excess"}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                        {days[
                                            index_month + index_block * 4
                                        ].d?.map((day) => (
                                            <div
                                                key={day}
                                                className={
                                                    days[
                                                        index_month +
                                                            index_block * 4
                                                    ].days_chill.find(
                                                        (d) => +d === day
                                                    )
                                                        ? "day chill"
                                                        : "day"
                                                }
                                            >
                                                {day}
                                            </div>
                                        ))}
                                        {days[
                                            index_month + index_block * 4
                                        ].dEnd?.map((day) => (
                                            <div key={day} className={"day excess"}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
        </div>
    );
}
