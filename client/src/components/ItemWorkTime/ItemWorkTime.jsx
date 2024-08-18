import React from "react";

export default function ItemWorkTime({ data, typeTime }) {
    return (
        <div className="data">
            {data?.map((dtime, index) => (
                <div key={index} className="work__time">
                    <svg
                        className={
                            dtime.autocreater === null
                                ? "dot error"
                                : dtime.autocreater
                                ? "dot auto"
                                : "dot mehanic"
                        }
                        viewBox="0 0 16 16"
                    >
                        <circle cx="7" cy="7" r="7" />
                    </svg>

                    <div className="work__time-date">
                        <p className={typeTime}>{dtime.time}</p>
                        <p className="comment">
                            <abbr title={dtime.comment}>{dtime.comment}</abbr>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
