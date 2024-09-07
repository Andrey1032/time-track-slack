import React, { useState } from "react";
import AppSelect from "../AppSelect/AppSelect";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteDepartment,
    editDepartment,
    selectorCurrentDep,
    selectorDepartaments,
} from "../../assets/store/slices/employeesSlice";

export default function ModalWindowEditDepartament({
    title,
    onChange,
    modalRef,
}) {
    const dispatch = useDispatch();
    const currentDep = useSelector(selectorCurrentDep);
    const departament = useSelector(selectorDepartaments)[currentDep];

    const [currentEmp, setCurrentEmp] = useState(
        departament.userIdUser?.toString()
    );
    const [nameDepartament, setnameDepartament] = useState(departament.title);
    const [slackChanel, setSlackChanel] = useState(departament.slack);
    const options = departament.users.map((user, user_id) => ({
        label: user.name + " " + user.surname,
        value: user.id_user.toString(),
    }));
    const handleClick = () => {
        dispatch(
            editDepartment({
                id: departament.id_department,
                params: {
                    name_department: nameDepartament,
                    slack: slackChanel,
                    userIdUser: Number(currentEmp),
                },
            })
        );
    };
    return (
        <form>
        <div className="modal-window employee" ref={modalRef}>
            <div className="modal-content">
                <p className="title">{title}</p>

                <p className="subtitle">Данные отдела</p>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={nameDepartament}
                        onChange={(e) => setnameDepartament(e.target.value)}
                    />
                    <label className="form__label">Название отдела</label>
                </div>

                <div className="form__group">
                    <input
                        className="form__input"
                        type="text"
                        placeholder=" "
                        value={slackChanel}
                        onChange={(e) => setSlackChanel(e.target.value)}
                    />
                    <label className="form__label">Канал в Slack</label>
                </div>

                <p className="subtitle">Руководитель</p>

                <div className="select">
                    <AppSelect
                        options={options}
                        currentOption={currentEmp}
                        setCurrentOption={setCurrentEmp}
                        placeholder={"Выберете сотрудника"}
                    />
                </div>
            </div>
            <div className="modal-buttons">
                <div
                    className="modal-button-1"
                    onClick={() => {
                        if (departament.users.length > 0)
                            return alert(
                                `Пока ${nameDepartament} в есть сотрудники вы не можете его удалить!`
                            );
                        if (
                            // eslint-disable-next-line no-restricted-globals
                            confirm(
                                `Вы уверены что хотите удалить ${nameDepartament}`
                            )
                        ) {
                            onChange(false);
                            dispatch(
                                deleteDepartment(departament.id_department)
                            );
                        }
                    }}
                >
                    Удалить
                </div>
                <div
                    className="modal-button-2"
                    onClick={() => {
                        onChange(false);
                    }}
                >
                    Отмена
                </div>
                <div
                    className="modal-button-3"
                    onClick={() => {
                        onChange(false);
                        handleClick();
                    }}
                >
                    Сохранить
                </div>
            </div>
        </div></form>
    );
}
