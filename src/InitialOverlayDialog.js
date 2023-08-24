import React, { useState } from 'react';
import './InitialOverlayDialog.css';
const InitialOverlayDialog = () => {
    const [showDialog, setShowDialog] = useState(true);
    const [hideDialogForever, setHideDialogForever] = useState(false);

    const handleConfirm = () => {
        setShowDialog(false);
        if (hideDialogForever) {
            localStorage.setItem('hideInitialDialog', 'true');
        }
    };

    const handleClose = () => {
        setShowDialog(false);
    };

    if (!showDialog) {
        return null;
    }

    return (
        <div className="initial-overlay-dialog">
            <div className="dialog-content">
                <h2>Primeros pasos!</h2>
                <p>Para diseñar una formación para tu bolo, dirígete al menú principal y selecciona la opción "Percusionistas". En la ventana emergente, elige a las personas que deseas añadir o eliminar de tu diseño. Las personas seleccionadas se añadirán al lienzo y podrás moverlas libremente arrastrándolas.</p>
                <p>Si deseas eliminar a una persona directamente desde el lienzo, realiza un doble clic sobre la persona. Aparecerá un menú en el que debes seleccionar la opción de "Eliminar".</p>
                <p>Si deseas cambiar el instrumento de una persona, sigue los mismos pasos anteriores y en el menú emergente selecciona "Cambiar instrumento". Aparecerá una ventana emergente donde podrás elegir el instrumento que deseas asignarle a esa persona.</p>
                <p>Por último, si deseas exportar el diseño como una imagen, ve al menú principal y selecciona la opción "Exportar imagen".</p>

                <div className="bottom-controls">
                    <button className="confirm-button" onClick={handleConfirm}>Entendido</button>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            className="hide-dialog-checkbox"
                            checked={hideDialogForever}
                            onChange={() => setHideDialogForever(!hideDialogForever)}
                        />
                        No volver a mostrar
                    </label>
                </div>
            </div>
        </div>
    );
};

export default InitialOverlayDialog;
