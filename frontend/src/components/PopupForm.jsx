import React from "react";

// PopupForm now supports show/hide and close
export default function PopupForm({ show, onClose, children }) {
    if (!show) return null; // Not visible

    // Simple overlay and popup style
    return (
        <form id="popup">
            <div id="popup-background"
                style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.4)", zIndex: 1000
                }}
                onClick={onClose} // Click overlay to close
            />
            <div id="popup-box"
                style={{
                    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    background: "#fff", padding: 24, borderRadius: 8, zIndex: 1001, minWidth: 320
                }}
            >
                <button 
                    className="btn-close"
                    style={{ position: "absolute", top: 8, right: 8 }} 
                    onClick={onClose}
                ></button>
                <div id="popup-form" 
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "20px",
                    }}
                >
                {children}
                </div>
            </div>
        </form>
    );
} 