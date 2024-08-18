import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addEmployee,
    selectorCurrentDep,
    selectorDepartaments,
} from "../../assets/store/slices/employeesSlice";
import $apiSlack from "../../http/slackAPI";
import Loader from "../Loader/Loader";

export default function ModalWindowAddEmployee({ title, onChange, modalRef }) {
    const dispatch = useDispatch();
    const curDep = useSelector(selectorCurrentDep);
    const departament = useSelector(selectorDepartaments);
    const [loader, setLoader] = useState(null);
    const [lastName, setLastName] = useState("");
    const [name, setName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [slack, setSlack] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const handleClick = () => {
        dispatch(
            addEmployee({
                slack,
                password,
                login,
                aboutUser: {
                    name: name,
                    surname: lastName,
                    middle_name: middleName,
                    userRoleIdUserRole: 3,
                    departmentIdDepartment: Array.isArray(departament)
                        ? departament[curDep].id_department
                        : departament.id_department,
                },
            })
        );
    };

    const searchUser = async () => {
        let data;
        setLoader(true);
        await $apiSlack
            .get("/slackaboutuser", { id_slack_user: slack })
            .then((res) => {
                data = res.data;
                setLoader(false);
            })
            .catch((err) => {
                console.log("Ошибка!!!!", err);
                setLoader(false);
            });
        console.log(data);
    };
    return (
        <div className="modal-window employee" ref={modalRef}>
            <div className="modal-content">
                <p className="title">{title}</p>
                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={slack}
                        onChange={(e) => setSlack(e.target.value)}
                    />
                    <label className="form__label">ID в Slack</label>
                    <svg
                        className="icon_search"
                        viewBox="0 0 18 18"
                        onClick={() => searchUser()}
                    >
                        <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" />
                    </svg>
                </div>
                {loader && (
                    <div className="loading_data">
                        <Loader
                            type={"spinningBubbles"}
                            color={"hsla(223, 93%, 52%, 1)"}
                        ></Loader>
                    </div>
                )}

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
                    Добавить
                </div>
            </div>
        </div>
    );
}
