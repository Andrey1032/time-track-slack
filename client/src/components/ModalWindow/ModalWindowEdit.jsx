import React from "react";
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
import { useForm } from "react-hook-form";
import { convertTimeInMinutes } from "../../assets/helpers";
export default function ModalWindowEdit({
    title,
    onChange,
    modalRef,
    interval,
    time,
    date,
    id,
}) {
    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            valueStartTime: interval ? interval.start : null,
            valueEndTime: interval ? interval.end : time,
            coment: "",
        },
    });

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

    const checkInterval = (start, end) => {
        if (convertTimeInMinutes(end) < convertTimeInMinutes(start))
            return false;
        const flag = intervals.map((int, int_id) =>
            int_id !== id.id_time
                ? convertTimeInMinutes(end) <=
                      convertTimeInMinutes(int.start) ||
                  convertTimeInMinutes(start) >= convertTimeInMinutes(int.end)
                : true
        );
        return flag.reduce((acc, val) => acc * val, 1);
    };

    const onSubmit = async (values) => {
        if (
            interval
                ? values.valueStartTime === interval.start &&
                  values.valueEndTime === interval.end
                : values.valueEndTime === time
        ) {
            return onChange(false);
        }
        if (values.coment !== "") {
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
                    old_value: time ? time : "00:00",
                    new_value: values.valueEndTime,
                    comments: values.coment,
                    userIdUser: role
                        ? typeof currentEmp === "object"
                            ? employee[currentEmp.dep]?.users[currentEmp.user]
                                  .id_user
                            : employee[currentEmp].id_user
                        : user.userData.id_user,
                    writingByUserID: role ? userId : user.userData.id_user,
                    typeOfWorkIdTypeOfWork: title.includes("отработки") ? 1 : 2,
                });
                onChange(false);
            } else {
                if (checkInterval(values.valueStartTime, values.valueEndTime)) {
                    await updateWorkingHours({
                        params: {
                            year: date[0],
                            month: date[1],
                            day: date[2],
                        },
                        body: {
                            start_time_old: interval.start,
                            end_time_old: interval.end,
                            start_time_new: values.valueStartTime,
                            end_time_new: values.valueEndTime,
                            comments: values.coment,
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
                            workflowTimeTypeIdWorkflowTimeType: 2,
                        },
                    });
                    onChange(false);
                } else alert(`Проверьте интервал времени!`);
            }
        } else alert("Проверьте наличие комментария!");
    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-window" ref={modalRef}>
                <div className="modal-content">
                    <p className="title">{title}</p>

                    <div className="inputs-time">
                        {interval && (
                            <>
                                C
                                <input
                                    type="time"
                                    {...register("valueStartTime")}
                                />
                                до
                            </>
                        )}
                        <input type="time" {...register("valueEndTime")} />
                    </div>
                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("coment")}
                        />
                        <label className="form__label">Комментарий</label>
                    </div>
                </div>
                <div className="modal-buttons">
                    {interval && (
                        <button
                            type="button"
                            className="modal-button-1"
                            onClick={async () => {
                                // eslint-disable-next-line no-restricted-globals
                                if (confirm("Уверены что хотите удалить?")) {
                                    if (getValues("coment") !== "") {
                                        await deleteWorkingHours({
                                            params: {
                                                year: date[0],
                                                month: date[1],
                                                day: date[2],
                                            },
                                            body: {
                                                start_time_old: interval.start,
                                                end_time_old: interval.end,
                                                comments: getValues("coment"),
                                                userIdUser: role
                                                    ? typeof currentEmp ===
                                                      "object"
                                                        ? employee[
                                                              currentEmp.dep
                                                          ]?.users[
                                                              currentEmp.user
                                                          ].id_user
                                                        : employee[currentEmp]
                                                              .id_user
                                                    : user.userData.id_user,
                                                writingByUserID: role
                                                    ? userId
                                                    : user.userData.id_user,
                                            },
                                        });
                                        onChange(false);
                                    } else
                                        alert("Проверьте наличие комментария!");
                                }
                            }}
                        >
                            Удалить
                        </button>
                    )}
                    <button
                        type="button"
                        className="modal-button-2"
                        onClick={() => {
                            onChange(false);
                        }}
                    >
                        Отмена
                    </button>
                    <button type="submit" className="modal-button-3">
                        Сохранить
                    </button>
                </div>
            </div>
        </form>
    );
}
