import React, { useEffect, useState } from "react";
import AppSelect from "../../components/AppSelect/AppSelect";
import AppCalendar from "../../components/AppCalendar/AppCalendar";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCalendars,
    loadCalendar,
    selectorCalendar,
} from "../../assets/store/slices/calendarSlice";
import { useParams } from "react-router-dom";

export default function CalendarPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const calendar = useSelector(selectorCalendar);
    const thisYear = new Date().getFullYear();
    const [currentOption, setCurrentOption] = useState(thisYear.toString());

    useEffect(() => {
        dispatch(fetchCalendars({ year: currentOption }));
    }, [currentOption]);
    const [years] = useState([
        {
            value: (thisYear - 1).toString(),
            label: (thisYear - 1).toString(),
        },
        {
            value: thisYear.toString(),
            label: thisYear.toString(),
        },
        {
            value: (thisYear + 1).toString(),
            label: (thisYear + 1).toString(),
        },
    ]);

    const readJsonFile = (file) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                if (event.target) {
                    resolve(JSON.parse(event.target.result));
                }
            };

            fileReader.onerror = (error) => reject(error);
            fileReader.readAsText(file);
        });

    const handleFileChange = async (event) => {
        if (event.target.files) {
            const parsedData = await readJsonFile(event.target.files[0]);

            dispatch(loadCalendar({ calendar: parsedData }));
        }
    };

    return (
        <div className="calendar__page">
            <div className="data_file">
                <div className="select_file">
                    <AppSelect
                        options={years}
                        currentOption={currentOption}
                        setCurrentOption={setCurrentOption}
                        placeholder={"Год"}
                    />
                    {params?.dep && (
                        <div>
                            <input
                                type="file"
                                id="uploadBtn"
                                accept=".json,application/json"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="uploadBtn" className="uploadBtn">
                                Загрузить файл
                            </label>
                        </div>
                    )}
                </div>
            </div>
            <div className="calendar">
                {calendar?.months?.length > 0 ? (
                    <AppCalendar calendar={calendar}></AppCalendar>
                ) : (
                    <h3>Календарь не загружен!</h3>
                )}{" "}
            </div>
        </div>
    );
}
