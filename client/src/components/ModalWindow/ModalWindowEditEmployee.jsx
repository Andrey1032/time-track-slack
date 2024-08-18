import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    editEmployee,
    selectorCurrentEmployee,
    selectorDepartaments,
    selectorEmployees,
} from "../../assets/store/slices/employeesSlice";
import AppSelect from "../AppSelect/AppSelect";

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
            ? String(employee[currentEmp.dep].id_department)
            : String(employee.id_department)
    );

    const options = employee?.map((dep) => ({
        label: dep.title,
        value: String(dep.id_department),
    }));
    const handleClick = () => {
        dispatch(
            typeof currentEmp === "object"
                ? editEmployee({
                      id: employee[currentEmp.dep].users[currentEmp.user]
                          .id_user,
                      params: {
                          surname: lastName,
                          name: name,
                          middle_name: middleName,
                          slack: slack,
                          password:
                              password.length === 0
                                  ? employee[currentEmp.dep].users[
                                        currentEmp.user
                                    ].password
                                  : password,
                          login: login,
                          userRoleIdUserRole: null,
                          departmentIdDepartment: Number(currentDep),
                      },
                  })
                : editEmployee({
                      id: employee[currentEmp].id_user,
                      params: {
                          surname: lastName,
                          name: name,
                          middle_name: middleName,
                          slack: slack,
                          password:
                              password.length === 0
                                  ? employee[currentEmp].password
                                  : password,
                          login: login,
                          userRoleIdUserRole: null,
                          departmentIdDepartment: Number(currentDep),
                      },
                  })
        );
    };

    const [lastName, setLastName] = useState(
        typeof currentEmp !== "object"
            ? employee[currentEmp]?.surname
            : employee[currentEmp.dep]?.users[currentEmp.user]?.surname
    );
    const [name, setName] = useState(
        typeof currentEmp !== "object"
            ? employee[currentEmp]?.name
            : employee[currentEmp.dep]?.users[currentEmp.user]?.name
    );
    const [middleName, setMiddleName] = useState(
        typeof currentEmp !== "object"
            ? employee[currentEmp]?.middle_name
            : employee[currentEmp.dep]?.users[currentEmp.user]?.middle_name
    );
    const [slack, setSlack] = useState(
        typeof currentEmp !== "object"
            ? employee[currentEmp]?.account_datum.slack
            : employee[currentEmp.dep]?.users[currentEmp.user]?.account_datum
                  .slack
    );
    const [login, setLogin] = useState(
        typeof currentEmp !== "object"
            ? employee[currentEmp]?.account_datum.login
            : employee[currentEmp.dep]?.users[currentEmp.user]?.account_datum
                  .login
    );
    const [password, setPassword] = useState("");
    return (
        <div className="modal-window employee" ref={modalRef}>
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
                        value={slack}
                        onChange={(e) => setSlack(e.target.value)}
                    />
                    <label className="form__label">ID в Slack</label>
                </div>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label className="form__label">Фамилия</label>
                </div>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label className="form__label">Имя</label>
                </div>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                    />
                    <label className="form__label">Отчество</label>
                </div>
                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <label className="form__label">Логин</label>
                </div>
                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form__label">Пароль</label>
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
                    onClick={() => {
                        onChange(false);
                        handleClick();
                    }}
                >
                    Сохранить изменения
                </div>
            </div>
        </div>
    );
}
