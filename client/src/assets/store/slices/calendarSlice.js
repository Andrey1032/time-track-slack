import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import $api from "../../../http/index";
import { calendar } from "../../temp/data";

const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const initialState = {
    calendar: [],
    status: "loading",
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    selectors: {
        selectorCalendar: (state) => state.calendar,
    },
    reducers: (create) => ({

        fetchCalendars: create.asyncThunk(
            async (params) => {
                const { data } = await $api.get(
                    process.env.REACT_APP_CALENDAR,
                    { params }
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.status = "resolved";
                    state.calendar = action.payload;
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        loadCalendar: create.asyncThunk(
            async (params) => {
                const { data } = await $api.post(
                    process.env.REACT_APP_CALENDAR,
                    params
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.status = "resolved";
                    state.calendar = action.payload;
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
    }),
});

export const { fetchCalendars, loadCalendar } = calendarSlice.actions;
export const { selectorCalendar } = calendarSlice.selectors;
export default calendarSlice.reducer;
