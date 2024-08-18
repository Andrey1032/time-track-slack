import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    currentDep,
    currentEmp,
    deleteEmployee,
    selectorCurrentEmployee,
} from "../../assets/store/slices/employeesSlice";

export default function MenuUsers({
    users,
    departaments,
    setIsOpenModalAddEmployee,
    setIsOpenModalEditEmployee,
    setIsOpenModalAddDepartament,
    setIsOpenModalEditDepartament,
    role,
}) {
    const dispatch = useDispatch();
    const selectedEmp = useSelector(selectorCurrentEmployee);

    const [isOpen, setIsOpen] = useState(
        role
            ? Array.from({ length: departaments?.length }, () => false).map(
                  (flag, i) => (i === selectedEmp.dep ? true : flag)
              )
            : 0
    );

    useEffect(() => {
        setIsOpen(
            role &&
                Array.from({ length: departaments?.length }, () => false).map(
                    (flag, i) => (i === selectedEmp.dep ? true : flag)
                )
        );
    }, [departaments]);
    return (
        <>
            {role ? (
                <div className="menu__users director">
                    {departaments?.map((departament, id_dep) => (
                        <div key={id_dep}>
                            <summary className="user">
                                <div
                                    className="title"
                                    onClick={() =>
                                        setIsOpen(
                                            isOpen.map((dep, index) =>
                                                index === id_dep ? !dep : dep
                                            )
                                        )
                                    }
                                >
                                    {departament.title}
                                </div>
                                <div className="icons">
                                    <svg
                                        className="icon"
                                        onClick={() => {
                                            setIsOpenModalEditDepartament(true);
                                            dispatch(currentDep(id_dep));
                                        }}
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M13.95 8.78C13.98 8.53 14 8.27 14 8C14 7.73 13.98 7.47 13.94 7.22L15.63 5.9C15.78 5.78 15.82 5.56 15.73 5.39L14.13 2.62C14.03 2.44 13.82 2.38 13.64 2.44L11.65 3.24C11.23 2.92 10.79 2.66 10.3 2.46L10 0.34C9.97001 0.14 9.80001 0 9.60001 0H6.40001C6.20001 0 6.04001 0.14 6.01001 0.34L5.71001 2.46C5.22001 2.66 4.77001 2.93 4.36001 3.24L2.37001 2.44C2.19001 2.37 1.98001 2.44 1.88001 2.62L0.280007 5.39C0.180007 5.57 0.220008 5.78 0.380008 5.9L2.07001 7.22C2.03001 7.47 2.00001 7.74 2.00001 8C2.00001 8.26 2.02001 8.53 2.06001 8.78L0.370007 10.1C0.220007 10.22 0.180007 10.44 0.270007 10.61L1.87001 13.38C1.97001 13.56 2.18001 13.62 2.36001 13.56L4.35001 12.76C4.77001 13.08 5.21001 13.34 5.70001 13.54L6.00001 15.66C6.04001 15.86 6.20001 16 6.40001 16H9.60001C9.80001 16 9.97001 15.86 9.99001 15.66L10.29 13.54C10.78 13.34 11.23 13.07 11.64 12.76L13.63 13.56C13.81 13.63 14.02 13.56 14.12 13.38L15.72 10.61C15.82 10.43 15.78 10.22 15.62 10.1L13.95 8.78ZM8.00001 11C6.35001 11 5.00001 9.65 5.00001 8C5.00001 6.35 6.35001 5 8.00001 5C9.65001 5 11 6.35 11 8C11 9.65 9.65001 11 8.00001 11Z" />
                                    </svg>
                                    <svg
                                        className={
                                            isOpen[id_dep]
                                                ? "icon open"
                                                : "icon"
                                        }
                                        onClick={() =>
                                            setIsOpen(
                                                isOpen.map((dep, index) =>
                                                    index === id_dep
                                                        ? !dep
                                                        : dep
                                                )
                                            )
                                        }
                                        viewBox="0 0 12 5"
                                    >
                                        <path d="M0 0L5 5L10 0H0Z" />
                                    </svg>
                                </div>
                            </summary>
                            <div
                                className={
                                    isOpen[id_dep]
                                        ? "departament__users open"
                                        : "departament__users"
                                }
                            >
                                {departament.users?.map((user, id_user) => (
                                    <div
                                        className={
                                            selectedEmp.dep === id_dep &&
                                            selectedEmp.user === id_user
                                                ? "user active director"
                                                : "user director"
                                        }
                                        key={id_user}
                                    >
                                        <div
                                            className="user__name"
                                            onClick={() => {
                                                dispatch(
                                                    currentEmp({
                                                        dep: id_dep,
                                                        user: id_user,
                                                    })
                                                );
                                            }}
                                        >
                                            {user.surname +
                                                " " +
                                                user.name[0] +
                                                "."}
                                        </div>
                                        <div className="icons">
                                            {id_dep === selectedEmp.dep &&
                                                id_user ===
                                                    selectedEmp.user && (
                                                    <svg
                                                        className="icon"
                                                        onClick={() =>
                                                            setIsOpenModalEditEmployee(
                                                                true
                                                            )
                                                        }
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M13.95 8.78C13.98 8.53 14 8.27 14 8C14 7.73 13.98 7.47 13.94 7.22L15.63 5.9C15.78 5.78 15.82 5.56 15.73 5.39L14.13 2.62C14.03 2.44 13.82 2.38 13.64 2.44L11.65 3.24C11.23 2.92 10.79 2.66 10.3 2.46L10 0.34C9.97001 0.14 9.80001 0 9.60001 0H6.40001C6.20001 0 6.04001 0.14 6.01001 0.34L5.71001 2.46C5.22001 2.66 4.77001 2.93 4.36001 3.24L2.37001 2.44C2.19001 2.37 1.98001 2.44 1.88001 2.62L0.280007 5.39C0.180007 5.57 0.220008 5.78 0.380008 5.9L2.07001 7.22C2.03001 7.47 2.00001 7.74 2.00001 8C2.00001 8.26 2.02001 8.53 2.06001 8.78L0.370007 10.1C0.220007 10.22 0.180007 10.44 0.270007 10.61L1.87001 13.38C1.97001 13.56 2.18001 13.62 2.36001 13.56L4.35001 12.76C4.77001 13.08 5.21001 13.34 5.70001 13.54L6.00001 15.66C6.04001 15.86 6.20001 16 6.40001 16H9.60001C9.80001 16 9.97001 15.86 9.99001 15.66L10.29 13.54C10.78 13.34 11.23 13.07 11.64 12.76L13.63 13.56C13.81 13.63 14.02 13.56 14.12 13.38L15.72 10.61C15.82 10.43 15.78 10.22 15.62 10.1L13.95 8.78ZM8.00001 11C6.35001 11 5.00001 9.65 5.00001 8C5.00001 6.35 6.35001 5 8.00001 5C9.65001 5 11 6.35 11 8C11 9.65 9.65001 11 8.00001 11Z" />
                                                    </svg>
                                                )}
                                            <svg
                                                className="icon"
                                                onClick={() => {
                                                    // eslint-disable-next-line no-restricted-globals
                                                    confirm(
                                                        `Вы уверены, что хотите удалить сотрудника '${
                                                            user.name +
                                                            " " +
                                                            user.surname
                                                        }' из '${
                                                            departament.title
                                                        }'?`
                                                    ) &&
                                                        dispatch(
                                                            deleteEmployee(
                                                                user.id_user
                                                            )
                                                        );
                                                    dispatch(
                                                        currentEmp({
                                                            dep: id_dep,
                                                            user: 0,
                                                        })
                                                    );
                                                }}
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M14 1.4L12.6 0L7 5.6L1.4 0L0 1.4L5.6 7L0 12.6L1.4 14L7 8.4L12.6 14L14 12.6L8.4 7L14 1.4Z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    className="button_add"
                                    onClick={() => {
                                        setIsOpenModalAddEmployee(true);
                                        dispatch(currentDep(id_dep));
                                    }}
                                >
                                    + Добавить сотрудника
                                </div>
                            </div>
                        </div>
                    ))}
                    <div
                        className="button_add"
                        onClick={() => setIsOpenModalAddDepartament(true)}
                    >
                        + Добавить отдел
                    </div>
                </div>
            ) : (
                <div className="menu__users">
                    {users?.map((user, id) => (
                        <div
                            className={
                                id === selectedEmp ? "user active" : "user"
                            }
                            key={id}
                        >
                            <div
                                className="user__name"
                                onClick={() => {
                                    dispatch(currentEmp(id));
                                }}
                            >
                                {user.surname + " " + user.name[0] + "."}
                            </div>
                            <div className="icons">
                                {id === selectedEmp && (
                                    <svg
                                        className="icon"
                                        onClick={() =>
                                            setIsOpenModalEditEmployee(true)
                                        }
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M13.95 8.78C13.98 8.53 14 8.27 14 8C14 7.73 13.98 7.47 13.94 7.22L15.63 5.9C15.78 5.78 15.82 5.56 15.73 5.39L14.13 2.62C14.03 2.44 13.82 2.38 13.64 2.44L11.65 3.24C11.23 2.92 10.79 2.66 10.3 2.46L10 0.34C9.97001 0.14 9.80001 0 9.60001 0H6.40001C6.20001 0 6.04001 0.14 6.01001 0.34L5.71001 2.46C5.22001 2.66 4.77001 2.93 4.36001 3.24L2.37001 2.44C2.19001 2.37 1.98001 2.44 1.88001 2.62L0.280007 5.39C0.180007 5.57 0.220008 5.78 0.380008 5.9L2.07001 7.22C2.03001 7.47 2.00001 7.74 2.00001 8C2.00001 8.26 2.02001 8.53 2.06001 8.78L0.370007 10.1C0.220007 10.22 0.180007 10.44 0.270007 10.61L1.87001 13.38C1.97001 13.56 2.18001 13.62 2.36001 13.56L4.35001 12.76C4.77001 13.08 5.21001 13.34 5.70001 13.54L6.00001 15.66C6.04001 15.86 6.20001 16 6.40001 16H9.60001C9.80001 16 9.97001 15.86 9.99001 15.66L10.29 13.54C10.78 13.34 11.23 13.07 11.64 12.76L13.63 13.56C13.81 13.63 14.02 13.56 14.12 13.38L15.72 10.61C15.82 10.43 15.78 10.22 15.62 10.1L13.95 8.78ZM8.00001 11C6.35001 11 5.00001 9.65 5.00001 8C5.00001 6.35 6.35001 5 8.00001 5C9.65001 5 11 6.35 11 8C11 9.65 9.65001 11 8.00001 11Z" />
                                    </svg>
                                )}
                                <svg
                                    className="icon"
                                    onClick={() => {
                                        // eslint-disable-next-line no-restricted-globals
                                        confirm(
                                            `Вы уверены, что хотите удалить сотрудника '${
                                                user.name + " " + user.surname
                                            }'?`
                                        ) &&
                                            dispatch(
                                                deleteEmployee(user.id_user)
                                            );
                                        dispatch(currentEmp(0));
                                    }}
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M14 1.4L12.6 0L7 5.6L1.4 0L0 1.4L5.6 7L0 12.6L1.4 14L7 8.4L12.6 14L14 12.6L8.4 7L14 1.4Z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                    <div
                        className="button_add"
                        onClick={() => setIsOpenModalAddEmployee(true)}
                    >
                        + Добавить сотрудника
                    </div>
                </div>
            )}
        </>
    );
}
