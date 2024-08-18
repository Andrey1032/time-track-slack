import React, { useState } from "react";
import {
    createWrittenOffTime,
    deleteWorkingHours,
    updateWorkingHours,
} from "../../http/workWithTable/workTableAPI";
import { useSelector } from "react-redux";
import {
    selectorCalendarData,
    selectorCurrentEmployee,
    selectorDepartaments,
    selectorEmployees,
} from "../../assets/store/slices/employeesSlice";
import {
    selectorIdUser,
    selectorUserRole,
} from "../../assets/store/slices/userSlice";
export default function ModalWindowEdit({
    title,
    onChange,
    modalRef,
    interval,
    time,
    date,
    id,
}) {
    const [valueStartTime, setValueStartTime] = useState(
        interval ? interval.start : time
    );
    const [valueEndTime, setValueEndTime] = useState(
        interval ? interval.end : time
    );
    const [coment, setComent] = useState("");
    const calendarData = useSelector(selectorCalendarData);
    const currentEmp = useSelector(selectorCurrentEmployee);
    const employee = useSelector(
        typeof currentEmp === "object"
            ? selectorDepartaments
            : selectorEmployees
    );
    const userId = useSelector(selectorIdUser);
    const user = useSelector((state) => state.user);
    const role = useSelector(selectorUserRole);
    const intervals = useSelector((state) =>
        interval
            ? state.employees?.userData[0][id.id_date]?.worked_time
            : state.employees
    );
    const convertTimeInMinutes = (time) => {
        const t = time.split(":");
        return +t[0] * 60 + +t[1];
    };
    const checkInterval = (start, end) => {
        if (convertTimeInMinutes(end) < convertTimeInMinutes(start))
            return false;
        console.log(start, end, intervals);
        const flag = intervals.map((int, int_id) =>
            int_id !== id.id_time
                ? convertTimeInMinutes(end) <=
                      convertTimeInMinutes(int.start) ||
                  convertTimeInMinutes(start) >= convertTimeInMinutes(int.end)
                : true
        );
        console.log(flag);
        return flag.reduce((acc, val) => acc * val, 1);
    };
    return (
        <div className="modal-window" ref={modalRef}>
            <div className="modal-content">
                <p className="title">{title}</p>

                <div className="inputs-time">
                    {interval && (
                        <>
                            C
                            <input
                                type="time"
                                value={valueStartTime}
                                onChange={(e) =>
                                    setValueStartTime(e.target.value)
                                }
                            />
                            до
                        </>
                    )}
                    <input
                        type="time"
                        value={valueEndTime}
                        onChange={(e) => setValueEndTime(e.target.value)}
                    />
                </div>
                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={coment}
                        onChange={(e) => setComent(e.target.value)}
                    />
                    <label className="form__label">Комментарий</label>
                </div>
            </div>
            <div className="modal-buttons">
                {interval && (
                    <div
                        className="modal-button-1"
                        onClick={async () => {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Уверены что хотите удалить?")) {
                                await deleteWorkingHours({
                                    params: {
                                        year: date[0],
                                        month: date[1],
                                        day: date[2],
                                    },
                                    body: {
                                        start_time_old: interval.start,
                                        end_time_old: interval.end,
                                        comments: coment,
                                        userIdUser: role
                                            ? typeof currentEmp === "object"
                                                ? employee[currentEmp.dep]
                                                      ?.users[currentEmp.user]
                                                      .id_user
                                                : employee[currentEmp].id_user
                                            : user.userData.id_user,
                                        writingByUserID: role
                                            ? userId
                                            : user.userData.id_user,
                                    },
                                });
                                onChange(false);
                            }
                        }}
                    >
                        Удалить
                    </div>
                )}
                <div
                    className="modal-button-2"
                    onClick={() => {
                        onChange(false);
                    }}
                >
                    Отмена
                </div>
                <div
                    className="modal-button-3"
                    onClick={async () => {
                        if (!interval) {
                            await createWrittenOffTime({
                                month:
                                    Number(calendarData.month) > 1
                                        ? Number(calendarData.month) - 1
                                        : 12,
                                year:
                                    Number(calendarData.month) > 1
                                        ? Number(calendarData.year)
                                        : Number(calendarData.year) - 1,
                                old_value: time,
                                new_value: valueEndTime,
                                comments: coment,
                                userIdUser: role
                                    ? typeof currentEmp === "object"
                                        ? employee[currentEmp.dep]?.users[
                                              currentEmp.user
                                          ].id_user
                                        : employee[currentEmp].id_user
                                    : user.userData.id_user,
                                writingByUserID: role
                                    ? userId
                                    : user.userData.id_user,
                                typeOfWorkIdTypeOfWork: title.includes(
                                    "отработки"
                                )
                                    ? 1
                                    : 2,
                            });
                            onChange(false);
                        } else {
                            if (checkInterval(valueStartTime, valueEndTime)) {
                                await updateWorkingHours({
                                    params: {
                                        year: date[0],
                                        month: date[1],
                                        day: date[2],
                                    },
                                    body: {
                                        start_time_old: interval.start,
                                        end_time_old: interval.end,
                                        start_time_new: valueStartTime,
                                        end_time_new: valueEndTime,
                                        comments: coment,
                                        userIdUser: role
                                            ? typeof currentEmp === "object"
                                                ? employee[currentEmp.dep]
                                                      ?.users[currentEmp.user]
                                                      .id_user
                                                : employee[currentEmp].id_user
                                            : user.userData.id_user,
                                        writingByUserID: role
                                            ? userId
                                            : user.userData.id_user,
                                        workflowTimeTypeIdWorkflowTimeType: 2,
                                    },
                                });
                                onChange(false);
                            } else alert(`Проверьте интервал времени!`);
                        }
                    }}
                >
                    Сохранить
                </div>
            </div>
        </div>
    );
}
