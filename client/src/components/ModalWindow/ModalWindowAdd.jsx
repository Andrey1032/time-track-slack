import React from "react";
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
import { useForm } from "react-hook-form";
import { convertTimeInMinutes } from "../../assets/helpers";

export default function ModalWindowAdd({
    title,
    onChange,
    modalRef,
    interval,
}) {
    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            valueStartTime: interval ? interval?.start : "00:00",
            valueEndTime: interval ? interval?.end : "00:00",
            coment: "",
            date: null,
        },
    });

    const currentEmp = useSelector(selectorCurrentEmployee);
    const employee = useSelector(
        typeof currentEmp === "object"
            ? selectorDepartaments
            : selectorEmployees
    );
    const user = useSelector((state) => state.user);
    const role = useSelector(selectorUserRole);
    const dates = useSelector((state) =>
        interval
            ? state.employees?.userData[0]
            : state.user.userData.dataWork[0]
    );

    const checkInterval = (start, end) => {
        if (
            convertTimeInMinutes(end) < convertTimeInMinutes(start) ||
            convertTimeInMinutes(end) === convertTimeInMinutes(start)
        ) {
            return false;
        }
        const intervals = dates.find(
            (dat) => dat.date === getValues("date")
        ).worked_time;

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
    const onSubmit = async (values) => {
        if (!interval) {
            if (
                values.valueEndTime === "00:00" ||
                !values.coment ||
                !values.date
            ) {
                alert("Проверьте поля!");
            } else if (title.includes("переработки")) {
                await createReworking({
                    time_reworking: values.valueEndTime,
                    comments: values.coment,
                    userIdUser: role
                        ? typeof currentEmp === "object"
                            ? employee[currentEmp.dep]?.users[currentEmp.user]
                                  .id_user
                            : employee[currentEmp].id_user
                        : user.userData.id_user,
                    date: values.date,
                    typeOverUnderWorkIdTypeOverUnderWork: 2,
                });
                onChange(false);
            } else {
                await createUnderworking({
                    time_underworking: values.valueEndTime,
                    comments: values.coment,
                    userIdUser: role
                        ? typeof currentEmp === "object"
                            ? employee[currentEmp.dep]?.users[currentEmp.user]
                                  .id_user
                            : employee[currentEmp].id_user
                        : user.userData.id_user,
                    date: values.date,
                    typeOverUnderWorkIdTypeOverUnderWork: 2,
                });
                onChange(false);
            }
        } else {
            if (
                !values.valueStartTime ||
                !values.valueEndTime ||
                !values.coment ||
                !values.date
            ) {
                values.valueStartTime === values.valueEndTime
                    ? alert("Проверьте интервал времени")
                    : alert("Проверьте поля!");
            } else {
                if (checkInterval(values.valueStartTime, values.valueEndTime)) {
                    await createWorkingHours({
                        start_time: values.valueStartTime,
                        end_time: values.valueEndTime,
                        comments: values.coment,
                        userIdUser: role
                            ? typeof currentEmp === "object"
                                ? employee[currentEmp.dep]?.users[
                                      currentEmp.user
                                  ].id_user
                                : employee[currentEmp].id_user
                            : user.userData.id_user,
                        date: values.date,
                        changesByUserID: user.userData.id_user,
                        workflowTimeTypeIdWorkflowTimeType: 2,
                    });
                    onChange(false);
                } else alert("Проверьте интервал времени");
            }
        }
    };
    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-window" ref={modalRef}>
                <div className="modal-content">
                    <p className="title">{title}</p>
                    <input
                        type="date"
                        max={"2050-12-31"}
                        {...register("date")}
                    />

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
                    <button
                        type="button"
                        className="modal-button-2"
                        onClick={() => {
                            onChange(false);
                        }}
                    >
                        Отмена
                    </button>
                    <button className="modal-button-3" type="submit">
                        Добавить
                    </button>
                </div>
            </div>
        </form>
    );
}
