import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    addDepartment,
} from "../../assets/store/slices/employeesSlice";
import Loader from "../Loader/Loader";
import $apiSlack from "../../http/slackAPI";

export default function ModalWindowAddDepartament({
    title,
    onChange,
    modalRef,
}) {
    const dispatch = useDispatch();

    const [lastName, setLastName] = useState("");
    const [name, setName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [slack, setSlack] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [nameDepartament, setnameDepartament] = useState("");
    const [slackChanel, setSlackChanel] = useState("");

    const handleClick = () => {
        dispatch(
            addDepartment({
                name_department: nameDepartament,
                slack: slackChanel,
                aboutMeneg: {
                    login: login,
                    password: password,
                    slack: slack,
                    name: name,
                    surname: lastName,
                    middle_name: middleName,
                },
            })
        );
    };

    const [loader, setLoader] = useState(null);

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
        <div className="modal-window director" ref={modalRef}>
            <div className="modal-content">
                <p className="title">{title}</p>

                <p className="subtitle">Данные отдела</p>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={nameDepartament}
                        onChange={(e) => setnameDepartament(e.target.value)}
                    />
                    <label className="form__label">Название отдела</label>
                </div>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={slackChanel}
                        onChange={(e) => setSlackChanel(e.target.value)}
                    />
                    <label className="form__label">Канал в Slack</label>
                </div>

                <p className="subtitle">Данные руководителя отдела</p>

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
                            height={"25%"}
                            width={"25%"}
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
                    Сохранить
                </div>
            </div>
        </div>
    );
}
