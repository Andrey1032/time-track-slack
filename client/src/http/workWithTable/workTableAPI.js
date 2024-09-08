import store from "../../assets/store/store";
import $api from "..";
import { updateStatusUpdate } from "../../assets/store/slices/employeesSlice";

//обновление списаний по переработки и недоработки за месяц
export const createWrittenOffTime = async (body) => {
    let data;
    store.dispatch(updateStatusUpdate("loading"));
    $api.post(process.env.REACT_APP_WRITTEN_OFF_TIME, body)
        .then((response) => {
            data = response.data;
            store.dispatch(updateStatusUpdate("resolved"));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(updateStatusUpdate("resolved"));
        });
    return data;
};

//создание переработки и недоработки за опр дату
export const createUnderworking = async (body) => {
    let data;
    store.dispatch(updateStatusUpdate("loading"));

    $api.post(process.env.REACT_APP_UNDERWORKING, body)
        .then((response) => {
            data = response.data;
            store.dispatch(updateStatusUpdate("resolved"));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(updateStatusUpdate("resolved"));
        });
    return data;
};

export const createReworking = async (body) => {
    let data;
    store.dispatch(updateStatusUpdate("loading"));

    $api.post(process.env.REACT_APP_REWORKING, body)
        .then((response) => {
            data = response.data;
            store.dispatch(updateStatusUpdate("resolved"));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(updateStatusUpdate("resolved"));
        });
    return data;
};

//Создание времени работы за определенную дату
export const createWorkingHours = async (body) => {
    let data;
    store.dispatch(updateStatusUpdate("loading"));

    $api.post(process.env.REACT_APP_WORKING_HOURS, body)
        .then((response) => {
            data = response.data;
            store.dispatch(updateStatusUpdate("resolved"));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(updateStatusUpdate("resolved"));
        });
    return data;
};
//Редактирование времени работы за определенную дату
export const updateWorkingHours = async ({ params, body }) => {
    let data;
    store.dispatch(updateStatusUpdate("loading"));
    console.log(params, body)
    $api.put(
        `${process.env.REACT_APP_WORKING_HOURS}/${params.year}/${params.month}/${params.day}`,
        body
    )
        .then((response) => {
            data = response.data;
            store.dispatch(updateStatusUpdate("resolved"));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(updateStatusUpdate("resolved"));
        });
    return data;
};
//Удаление времени работы за определенную дату
export const deleteWorkingHours = async ({ params, body }) => {
    let data;
    store.dispatch(updateStatusUpdate("loading"));
    $api.put(
        `${process.env.REACT_APP_WORKING_HOURS_DELETE}/${params.year}/${params.month}/${params.day}`,
        body
    )
        .then((response) => {
            data = response.data;
            store.dispatch(updateStatusUpdate("resolved"));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(updateStatusUpdate("resolved"));
        });
    return data;
};
