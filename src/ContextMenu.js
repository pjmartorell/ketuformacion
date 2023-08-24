import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ position, onOptionSelected, deleteDisabled }) => {
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
                <li onClick={handleOptionSelected("change_instrument")}>Cambiar instrumento</li>
                {!deleteDisabled && (
                    <li onClick={handleOptionSelected("delete_player")}>Eliminar</li>
                )}
            </ul>
        </div>
    );
};

export default ContextMenu;
