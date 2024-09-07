import React, { useEffect, useRef, useState } from "react";
import AppSelect from "../AppSelect/AppSelect";
import { months } from "../../assets/temp/data";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import ItemWorkTime from "../ItemWorkTime/ItemWorkTime";
import ModalWindowAdd from "../ModalWindow/ModalWindowAdd";
import ModalWindowAddEmployee from "../ModalWindow/ModalWindowAddEmployee";
import ModalWindowEditEmployee from "../ModalWindow/ModalWindowEditEmployee";
import ModalWindowEdit from "../ModalWindow/ModalWindowEdit";
import ModalWindowAddDepartament from "../ModalWindow/ModalWindowAddDepartament";
import ModalWindowEditDepartament from "../ModalWindow/ModalWindowEditDepartament";
import ModalWindowShow from "../ModalWindow/ModalWindowShow";
import { useDispatch, useSelector } from "react-redux";
import {
    currentCalendarData,
    selectorStatus,
} from "../../assets/store/slices/employeesSlice";
import {
    currentCalendarDataUser,
    selectorUserRole,
} from "../../assets/store/slices/userSlice";
import * as XLSX from "xlsx";
import Loader from "../Loader/Loader";
import {
    clearStatus,
    fetchOtchet,
    selectorOtchetData,
    selectorStatusOtchet,
} from "../../assets/store/slices/otchetSlice";
import {
    convertDate,
    converTimeInHoursMinutes,
    convertInterval,
    countMissed,
    countWorked,
    s2ab,
} from "../../assets/helpers";
export default function AppTableData({
    years,
    data,
    isOpenModalAddEmployee,
    setIsOpenModalAddEmployee,
    modalAddEmployeeRef,

    isOpenModalEditEmployee,
    setIsOpenModalEditEmployee,
    modalEditEmployeeRef,

    modalEditDepartamentRef,
    isOpenModalEditDepartament,
    setIsOpenModalEditDepartament,
    modalAddDepartamentRef,

    isOpenModalAddDepartament,
    setIsOpenModalAddDepartament,
}) {
    const dispatch = useDispatch();

    const isLoadData = useSelector(selectorStatus);
    const role = useSelector(selectorUserRole);
    const dataOtchet = useSelector(selectorOtchetData);
    const dataOtchetStatus = useSelector(selectorStatusOtchet);
    const dep_id = useSelector(
        (state) => state.employees.employees?.id_department
    );
    const [currentMonth, setCurrentMonth] = useState(
        (new Date().getMonth() + 1).toString()
    );
    const [currentYear, setCurrentYear] = useState(
        new Date().getFullYear().toString()
    );

    useEffect(() => {
        if (!role) {
            dispatch(
                currentCalendarDataUser({
                    month: currentMonth,
                    year: currentYear,
                })
            );
        } else
            dispatch(
                currentCalendarData({
                    month: currentMonth,
                    year: currentYear,
                })
            );
    }, [currentMonth, currentYear, dispatch, role]);

    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
    const [isOpenModalShow, setIsOpenModalShow] = useState(false);
    const modalAddRef = useRef(null);
    const modalEditRef = useRef(null);
    const modalShowRef = useRef(null);

    useClickOutSide(modalAddRef, () => {
        isOpenModalAdd && setTimeout(() => setIsOpenModalAdd(false), 50);
    });

    useClickOutSide(modalEditRef, () => {
        isOpenModalEdit && setTimeout(() => setIsOpenModalEdit(false), 50);
    });
    useClickOutSide(modalShowRef, () => {
        isOpenModalShow && setTimeout(() => setIsOpenModalShow(false), 50);
    });

    const convertTime = (time) => {
        if (time === null || time === "") return 0;
        const timeArr = time.split(":");
        const newTime = +timeArr[0] * 60 + +timeArr[1];
        return newTime;
    };

    const countTime = (times) => {
        const time = times.date.reduce(
            (acc, curVal) => acc + convertTime(curVal),
            0
        ); // в минутах
        return `${Math.floor(time / 60)}:${
            time % 60 < 10 ? `0${time % 60}` : `${time % 60}`
        }`;
    };

    const exportFile = () => {
        dispatch(
            fetchOtchet(
                dep_id
                    ? {
                          id_department: dep_id,
                          month: Number(currentMonth),
                          year: Number(currentYear),
                      }
                    : {
                          month: Number(currentMonth),
                          year: Number(currentYear),
                      }
            )
        );
    };

    const generateXLSXFile = () => {
        const otchet = (dep_id ? [dataOtchet] : dataOtchet).map((users) => [
            [users.title],
            [users.subtitle],
            ["пропуски"],
            [
                "",
                "П/М",
                ...users.underworking[0].date.map((d, i) => i + 1),
                "ит.",
                "Всего пропусков",
            ],
            ...users.underworking.map((under) => [
                under.name,
                under.missed === null ? "" : under.missed,
                ...under.date.map((d) => (d === null ? "" : d)),
                countTime(under),
                countTime(under),
            ]),
            ["отработки"],
            [
                "",
                "П/М",
                ...users.reworking[0].date.map((d, i) => i + 1),
                "ит.",
                "Всего отработок",
            ],
            ...users.reworking.map((rework) => [
                rework.name,
                rework.worked === null ? "" : rework.worked,
                ...rework.date.map((d) => (d === null ? "" : d)),
                countTime(rework),
                countTime(rework),
            ]),
        ]);
        let wb = XLSX.utils.book_new(); // создаем книгу
        const sheets = otchet.map((otc) => XLSX.utils.aoa_to_sheet(otc));
        sheets.map((w, w_i) =>
            XLSX.utils.book_append_sheet(wb, w, `${otchet[w_i][0]}`)
        ); //собираем все страницу в одну книгу
        const fileBuffer = XLSX.write(wb, { type: "binary" });
        return fileBuffer;
    };

    const handleDownload = () => {
        const fileBuffer = generateXLSXFile();
        const blob = new Blob([s2ab(fileBuffer)], {
            type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const title = `Табель рабочего времени ${
            months[currentMonth - 1].label + " " + currentYear
        }.xlsx`;
        link.setAttribute("download", title);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
        dispatch(clearStatus());
    };

    useEffect(() => {
        if (dataOtchetStatus === "resolved") handleDownload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataOtchetStatus]);

    return (
        <div className={role ? "table__data manager" : "table__data"}>
            <div className="select__date">
                <AppSelect
                    options={months}
                    currentOption={currentMonth}
                    setCurrentOption={setCurrentMonth}
                    placeholder={"Месяц"}
                />
                <AppSelect
                    options={years}
                    currentOption={currentYear}
                    setCurrentOption={setCurrentYear}
                    placeholder={"Год"}
                />
                {role && (
                    <button onClick={() => exportFile()}>
                        Выгрузить отчет
                    </button>
                )}
            </div>
            {isLoadData === "loading" ? (
                <Loader
                    type={"spinningBubbles"}
                    color={"hsla(223, 93%, 52%, 1)"}
                ></Loader>
            ) : (
                <div className="table__container">
                    <div className="monthhdata">
                        <div
                            className={
                                role
                                    ? "monthdata__missed manager"
                                    : "monthdata__missed"
                            }
                        >
                            <span
                                onClick={() => {
                                    role &&
                                        setIsOpenModalEdit({
                                            flag: true,
                                            title: "Редактировать пропуски",
                                            onChange: setIsOpenModalEdit,
                                            modalRef: modalEditRef,
                                            time: converTimeInHoursMinutes(
                                                data[1]?.missed
                                            ),
                                        });
                                }}
                            >
                                Пропусков:{" "}
                                {converTimeInHoursMinutes(data[1]?.missed)}
                            </span>
                        </div>
                        <div
                            className={
                                role
                                    ? "monthdata__worked manager"
                                    : "monthdata__worked"
                            }
                        >
                            <span
                                onClick={() => {
                                    role &&
                                        setIsOpenModalEdit({
                                            flag: true,
                                            title: "Редактировать отработки",
                                            onChange: setIsOpenModalEdit,
                                            modalRef: modalEditRef,
                                            time: converTimeInHoursMinutes(
                                                data[1]?.worked
                                            ),
                                        });
                                }}
                            >
                                Отработано:{" "}
                                {converTimeInHoursMinutes(data[1]?.worked)}
                            </span>
                        </div>
                    </div>

                    <div className="table">
                        <div
                            className={
                                role
                                    ? "table__titles manager"
                                    : "table__titles "
                            }
                        >
                            <div className="title">Дата</div>
                            <div className={role ? "title manager" : "title"}>
                                Время работы
                                {role && (
                                    <svg
                                        className={
                                            role
                                                ? "add-icon manager"
                                                : "add-icon"
                                        }
                                        onClick={() =>
                                            setIsOpenModalAdd({
                                                flag: true,
                                                title: "Добавление интервала работ",
                                                onChange: setIsOpenModalAdd,
                                                modalRef: modalAddRef,
                                                interval: {
                                                    start: "00:00",
                                                    end: "00:00",
                                                },
                                            })
                                        }
                                        viewBox="0 0 14 14"
                                    >
                                        <path d="M6 0V6H0V8H6V14H8V8H14V6H8V0H6Z" />
                                    </svg>
                                )}
                            </div>
                            <div className={role ? "title manager" : "title"}>
                                Переработки
                                <svg
                                    className={
                                        role ? "add-icon manager" : "add-icon"
                                    }
                                    onClick={() =>
                                        setIsOpenModalAdd({
                                            flag: true,
                                            title: "Добавление переработки",
                                            onChange: setIsOpenModalAdd,
                                            modalRef: modalAddRef,
                                        })
                                    }
                                    viewBox="0 0 14 14"
                                >
                                    <path d="M6 0V6H0V8H6V14H8V8H14V6H8V0H6Z" />
                                </svg>
                            </div>
                            <div className={role ? "title manager" : "title"}>
                                Недоработки{" "}
                                <svg
                                    className={
                                        role ? "add-icon manager" : "add-icon"
                                    }
                                    onClick={() =>
                                        setIsOpenModalAdd({
                                            flag: true,
                                            title: "Добавление недоработки",
                                            onChange: setIsOpenModalAdd,
                                            modalRef: modalAddRef,
                                        })
                                    }
                                    viewBox="0 0 14 14"
                                >
                                    <path d="M6 0V6H0V8H6V14H8V8H14V6H8V0H6Z" />
                                </svg>
                            </div>
                            {role && <div className="title">Отчет за день</div>}
                        </div>

                        <div className={role ? "datas manager" : "datas"}>
                            {data[0] &&
                                data[0]?.map((data, data_id) => (
                                    <>
                                        <div className="data date">
                                            {convertDate(data.date)}
                                        </div>

                                        <div
                                            className={
                                                role ? "data wtime" : "data"
                                            }
                                        >
                                            {data.worked_time?.map(
                                                (wtime, wtime_id) => (
                                                    <div
                                                        onClick={() =>
                                                            role &&
                                                            setIsOpenModalEdit({
                                                                flag: true,
                                                                title: "Редактировать время",
                                                                onChange:
                                                                    setIsOpenModalEdit,
                                                                modalRef:
                                                                    modalEditRef,
                                                                interval: {
                                                                    start: converTimeInHoursMinutes(
                                                                        wtime.start
                                                                    ),
                                                                    end: converTimeInHoursMinutes(
                                                                        wtime.end
                                                                    ),
                                                                },
                                                                date: data.date.split(
                                                                    "-"
                                                                ),
                                                                id: {
                                                                    id_date:
                                                                        data_id,
                                                                    id_time:
                                                                        wtime_id,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        {convertInterval(wtime)}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <ItemWorkTime
                                            data={data.reworked_time?.map(
                                                (rt) => ({
                                                    time: converTimeInHoursMinutes(
                                                        rt.time
                                                    ),
                                                    comment: rt.comment,
                                                    autocreater: rt.autocreater,
                                                })
                                            )}
                                            typeTime={"reworked_time"}
                                        />

                                        <ItemWorkTime
                                            data={data.underworking_time?.map(
                                                (rt) => ({
                                                    time: converTimeInHoursMinutes(
                                                        rt.time
                                                    ),
                                                    comment: rt.comment,
                                                    autocreater: rt.autocreater,
                                                })
                                            )}
                                            typeTime={"underworking_time"}
                                        />
                                        {role && (
                                            <div className="data otchet">
                                                {data.otchet?.length > 3 ? (
                                                    <>
                                                        <p className="comment">
                                                            {data.otchet[0]}
                                                        </p>
                                                        <p className="comment">
                                                            {data.otchet[1]}
                                                        </p>
                                                        <p className="comment">
                                                            {data.otchet[2]}
                                                        </p>
                                                    </>
                                                ) : (
                                                    data.otchet?.map(
                                                        (otchet) => (
                                                            <p className="comment">
                                                                {otchet}
                                                            </p>
                                                        )
                                                    )
                                                )}

                                                {data.otchet?.length > 3 && (
                                                    <button
                                                        onClick={() =>
                                                            setIsOpenModalShow({
                                                                flag: true,
                                                                title: `Отчет за ${data.date}`,
                                                                onChange:
                                                                    setIsOpenModalShow,
                                                                modalRef:
                                                                    modalShowRef,
                                                                values: data.otchet,
                                                            })
                                                        }
                                                    >
                                                        Смотреть
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ))}
                        </div>
                    </div>
                    <div className="monthhdata">
                        <div className="monthdata__missed">
                            Пропусков: {countMissed(data[0])}
                        </div>
                        <div className="monthdata__worked">
                            Отработано: {countWorked(data[0])}
                        </div>
                    </div>
                </div>
            )}
            {isOpenModalAdd.flag && (
                <ModalWindowAdd
                    title={isOpenModalAdd.title}
                    onChange={isOpenModalAdd.onChange}
                    modalRef={isOpenModalAdd.modalRef}
                    interval={isOpenModalAdd.interval}
                    id={isOpenModalAdd?.id}
                />
            )}
            {isOpenModalEdit.flag && (
                <ModalWindowEdit
                    title={isOpenModalEdit.title}
                    onChange={isOpenModalEdit.onChange}
                    modalRef={isOpenModalEdit.modalRef}
                    interval={isOpenModalEdit.interval}
                    time={isOpenModalEdit.time}
                    date={isOpenModalEdit?.date}
                    id={isOpenModalEdit?.id}
                />
            )}
            {isOpenModalShow.flag && (
                <ModalWindowShow
                    title={isOpenModalShow.title}
                    onChange={isOpenModalShow.onChange}
                    modalRef={isOpenModalShow.modalRef}
                    values={isOpenModalShow.values}
                />
            )}
            {isOpenModalAddEmployee && (
                <ModalWindowAddEmployee
                    title={"Добавление сотрудника"}
                    onChange={setIsOpenModalAddEmployee}
                    modalRef={modalAddEmployeeRef}
                />
            )}
            {isOpenModalEditEmployee && (
                <ModalWindowEditEmployee
                    title={"Редактирование сотрудника"}
                    onChange={setIsOpenModalEditEmployee}
                    modalRef={modalEditEmployeeRef}
                />
            )}
            {isOpenModalAddDepartament && (
                <ModalWindowAddDepartament
                    title={"Добавление отдела"}
                    onChange={setIsOpenModalAddDepartament}
                    modalRef={modalAddDepartamentRef}
                />
            )}
            {isOpenModalEditDepartament && (
                <ModalWindowEditDepartament
                    title={"Редактирование отдела"}
                    onChange={setIsOpenModalEditDepartament}
                    modalRef={modalEditDepartamentRef}
                />
            )}
        </div>
    );
}
