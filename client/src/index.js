import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/style.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./assets/store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
