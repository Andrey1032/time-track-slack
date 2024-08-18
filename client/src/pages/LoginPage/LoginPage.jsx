import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAuth } from "../../assets/store/slices/userSlice";
import { authRoutes } from "../../utils/routes";
import Loader from "../../components/Loader/Loader";

export default function LoginPage() {
    const statusAuth = useSelector((state) => state.user.status);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userRole = useSelector((state) => state.user.userData.role);
    const userIsAuth = useSelector((state) => state.user.isAuth);
    useEffect(() => {
        userIsAuth && navigate(authRoutes[userRole].path);
    }, [navigate, userIsAuth, userRole]);

    const handleClick = async () => {
        const data = await dispatch(
            fetchAuth({ login: login, password: password })
        );
        if (!data.payload) {
            return alert(
                "Не удалось авторизоваться!Проверьте логин или пароль!"
            );
        }
        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        }
    };
    return (
        <div className="form">
            {statusAuth === "loading" ? (
                <Loader
                    type={"spinningBubbles"}
                    color={"hsla(223, 93%, 52%, 1)"}
                ></Loader>
            ) : (
                <>
                    <div className="form__field">
                        <h3 className="form__title">Добро пожаловать!</h3>
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
                                type="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className="form__label">Пароль</label>
                        </div>
                    </div>
                    <button
                        className="form__button"
                        onClick={() => handleClick()}
                    >
                        войти
                    </button>
                </>
            )}
        </div>
    );
}
