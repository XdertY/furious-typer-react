import React from 'react'
import './modal.css'

export const Dialog = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <>
            <div className={show ? "modal-overlay" : ""} />
                <div className={showHideClassName}>
                    <section className="modal-main">
                        <button className="close-button" id="close-button" onClick={handleClose}>X</button>
                        {children}
                        <button className="try-again-button" onClick={handleClose}>Try Again</button>
                    </section>
                </div>
        </>
    )
}
