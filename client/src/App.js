import { BrowserRouter, Route, Routes } from "react-router-dom";
import { authRoutes, publicRoutes } from "./utils/routes";
import Navbar from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAuthMe } from "./assets/store/slices/userSlice";
import Loader from "./components/Loader/Loader";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);

    const isAuth = useSelector((state) => state.user.isAuth);
    const role = useSelector((state) => state.user.userData.role);
    const statusAuth = useSelector((state) => state.user.status);
    return (
        <BrowserRouter>
            {statusAuth === "loading" ? (
                <Loader
                    type={"spinningBubbles"}
                    color={"hsla(223, 93%, 52%, 1)"}
                ></Loader>
            ) : (
                <Routes>
                    {isAuth && (
                        <Route
                            path={authRoutes[role].path}
                            element={<Navbar></Navbar>}
                        >
                            <Route index element={authRoutes[role].element} />

                            <Route
                                path={authRoutes[3].path}
                                element={authRoutes[3].element}
                            />
                        </Route>
                    )}
                    <Route
                        path={publicRoutes[0].path}
                        element={publicRoutes[0].element}
                    />
                    {statusAuth !== "loading" && (
                        <Route
                            path={publicRoutes[1].path}
                            element={publicRoutes[1].element}
                        />
                    )}
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;
