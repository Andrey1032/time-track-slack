import React from "react";

export default function ModalWindowShow({ title, onChange, modalRef, values }) {
    return (
        <form className="form">
            <div className="modal-window" ref={modalRef}>
                <div className="modal-content">
                    <p className="title">{title} </p>
                    {values.map((value) => (
                        <p className="value-text">{value}</p>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button
                        type="button"
                        className="modal-button-3"
                        onClick={() => {
                            onChange(false);
                        }}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </form>
    );
}
