import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import $api from "../../../http/index";

const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const initialState = {
    employees: {
        title: "",
        users: [],
    },
    currentEmp: 0,
    calendarData: {
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString(),
    },
    currentDep: 0,
    userData: null,
    status: null,
    statusReload: null,
    statusUpdate: "resolved",
    statusStart: null,
};
const userSlice = createSlice({
    name: "employees",

    initialState,

    selectors: {
        selectorEmployees: (state) => state.employees.users,
        selectorDepartaments: (state) => state.employees,
        selectorCurrentEmployee: (state) => state.currentEmp,
        selectorCurrentDep: (state) => state.currentDep,
        selectorDataEmployee: (state) => state.userData,
        selectorStatusReload: (state) => state.statusReload,
        selectorStatus: (state) => state.status,
        selectorStatusUpdate: (state) => state.statusUpdate,
        selectorCalendarData: (state) => state.calendarData,
    },

    reducers: (create) => ({
        exitEmp: create.reducer((state) => {
            state.employees = initialState.employees;
            state.currentEmp = 0;
            state.currentDep = 0;
            state.userData = null;
            state.status = null;
            state.statusReload = null;
        }),
        updateStatusUpdate: create.reducer((state, action) => {
            state.statusUpdate = action.payload;
        }),
        currentCalendarData: create.reducer((state, action) => {
            state.calendarData = action.payload;
        }),
        deleteDepartment: create.asyncThunk(
            async (params) => {
                const { data } = await $api.delete(
                    `${process.env.REACT_APP_DEPARTAMENT}/${params}`
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = null;
                    state.statusReload = "loading";
                },
                fulfilled: (state, action) => {
                    state.statusReload = "resolved";
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        addDepartment: create.asyncThunk(
            async (params) => {
                const { data } = await $api.post(
                    process.env.REACT_APP_DEPARTAMENT,
                    params
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = null;
                    state.statusReload = "loading";
                },
                fulfilled: (state, action) => {
                    state.statusReload = "resolved";
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        editDepartment: create.asyncThunk(
            async (params) => {
                const { data } = await $api.put(
                    `${process.env.REACT_APP_DEPARTAMENT}/${params.id}`,
                    params.params
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = null;
                    state.statusReload = "loading";
                },
                fulfilled: (state, action) => {
                    state.statusReload = "resolved";
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        deleteEmployee: create.asyncThunk(
            async (id_user) => {
                const { data } = await $api.delete(
                    `${process.env.REACT_APP_USER}/${id_user}`
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = null;
                    state.statusReload = "loading";
                },
                fulfilled: (state, action) => {
                    state.statusReload = "resolved";
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),

        addEmployee: create.asyncThunk(
            async (params) => {
                const { data } = await $api.post(
                    process.env.REACT_APP_REG,
                    params
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = null;
                    state.statusReload = "loading";
                },
                fulfilled: (state, action) => {
                    state.statusReload = "resolved";
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        editEmployee: create.asyncThunk(
            async (params) => {
                const { data } = await $api.put(
                    `${process.env.REACT_APP_USER}/${params.id}`,
                    params.params
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = null;
                    state.statusReload = "loading";
                },
                fulfilled: (state, action) => {
                    state.statusReload = "resolved";
                },
                rejected: (state, action) => {
                    state.statusReload = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),

        currentEmp: create.reducer((state, action) => {
            state.currentEmp = action.payload;
        }),
        currentDep: create.reducer((state, action) => {
            state.currentDep = action.payload;
        }),
        fetchUserData: create.asyncThunk(
            async (params) => {
                const { data } = await $api.get(process.env.REACT_APP_USER, {
                    params,
                });
                return data;
            },
            {
                pending: (state) => {
                    state.status = "loading";
                    state.userData = null;
                },
                fulfilled: (state, action) => {
                    state.status = "resolved";
                    state.userData = action.payload;
                },
                rejected: (state, action) => {
                    state.status = "error";
                    state.errorMessage = action.payload;
                },
            }
        ),
        fetchEmployees: create.asyncThunk(
            async (params) => {
                const { data } = await $api.get(
                    process.env.REACT_APP_DEPARTAMENT,
                    { params }
                );
                return data;
            },
            {
                pending: (state) => {
                    state.status = "loading";
                    state.statusStart = false;
                },
                fulfilled: (state, action) => {
                    state.status = "resolved";
                    state.employees = action.payload;
                    state.statusStart = true;
                },
                rejected: (state, action) => {
                    state.status = "error";
                    state.errorMessage = action.payload;
                    state.statusStart = false;
                },
            }
        ),
    }),
});

export const {
    exitEmp,
    currentCalendarData,
    currentEmp,
    currentDep,
    fetchEmployees,
    fetchUserData,
    addDepartment,
    editDepartment,
    deleteDepartment,
    addEmployee,
    editEmployee,
    deleteEmployee,
    updateStatusUpdate,
} = userSlice.actions;
export const {
    selectorEmployees,
    selectorCurrentEmployee,
    selectorCurrentDep,
    selectorDataEmployee,
    selectorDepartaments,
    selectorStatus,
    selectorStatusReload,
    selectorCalendarData,
    selectorStatusUpdate,
} = userSlice.selectors;
export default userSlice.reducer;
