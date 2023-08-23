import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ position, onOptionSelected }) => {
    const handleOptionSelected = option => (e) => onOptionSelected(e, option);

    return (
        <div
            className="menu"
            style={{
                position: "absolute",
                left: position.x,
                top: position.y
            }}
        >
            <ul>
                <li onClick={handleOptionSelected("delete_player")}>Eliminar</li>
                <li onClick={handleOptionSelected("change_instrument")}>Cambiar instrumento</li>
            </ul>
        </div>
    );
};

export default ContextMenu;
