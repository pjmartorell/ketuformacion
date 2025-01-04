import React, { useState } from 'react';
import { DialogContainer, DialogContent } from './Dialog.styles';
import styled from 'styled-components';

const DialogBody = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
    margin-top: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
`;

export const InitialOverlayDialog: React.FC = () => {
    const [showDialog, setShowDialog] = useState(true);
    const [hideDialogForever, setHideDialogForever] = useState(false);

    const handleConfirm = () => {
        setShowDialog(false);
        if (hideDialogForever) {
            localStorage.setItem('hideInitialDialog', 'true');
        }
    };

    if (!showDialog) return null;

    return (
        <DialogContainer>
            <DialogContent>
                <h2>Primeros pasos!</h2>
                <DialogBody>
                    <p>Para diseñar una formación para tu bolo, dirígete al menú principal y selecciona la opción "Percusionistas".</p>
                    <p>En la ventana emergente, elige a las personas que deseas añadir o eliminar de tu diseño.</p>
                    <p>Las personas seleccionadas se añadirán al lienzo y podrás moverlas libremente arrastrándolas.</p>
                    <CheckboxLabel>
                        <input
                            type="checkbox"
                            checked={hideDialogForever}
                            onChange={() => setHideDialogForever(!hideDialogForever)}
                        />
                        No volver a mostrar
                    </CheckboxLabel>
                    <Button onClick={handleConfirm}>Entendido</Button>
                </DialogBody>
            </DialogContent>
        </DialogContainer>
    );
};
