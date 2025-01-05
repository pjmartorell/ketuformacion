import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { Cross2Icon, PersonIcon } from '@radix-ui/react-icons';
import { useMusician } from '../../context/MusicianContext';
import { Musician } from '../../types/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const StyledOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.blackA8};
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1100; // Higher than toolbar
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
  z-index: 1100; // Higher than toolbar
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
  max-height: 60vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.blue[50]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.blue[200]};
    border-radius: 4px;
  }
`;

const MusicianItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[50]};
  }
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.blue[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;
  cursor: pointer;
  flex-shrink: 0;

  &:checked {
    background-color: ${({ theme }) => theme.colors.blue[500]};
    border-color: ${({ theme }) => theme.colors.blue[500]};

    &:after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:focus {
    outline: none;
  }
`;

const MusicianInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  span {
    color: ${({ theme }) => theme.colors.blue[900]};
    font-weight: 500;
  }

  small {
    color: ${({ theme }) => theme.colors.blue[600]};
    font-size: 0.9rem;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.blue[50]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
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
    onClose: () => void;
    musicians: Musician[];
    onSelect: (musicians: Musician[]) => void;
}

export const MusicianDialog: React.FC<Props> = ({ isOpen, onClose, musicians, onSelect }) => {
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
        <Dialog.Root open={isOpen}>
            <Dialog.Portal>
                <StyledOverlay />
                <StyledContent>
                    <VisuallyHidden>
                        <Dialog.Description>
                            Description goes here
                        </Dialog.Description>
                    </VisuallyHidden>
                    <HeaderSection>
                        <StyledTitle>Seleccionar Percusionistas</StyledTitle>
                        <Subtitle>Elige los integrantes para tu formación</Subtitle>
                        <CloseIcon onClick={onClose} />
                    </HeaderSection>

                    <DialogBody>
                        {musicians.map((musician) => (
                            <MusicianItem key={musician.id}>
                                <CheckboxInput
                                    type="checkbox"
                                    checked={selectedMusicians.some(m => m.id === musician.id)}
                                    onChange={() => handleSelectMusician(musician)}
                                    tabIndex={-1}
                                />
                                <MusicianInfo>
                                    <span>{musician.name}</span>
                                    <small>{musician.instrument}</small>
                                </MusicianInfo>
                            </MusicianItem>
                        ))}
                    </DialogBody>

                    <FooterSection>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" onClick={handleConfirm}>
                            Confirmar
                        </Button>
                    </FooterSection>
                </StyledContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
