import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addEmployee,
    selectorCurrentDep,
    selectorDepartaments,
} from "../../assets/store/slices/employeesSlice";
import $apiSlack from "../../http/slackAPI";
import Loader from "../Loader/Loader";
import { useForm } from "react-hook-form";

export default function ModalWindowAddEmployee({ title, onChange, modalRef }) {
    const dispatch = useDispatch();
    const curDep = useSelector(selectorCurrentDep);
    const departament = useSelector(selectorDepartaments);
    const [loader, setLoader] = useState(null);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            slack: "",
            password: "",
            login: "",
            aboutUser: {
                name: "",
                surname: "",
                middle_name: "",
                userRoleIdUserRole: 3,
                departmentIdDepartment: Array.isArray(departament)
                    ? departament[curDep].id_department
                    : departament.id_department,
            },
        },
    });

    const onSubmit = (values) => {
        console.log(values);
        dispatch(addEmployee(values));
        onChange(false);
    };
    ///В разработке
    const searchUser = async (slack) => {
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
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-window employee" ref={modalRef}>
                <div className="modal-content">
                    <p className="title">{title}</p>
                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("slack")}
                        />
                        <label className="form__label">ID в Slack</label>
                        <svg
                            className="icon_search"
                            viewBox="0 0 18 18"
                            onClick={() => {
                                // searchUser(this.values.aboutMeneg.slack);
                            }}
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
                            {...register("aboutUser.surname")}
                        />
                        <label className="form__label">Фамилия</label>
                    </div>

                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("aboutUser.name")}
                        />
                        <label className="form__label">Имя</label>
                    </div>

                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("aboutUser.middle_name")}
                        />
                        <label className="form__label">Отчество</label>
                    </div>
                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("login")}
                        />
                        <label className="form__label">Логин</label>
                    </div>
                    <div className="form__group">
                        <input
                            className="form__input"
                            type="text"
                            placeholder=" "
                            {...register("password")}
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
                    <button type="submit" className="modal-button-3">
                        Добавить
                    </button>
                </div>
            </div>
        </form>
    );
}
