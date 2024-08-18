import React, { useEffect } from "react";
import AppTableData from "../components/AppTableData/AppTableData";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserData,
    selectorCalendarDataUser,
} from "../assets/store/slices/userSlice";
import { selectorStatusUpdate } from "../assets/store/slices/employeesSlice";

export default function EmployeePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const dataEmp = useSelector((state) => state.user.dataWork);
    const years = useSelector((state) => state.user.userData?.menuYear);
    const statusFecth = useSelector((state) => state.user.statusFetch);
    const curData = useSelector(selectorCalendarDataUser);
    const statusUpdate = useSelector(selectorStatusUpdate);
    useEffect(() => {
        if (
            (statusFecth === "resolved" || statusFecth === null) &&
            statusUpdate === "resolved"
        ) {
            dispatch(
                fetchUserData({
                    id_user: user.userData.id_user,
                    month: curData.month,
                    year: curData.year,
                })
            );
        }
    }, [curData, dispatch, statusUpdate]);
    return (
        <AppTableData
            years={years.map((year) => ({
                value: year.toString(),
                label: year.toString(),
            }))}
            data={Array.isArray(dataEmp) && dataEmp}
        />
    );
}
