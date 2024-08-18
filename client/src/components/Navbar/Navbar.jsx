import React, { useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import AppSidebar from "../AppSidebar/AppSidebar";
import { useDispatch, useSelector } from "react-redux";
import { exitUser } from "../../assets/store/slices/userSlice";
import { exitEmp } from "../../assets/store/slices/employeesSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);
    const [notification] = useState(true);
    const [isOpen, setOpen] = useState();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    useClickOutSide(menuRef, () => {
        isOpen && setTimeout(() => setOpen(false), 50);
    });
    const Notification = () => {};
    const logout = () => {
        dispatch(exitUser());
        dispatch(exitEmp());
        navigate('/');
        window.localStorage.removeItem("token");
    };
    return (
        <>
            <div className="nav">
                <p className="back__icon">
                    <svg
                        // eslint-disable-next-line no-restricted-globals
                        onClick={() => confirm("Выйти из профиля?") && logout()}
                    >
                        <path d="M12 20L4 12L12 4L13.05 5.05L6.85 11.25H20V12.75H6.85L13.05 18.95L12 20Z" />
                    </svg>
                </p>

                <div className="user__data">
                    <div className="notification">
                        <div
                            className="notification__icon"
                            onClick={Notification()}
                        >
                            <svg className="icon" viewBox="0 0 24 28">
                                <path d="M2.23363 23.5336C1.8555 23.5336 1.5499 23.4112 1.31683 23.1664C1.08323 22.9221 0.966431 22.6221 0.966431 22.2664C0.966431 21.9112 1.08323 21.6112 1.31683 21.3664C1.5499 21.1221 1.8555 21 2.23363 21H3.80003V11.3336C3.80003 9.44453 4.3611 7.73893 5.48323 6.21679C6.60536 4.69466 8.08883 3.73359 9.93363 3.33359V2.39999C9.93363 1.84426 10.1336 1.37199 10.5336 0.983194C10.9336 0.594394 11.4224 0.399994 12 0.399994C12.5776 0.399994 13.0664 0.594394 13.4664 0.983194C13.8664 1.37199 14.0664 1.84426 14.0664 2.39999V3.33359C15.9112 3.73359 17.4003 4.69466 18.5336 6.21679C19.667 7.73893 20.2336 9.44453 20.2336 11.3336V21H21.8C22.1558 21 22.4558 21.1221 22.7 21.3664C22.9443 21.6112 23.0664 21.9112 23.0664 22.2664C23.0664 22.6221 22.9443 22.9221 22.7 23.1664C22.4558 23.4112 22.1558 23.5336 21.8 23.5336H2.23363ZM12 27.5664C11.2667 27.5664 10.6278 27.2997 10.0832 26.7664C9.5387 26.2331 9.26643 25.5888 9.26643 24.8336H14.7336C14.7336 25.5888 14.467 26.2331 13.9336 26.7664C13.4003 27.2997 12.7558 27.5664 12 27.5664Z" />
                            </svg>
                            {notification && (
                                <svg className="dot__marker">
                                    <circle cx="3" cy="3" r="3" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <div
                        className="user__profile"
                        onClick={() => setOpen(!isOpen)}
                        ref={menuRef}
                    >
                        {/* <img
                            className="user__avatar"
                            src="https://placehold.co/48"
                            alt="user avatar"
                        ></img> */}

                        <div className="user__name">
                            <p>
                                {userData.surname} {userData.name[0]}.
                            </p>

                            <svg className="marker__sidebar">
                                <path d="M0 0L5 5L10 0H0Z" />
                            </svg>
                        </div>
                        <div className="user__dept">
                            {userData?.departament?.name_department}
                        </div>
                        {isOpen && <AppSidebar />}
                    </div>
                </div>
            </div>

            <Outlet />
        </>
    );
}
