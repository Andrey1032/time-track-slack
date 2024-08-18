import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import $api from "../../../http/index";

const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const initialState = {
    data: [],
    status: "loading",
};

const otchetSlice = createSlice({
    name: "otchet",
    initialState,
    selectors: {
        selectorOtchetData: (state) => state.data,
    },
    reducers: (create) => ({
        fetchOtchet: create.asyncThunk(
            async (params) => {
                const { data } = await $api.get("/otchet", { params });
                return data;
            },
            {
                pending: (state) => {
                    state.status = "loading";
                    state.data = [];
                },
                fulfilled: (state, action) => {
                    state.status = "resolved";
                    state.data = action.payload;
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
    }),
});

export const { fetchOtchet } = otchetSlice.actions;
export const { selectorOtchetData } = otchetSlice.selectors;
export default otchetSlice.reducer;
