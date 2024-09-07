import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import $api from "../../../http/index";

const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const initialState = {
    userData: {
        role: null,
    },
    isAuth: null,
    calendarData: {
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString(),
    },
    status: "loading",
    statusFetch: null,
    errorMessage: "",
};
const userSlice = createSlice({
    name: "user",
    initialState,
    selectors: {
        selectorStatusUser: (state) => state.status,
        selectorIdUser: (state) => state.userData.id_user,
        selectorCalendarDataUser: (state) => state.calendarData,
        selectorUserRole: (state) => Boolean(state.userData.role),
    },
    reducers: (create) => ({
        exitUser: create.reducer((state) => {
            state.userData = initialState.userData;
            state.isAuth = false;
        }),
        currentCalendarDataUser: create.reducer((state, action) => {
            state.calendarData = action.payload;
        }),
        fetchAuth: create.asyncThunk(
            async (params) => {
                const { data } = await $api.post(
                    process.env.REACT_APP_LOGIN,
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
                    state.isAuth = true;
                    state.userData = {
                        ...action.payload,
                        role: 3 - action.payload.role,
                    };
                    state.dataWork = action.payload.dataWork;
                },
                rejected: (state) => {
                    state.status = "error";
                },
            }
        ),
        fetchUserData: create.asyncThunk(
            async (params) => {
                const { data } = await $api.get(process.env.REACT_APP_USER, {
                    params,
                });
                return data;
            },
            {
                pending: (state) => {
                    state.statusFetch = "loading";
                    state.dataWork=[];
                },
                fulfilled: (state, action) => {
                    state.statusFetch = "resolved";
                    state.dataWork = action.payload;
                },
                rejected: (state, action) => {
                    state.statusFetch = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        fetchAuthMe: create.asyncThunk(
            async () => {
                const { data } = await $api.get(process.env.REACT_APP_AUTH);
                return data;
            },
            {
                pending: (state) => {
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.status = "resolved";
                    state.isAuth = true;
                    state.userData = {
                        ...action.payload,
                        role: 3 - action.payload.role,
                    };
                    state.dataWork = action.payload.dataWork;
                },
                rejected: (state, action) => {
                    state.status = "error";
                    state.isAuth = false;
                    state.errorMessage = action;
                },
            }
        ),
    }),
});

export const {
    exitUser,
    fetchAuth,
    fetchUserData,
    fetchAuthMe,
    currentCalendarDataUser,
} = userSlice.actions;
export const {
    selectorStatusUser,
    selectorIdUser,
    selectorCalendarDataUser,
    selectorUserRole,
} = userSlice.selectors;
export default userSlice.reducer;
