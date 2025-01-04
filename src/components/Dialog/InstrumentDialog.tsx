import React from 'react';
import { Instrument } from '../../types/types';
import { DialogContainer, DialogContent, DialogHeader, DialogBody, DialogFooter } from './Dialog.styles';

interface Props {
    isOpen: boolean;
    instruments: Instrument[];
    onClose: () => void;
    onSelect: (instrumentName: string) => void;
}

export const InstrumentDialog: React.FC<Props> = ({ isOpen, instruments, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <DialogContainer>
            <DialogContent>
                <DialogHeader>Instrumento</DialogHeader>
                <DialogBody>
                    <select onChange={(e) => onSelect(e.target.value)} className="instrument-select">
                        <option value="">Seleccionar instrumento...</option>
                        {instruments.map((instrument) => (
                            <option key={instrument.id} value={instrument.name}>
                                {instrument.name}
                            </option>
                        ))}
                    </select>
                </DialogBody>
                <DialogFooter>
                    <button onClick={onClose}>Cancelar</button>
                </DialogFooter>
            </DialogContent>
        </DialogContainer>
    );
};
