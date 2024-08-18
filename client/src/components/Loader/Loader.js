import React from "react";
import ReactLoading from "react-loading";

const Loader = ({ type, color, height, width }) => {
    return (
        <ReactLoading
            className={"loader"}
            type={type}
            color={color}
            height={height || "15%"}
            width={width || "15%"}
        />
    );
};

export default Loader;
