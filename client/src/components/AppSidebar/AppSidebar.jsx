import React from "react";
import { Link } from "react-router-dom";
import { CALENDAR_ROUTE } from "../../utils/consts";

export default function AppSidebar() {
    return (
        <div className="mysidebar">
            <Link className="mysidebar__link" to={""}>
                Табель
            </Link>
            <Link className="mysidebar__link" to={CALENDAR_ROUTE}>
                Календарь
            </Link>
        </div>
    );
}
