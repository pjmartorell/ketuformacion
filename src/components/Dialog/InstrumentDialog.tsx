import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Instrument } from '../../types/types';
import styled from 'styled-components';

const StyledOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.blackA8};
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1100;
`;

const StyledContent = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.blue[50]}, white);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg},
              0 0 0 1px rgba(0, 0, 0, 0.05),
              0 30px 60px -12px rgba(0, 0, 0, 0.15);
  padding: 0;
  overflow: hidden;
  z-index: 1100;
`;

const HeaderSection = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  position: relative;
`;

const StyledTitle = styled(Dialog.Title)`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.blue[100]};
  font-size: 1.1rem;
  max-width: 80%;
`;

const CloseIcon = styled(Cross2Icon)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 20px;
  height: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const DialogBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  color: ${({ theme }) => theme.colors.blue[900]};
  font-size: 1.1rem;
  transition: all 0.2s;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[300]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
  }

  option {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const FooterSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white[100]};
  border-top: 1px solid ${({ theme }) => theme.colors.blue[100]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${({ theme, variant = 'secondary' }) =>
    variant === 'primary'
      ? `
    background: ${theme.gradients.primary};
    color: white;
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    }
  `
      : `
    background: ${theme.colors.white[300]};
    color: ${theme.colors.blue[900]};
    &:hover {
      background: ${theme.colors.white[400]};
    }
  `}
`;

interface Props {
    isOpen: boolean;
    instruments: Instrument[];
    onClose: () => void;
    onSelect: (instrumentName: string) => void;
}

export const InstrumentDialog: React.FC<Props> = ({ isOpen, instruments, onClose, onSelect }) => {
    const [selectedInstrument, setSelectedInstrument] = React.useState('');

    const handleConfirm = () => {
        if (selectedInstrument) {
            onSelect(selectedInstrument);
            setSelectedInstrument('');
        }
    };

    const handleClose = () => {
        setSelectedInstrument('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog.Root open={isOpen}>
            <Dialog.Portal>
                <StyledOverlay />
                <StyledContent>
                    <HeaderSection>
                        <StyledTitle>Cambiar Instrumento</StyledTitle>
                        <Subtitle>Selecciona el nuevo instrumento</Subtitle>
                        <CloseIcon onClick={handleClose} />
                    </HeaderSection>

                    <DialogBody>
                        <StyledSelect
                            value={selectedInstrument}
                            onChange={(e) => setSelectedInstrument(e.target.value)}
                        >
                            <option value="">Seleccionar instrumento...</option>
                            {instruments.map((instrument) => (
                                <option key={instrument.id} value={instrument.name}>
                                    {instrument.name}
                                </option>
                            ))}
                        </StyledSelect>
                    </DialogBody>

                    <FooterSection>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={!selectedInstrument}
                        >
                            Confirmar
                        </Button>
                    </FooterSection>
                </StyledContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
