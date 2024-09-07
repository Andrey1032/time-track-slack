import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchAuth } from "../../assets/store/slices/userSlice";
import Loader from "../../components/Loader/Loader";
import { useForm } from "react-hook-form";
import {
    DIRECTOR_ROUTE,
    EMPLOYEE_ROUTE,
    MANAGER_ROUTE,
} from "../../utils/consts";

export default function LoginPage() {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            login: "",
            password: "",
        },
    });
    const statusAuth = useSelector((state) => state.user.status);
    const dispatch = useDispatch();
    const userRole = useSelector((state) => state.user.userData.role);
    const userIsAuth = useSelector((state) => state.user.isAuth);

    if (userIsAuth) {
        return (
            <Navigate
                to={
                    userRole === 2
                        ? `${DIRECTOR_ROUTE}/0/0`
                        : userRole === 1
                        ? `${MANAGER_ROUTE}/0`
                        : `${EMPLOYEE_ROUTE}`
                }
            ></Navigate>
        );
    }
    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));
        if (!data.payload) {
            alert("Не удалось авторизоваться");
            return;
        }
        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="login__page">
                {statusAuth === "loading" && (
                    <Loader
                        type={"spinningBubbles"}
                        color={"hsla(223, 93%, 52%, 1)"}
                    ></Loader>
                )}
                <div className="form__field">
                    <h3 className="form__title">Добро пожаловать!</h3>
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
                            type="password"
                            placeholder=" "
                            {...register("password")}
                        />
                        <label className="form__label">Пароль</label>
                    </div>
                    <button type="submit" className="form__button">
                        войти
                    </button>
                </div>
            </div>
        </form>
    );
}
