import React, { useState } from "react";
import {
    createReworking,
    createUnderworking,
    createWorkingHours,
} from "../../http/workWithTable/workTableAPI";
import { useSelector } from "react-redux";
import {
    selectorCurrentEmployee,
    selectorDepartaments,
    selectorEmployees,
} from "../../assets/store/slices/employeesSlice";
import { selectorUserRole } from "../../assets/store/slices/userSlice";

export default function ModalWindowAdd({
    title,
    onChange,
    modalRef,
    interval,
}) {
    const currentEmp = useSelector(selectorCurrentEmployee);
    const employee = useSelector(
        typeof currentEmp === "object"
            ? selectorDepartaments
            : selectorEmployees
    );
    const user = useSelector((state) => state.user);
    const role = useSelector(selectorUserRole);
    const [date, setDate] = useState(null);
    const [valueStartTime, setValueStartTime] = useState(
        interval ? interval.start : "00:00"
    );
    const [valueEndTime, setValueEndTime] = useState(
        interval ? interval.end : "00:00"
    );
    const [coment, setComent] = useState("");
    const dates = useSelector((state) => state.employees?.userData[0]);
    const convertTimeInMinutes = (time) => {
        const t = time.split(":");
        return +t[0] * 60 + +t[1];
    };
    const checkInterval = (start, end) => {
        if (
            convertTimeInMinutes(end) < convertTimeInMinutes(start) ||
            convertTimeInMinutes(end) === convertTimeInMinutes(start)
        ) {
            console.log("FALSE");
            return false;
        }
        const intervals = dates.find((dat) => dat.date === date).worked_time;

        const flag = intervals
            .map(
                (int) =>
                    convertTimeInMinutes(end) <=
                        convertTimeInMinutes(int.start) ||
                    convertTimeInMinutes(start) >= convertTimeInMinutes(int.end)
            )
            .reduce((acc, val) => acc * val, 1);
        return flag;
    };
    return (
        <div className="modal-window" ref={modalRef}>
            <div className="modal-content">
                <p className="title">{title}</p>
                <input
                    type="date"
                    max={"2050-12-31"}
                    onChange={(e) => setDate(e.target.value)}
                />

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
                            if (!valueEndTime || !coment || !date) {
                                alert("Заполните поля!");
                            } else if (title.includes("переработки")) {
                                await createReworking({
                                    time_reworking: valueEndTime,
                                    comments: coment,
                                    userIdUser: role
                                        ? typeof currentEmp === "object"
                                            ? employee[currentEmp.dep]?.users[
                                                  currentEmp.user
                                              ].id_user
                                            : employee[currentEmp].id_user
                                        : user.userData.id_user,
                                    date: date,
                                    typeOverUnderWorkIdTypeOverUnderWork: 2,
                                });
                                onChange(false);
                            } else {
                                await createUnderworking({
                                    time_underworking: valueEndTime,
                                    comments: coment,
                                    userIdUser: role
                                        ? typeof currentEmp === "object"
                                            ? employee[currentEmp.dep]?.users[
                                                  currentEmp.user
                                              ].id_user
                                            : employee[currentEmp].id_user
                                        : user.userData.id_user,
                                    date: date,
                                    typeOverUnderWorkIdTypeOverUnderWork: 2,
                                });
                                onChange(false);
                            }
                        } else {
                            if (
                                !valueStartTime ||
                                !valueEndTime ||
                                !coment ||
                                !date
                            ) {
                                alert("Заполните поля!");
                            } else {
                                if (
                                    checkInterval(valueStartTime, valueEndTime)
                                ) {
                                    await createWorkingHours({
                                        start_time: valueStartTime,
                                        end_time: valueEndTime,
                                        comments: coment,
                                        userIdUser: role
                                            ? typeof currentEmp === "object"
                                                ? employee[currentEmp.dep]
                                                      ?.users[currentEmp.user]
                                                      .id_user
                                                : employee[currentEmp].id_user
                                            : user.userData.id_user,
                                        date: date,
                                        changesByUserID: user.userData.id_user,
                                        workflowTimeTypeIdWorkflowTimeType: 2,
                                    });
                                    onChange(false);
                                } else alert("Проверьте интервал времени");
                            }
                        }
                    }}
                >
                    Добавить
                </div>
            </div>
        </div>
    );
}
