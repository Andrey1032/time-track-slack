import React, { useEffect, useRef, useState } from "react";
import AppTableData from "../../components/AppTableData/AppTableData";
import MenuUsers from "../../components/MenuUsers/MenuUsers";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import { useDispatch, useSelector } from "react-redux";
import {
    currentEmp,
    fetchEmployees,
    fetchUserData,
    selectorCalendarData,
    selectorDataEmployee,
    selectorEmployees,
    selectorStatus,
    selectorStatusReload,
    selectorStatusUpdate,
    selectorYears,
} from "../../assets/store/slices/employeesSlice";
import { useParams } from "react-router-dom";

export default function ManagerPage() {
    const dispatch = useDispatch();
    const manager = useSelector((state) => state.user.userData);
    const statusReload = useSelector(selectorStatusReload);
    const statusUpdate = useSelector(selectorStatusUpdate);
    const status = useSelector(selectorStatus);
    const employees = useSelector(selectorEmployees); //список сотрудников
    const dataEmp = useSelector(selectorDataEmployee); //данные выбранного сотрудника
    const calData = useSelector(selectorCalendarData);
    const years = useSelector(selectorYears);
    const { user } = useParams();
    useEffect(() => {
        if (statusReload === "resolved" || statusReload === null) {
            dispatch(
                fetchEmployees({
                    id_department: manager.departament?.id_department,
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusReload]);

    useEffect(() => {
        dispatch(currentEmp(+user));
    }, [dispatch, user]);

    useEffect(() => {
        if (status === "resolved" && statusUpdate === "resolved") {
            dispatch(
                fetchUserData({
                    id_user: employees[+user]?.id_user,
                    month: calData.month,
                    year: calData.year,
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employees, dispatch, calData, statusUpdate, user]);

    // Управление модалками
    const modalAddEmployeeRef = useRef(null);
    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);

    const modalEditEmployeeRef = useRef(null);
    const [isOpenModalEditEmployee, setIsOpenModalEditEmployee] =
        useState(false);

    useClickOutSide(modalAddEmployeeRef, () => {
        isOpenModalAddEmployee &&
            setTimeout(() => setIsOpenModalAddEmployee(false), 50);
    });

    useClickOutSide(modalEditEmployeeRef, () => {
        isOpenModalEditEmployee &&
            setTimeout(() => setIsOpenModalEditEmployee(false), 50);
    });

    return (
        <div className="manager__page">
            <MenuUsers
                users={employees}
                setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                setIsOpenModalEditEmployee={setIsOpenModalEditEmployee}
                role={false}
            />
            {}
            <AppTableData
                years={years?.map((year) => ({
                    value: year.toString(),
                    label: year.toString(),
                }))}
                data={Array.isArray(dataEmp) && dataEmp}
                isOpenModalAddEmployee={isOpenModalAddEmployee}
                setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                modalAddEmployeeRef={modalAddEmployeeRef}
                isOpenModalEditEmployee={isOpenModalEditEmployee}
                setIsOpenModalEditEmployee={setIsOpenModalEditEmployee}
                modalEditEmployeeRef={modalEditEmployeeRef}
            />
        </div>
    );
}
