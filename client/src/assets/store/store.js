import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import calendarSlice from "./slices/calendarSlice";
import employeesSlice from "./slices/employeesSlice";
import otchetSlice from "./slices/otchetSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        employees: employeesSlice,
        calendar: calendarSlice,
        otchet: otchetSlice,
    },
});

export default store;
