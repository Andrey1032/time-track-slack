import React, { useEffect, useRef, useState } from "react";
import AppTableData from "../components/AppTableData/AppTableData";
import { useClickOutSide } from "../hooks/useClickOutSide";
import MenuUsers from "../components/MenuUsers/MenuUsers";
import {
    currentEmp,
    fetchEmployees,
    fetchUserData,
    selectorCalendarData,
    selectorDataEmployee,
    selectorDepartaments,
    selectorStatus,
    selectorStatusReload,
    selectorStatusUpdate,
    selectorYears,
} from "../assets/store/slices/employeesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function DirectorPage() {
    const { dep, user } = useParams();

    const dispatch = useDispatch();
    const statusReload = useSelector(selectorStatusReload);
    const statusUpdate = useSelector(selectorStatusUpdate);
    const status = useSelector(selectorStatus);
    const departaments = useSelector(selectorDepartaments); //список сотрудников
    const dataEmp = useSelector(selectorDataEmployee); //данные выбранного сотрудника
    const calData = useSelector(selectorCalendarData);
    const years = useSelector(selectorYears);
    useEffect(() => {
        dispatch(
            currentEmp({
                dep: +dep,
                user: +user,
            })
        );
    }, [dep, dispatch, user]);
    
    useEffect(() => {
        if (statusReload === "resolved" || statusReload === null) {
            dispatch(fetchEmployees());
        }
    }, [dispatch, statusReload]);

    useEffect(() => {
        if (
            (status === "resolved" || status === "error") &&
            statusUpdate === "resolved"
        ) {
            dispatch(
                fetchUserData({
                    id_user: departaments[+dep]?.users[+user]?.id_user,
                    month: calData.month,
                    year: calData.year,
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, calData, departaments, statusUpdate, dep, user]);

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
                years={years?.map((year) => ({
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
