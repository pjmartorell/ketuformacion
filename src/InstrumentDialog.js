import React from 'react';
import './InstrumentDialog.css';
const InstrumentDialog = ({ isOpen, instruments, onClose, onSelect }) => {
    return (

        <div className={`instrument-dialog-overlay ${isOpen ? 'open' : ''}`}>
            <div className="instrument-dialog">
                <h2>Instrumento</h2>
                <select onChange={(e) => onSelect(e.target.value)}>
                    <option value="">Selecciona un instrumento...</option>
                    {instruments.map((instrument) => (
                        <option key={instrument.id} value={instrument.name}>
                            {instrument.name}
                        </option>
                    ))}
                </select>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default InstrumentDialog;
