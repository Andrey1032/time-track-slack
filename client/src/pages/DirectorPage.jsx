import React, { useEffect, useRef, useState } from "react";
import AppTableData from "../components/AppTableData/AppTableData";
import { useClickOutSide } from "../hooks/useClickOutSide";
import MenuUsers from "../components/MenuUsers/MenuUsers";
import {
    currentEmp,
    fetchEmployees,
    fetchUserData,
    selectorCalendarData,
    selectorCurrentEmployee,
    selectorDataEmployee,
    selectorDepartaments,
    selectorStatus,
    selectorStatusReload,
    selectorStatusUpdate,
} from "../assets/store/slices/employeesSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DirectorPage() {
    const dispatch = useDispatch();
    // const director = useSelector((state) => state.user.userData);
    const statusReload = useSelector(selectorStatusReload);
    const status = useSelector(selectorStatus);
    const departaments = useSelector(selectorDepartaments); //список сотрудников
    const dataEmp = useSelector(selectorDataEmployee); //данные выбранного сотрудника
    const curEmp = useSelector(selectorCurrentEmployee);
    const calData = useSelector(selectorCalendarData);
    const statusUpdate = useSelector(selectorStatusUpdate);
    useEffect(() => {
        if (statusReload === "resolved" || statusReload === null) {
            dispatch(fetchEmployees());
        }
    }, [dispatch, statusReload]);

    useEffect(() => {
        if (curEmp === 0)
            dispatch(
                currentEmp({
                    dep: 0,
                    user: 0,
                })
            );
    }, [departaments]);

    useEffect(() => {
        if (
            (status === "resolved" || status === "error") &&
            statusUpdate === "resolved"
        ) {
            dispatch(
                fetchUserData({
                    id_user:
                        departaments[curEmp.dep]?.users[curEmp.user]?.id_user,
                    month: calData.month,
                    year: calData.year,
                })
            );
        }
    }, [curEmp, dispatch, calData, departaments, statusUpdate]);

    //управление модалками
    const modalAddEmployeeRef = useRef(null);
    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);

    const modalEditEmployeeRef = useRef(null);
    const [isOpenModalEditEmployee, setIsOpenModalEditEmployee] =
        useState(false);

    const modalAddDepartamentRef = useRef(null);
    const [isOpenModalAddDepartament, setIsOpenModalAddDepartament] =
        useState(false);

    const modalEditDepartamentRef = useRef(null);
    const [isOpenModalEditDepartament, setIsOpenModalEditDepartament] =
        useState(false);

    useClickOutSide(modalAddEmployeeRef, () => {
        isOpenModalAddEmployee &&
            setTimeout(() => setIsOpenModalAddEmployee(false), 50);
    });

    useClickOutSide(modalEditEmployeeRef, () => {
        isOpenModalEditEmployee &&
            setTimeout(() => setIsOpenModalEditEmployee(false), 50);
    });

    useClickOutSide(modalAddDepartamentRef, () => {
        isOpenModalAddDepartament &&
            setTimeout(() => setIsOpenModalAddDepartament(false), 50);
    });

    useClickOutSide(modalEditDepartamentRef, () => {
        isOpenModalEditDepartament &&
            setTimeout(() => setIsOpenModalEditDepartament(false), 50);
    });

    return (
        <div className="manager__page">
            {Array.isArray(departaments) && (
                <MenuUsers
                    users={null}
                    departaments={departaments}
                    setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                    setIsOpenModalEditEmployee={setIsOpenModalEditEmployee}
                    setIsOpenModalAddDepartament={setIsOpenModalAddDepartament}
                    setIsOpenModalEditDepartament={
                        setIsOpenModalEditDepartament
                    }
                    role={true}
                />
            )}
            <AppTableData
                years={(Array.isArray(dataEmp)
                    ? dataEmp[2]
                    : dataEmp?.menuYear
                )?.map((year) => ({
                    value: year.toString(),
                    label: year.toString(),
                }))}
                data={Array.isArray(dataEmp) && dataEmp}
                modalAddEmployeeRef={modalAddEmployeeRef}
                isOpenModalAddEmployee={isOpenModalAddEmployee}
                setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                modalEditEmployeeRef={modalEditEmployeeRef}
                isOpenModalEditEmployee={isOpenModalEditEmployee}
                setIsOpenModalEditEmployee={setIsOpenModalEditEmployee}
                modalEditDepartamentRef={modalEditDepartamentRef}
                isOpenModalEditDepartament={isOpenModalEditDepartament}
                setIsOpenModalEditDepartament={setIsOpenModalEditDepartament}
                modalAddDepartamentRef={modalAddDepartamentRef}
                isOpenModalAddDepartament={isOpenModalAddDepartament}
                setIsOpenModalAddDepartament={setIsOpenModalAddDepartament}
            />
        </div>
    );
}
