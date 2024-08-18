import React, { useEffect, useRef, useState } from "react";
import AppTableData from "../../components/AppTableData/AppTableData";
import MenuUsers from "../../components/MenuUsers/MenuUsers";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchEmployees,
    fetchUserData,
    selectorCalendarData,
    selectorCurrentEmployee,
    selectorDataEmployee,
    selectorEmployees,
    selectorStatus,
    selectorStatusReload,
    selectorStatusUpdate,
} from "../../assets/store/slices/employeesSlice";

export default function ManagerPage() {
    const dispatch = useDispatch();
    const manager = useSelector((state) => state.user.userData);
    const statusReload = useSelector(selectorStatusReload);
    const status = useSelector(selectorStatus);
    const employees = useSelector(selectorEmployees); //список сотрудников
    const dataEmp = useSelector(selectorDataEmployee); //данные выбранного сотрудника
    const currentEmp = useSelector(selectorCurrentEmployee);
    const calData = useSelector(selectorCalendarData);
    const statusUpdate = useSelector(selectorStatusUpdate);
    useEffect(() => {
        if (statusReload === "resolved" || statusReload === null) {
            dispatch(
                fetchEmployees({
                    id_department: manager.departament?.id_department,
                })
            );
        }
    }, [statusReload]);

    useEffect(() => {
        if (status === "resolved" && statusUpdate === "resolved") {
            dispatch(
                fetchUserData({
                    id_user: employees[currentEmp]?.id_user,
                    month: calData.month,
                    year: calData.year,
                })
            );
        }
    }, [employees, currentEmp, dispatch, calData, statusUpdate]);

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
                years={(Array.isArray(dataEmp)
                    ? dataEmp[2]
                    : dataEmp?.menuYear
                )?.map((year) => ({
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
