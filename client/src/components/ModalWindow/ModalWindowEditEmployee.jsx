import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    editEmployee,
    selectorCurrentEmployee,
    selectorDepartaments,
    selectorEmployees,
} from "../../assets/store/slices/employeesSlice";
import AppSelect from "../AppSelect/AppSelect";
import { useForm } from "react-hook-form";

export default function ModalWindowAddEmployee({ title, onChange, modalRef }) {
    const dispatch = useDispatch();
    const currentEmp = useSelector(selectorCurrentEmployee);
    const employee = useSelector(
        typeof currentEmp === "object"
            ? selectorDepartaments
            : selectorEmployees
    );

    const [currentDep, setCurrentDep] = useState(
        typeof currentEmp === "object"
            ? employee[currentEmp.dep].id_department
            : employee.id_department
    );

    const options = employee?.map((dep) => ({
        label: dep.title,
        value: String(dep.id_department),
    }));
    console.log(currentDep);
    const { register, handleSubmit } = useForm({
        defaultValues: {
            params: {
                surname:
                    typeof currentEmp !== "object"
                        ? employee[currentEmp]?.surname
                        : employee[currentEmp.dep]?.users[currentEmp.user]
                              ?.surname,
                name:
                    typeof currentEmp !== "object"
                        ? employee[currentEmp]?.name
                        : employee[currentEmp.dep]?.users[currentEmp.user]
                              ?.name,
                middle_name:
                    typeof currentEmp !== "object"
                        ? employee[currentEmp]?.middle_name
                        : employee[currentEmp.dep]?.users[currentEmp.user]
                              ?.middle_name,
                slack:
                    typeof currentEmp !== "object"
                        ? employee[currentEmp]?.account_datum.slack
                        : employee[currentEmp.dep]?.users[currentEmp.user]
                              ?.account_datum.slack,
                password: "",
                login:
                    typeof currentEmp !== "object"
                        ? employee[currentEmp]?.account_datum.login
                        : employee[currentEmp.dep]?.users[currentEmp.user]
                              ?.account_datum.login,
                userRoleIdUserRole: null,
                departmentIdDepartment: currentDep,
            },
        },
    });
    const onSubmit = (values) => {
        
        dispatch(
            typeof currentEmp === "object"
                ? editEmployee({
                      id: employee[currentEmp.dep].users[currentEmp.user]
                          .id_user,
                      params: {
                          ...values.params,
                          password:
                              values.params.password === ""
                                  ? employee[currentEmp.dep].users[
                                        currentEmp.user
                                    ].password
                                  : values.params.password,
                      },
                  })
                : editEmployee({
                      id: employee[currentEmp].id_user,
                      params: {
                          ...values.params,
                          password:
                              values.params.password === ""
                                  ? employee[currentEmp].password
                                  : values.params.password,
                      },
                  })
        );
        onChange(false);
    };
    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-window director" ref={modalRef}>
                <div className="modal-content">
                    <p className="title">{title}</p>
                    {typeof currentEmp === "object" && (
                        <div className="select">
                            <AppSelect
                                options={options}
                                currentOption={currentDep}
                                setCurrentOption={setCurrentDep}
                                placeholder={"Выберете отдел"}
                            />
                        </div>
                    )}

                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("params.slack")}
                        />
                        <label className="form__label">ID в Slack</label>
                    </div>

                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("params.surname")}
                        />
                        <label className="form__label">Фамилия</label>
                    </div>

                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("params.name")}
                        />
                        <label className="form__label">Имя</label>
                    </div>

                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("params.middle_name")}
                        />
                        <label className="form__label">Отчество</label>
                    </div>
                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("params.login")}
                        />
                        <label className="form__label">Логин</label>
                    </div>
                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("params.password")}
                        />
                        <label className="form__label">Пароль</label>
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
                    <button type="sumbit" className="modal-button-3">
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </form>
    );
}
