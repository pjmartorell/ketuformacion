import React, { useState } from 'react';
import { DialogContainer, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from './Dialog.styles';
import { useMusician } from '../../context/MusicianContext';
import { Musician } from '../../types/types';

interface MusicianDialogProps {
    isOpen: boolean;
    onClose: () => void;
    musicians: Musician[];
    onSelect: (musicians: Musician[]) => void;
}

export const MusicianDialog: React.FC<MusicianDialogProps> = ({ isOpen, onClose, musicians, onSelect }) => {
    const { state, dispatch } = useMusician();
    const [selectedMusicians, setSelectedMusicians] = useState<Musician[]>([]);

    const handleSelectMusician = (musician: Musician) => {
        setSelectedMusicians(prev => {
            const isSelected = prev.some(m => m.id === musician.id);
            if (isSelected) {
                return prev.filter(m => m.id !== musician.id);
            }
            return [...prev, musician];
        });
    };

    const handleConfirm = () => {
        selectedMusicians.forEach(musician => {
            dispatch({ type: 'ADD_MUSICIAN', payload: musician });
        });
        onSelect(selectedMusicians);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <DialogContainer>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Musicians</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {musicians.map((musician) => (
                        <div key={musician.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={selectedMusicians.some(m => m.id === musician.id)}
                                onChange={() => handleSelectMusician(musician)}
                            />
                            <span>{musician.name} - {musician.instrument}</span>
                        </div>
                    ))}
                </DialogBody>
                <DialogFooter>
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={onClose}>Cancel</button>
                </DialogFooter>
            </DialogContent>
        </DialogContainer>
    );
};
