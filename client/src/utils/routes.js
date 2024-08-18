import EmployeePage from "../pages/EmployeePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ManagerPage from "../pages/ManagerPage/ManagerPage";
import DirectorPage from "../pages/DirectorPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import {
    CALENDAR_ROUTE,
    DIRECTOR_ROUTE,
    EMPLOYEE_ROUTE,
    LOGIN_ROUTE,
    MANAGER_ROUTE,
    NOTFOUND_ROUTE,
} from "./consts";

export const authRoutes = [
    {
        path: EMPLOYEE_ROUTE,
        element: <EmployeePage />,
    },
    {
        path: MANAGER_ROUTE,
        element: <ManagerPage />,
    },
    {
        path: DIRECTOR_ROUTE,
        element: <DirectorPage />,
    },

    {
        path: CALENDAR_ROUTE,
        element: <CalendarPage />,
    },
];

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        element: <LoginPage />,
    },
    {
        path: NOTFOUND_ROUTE,
        element: <NotFoundPage />,
    },
];
