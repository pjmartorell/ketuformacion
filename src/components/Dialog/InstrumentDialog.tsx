import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Instrument } from '../../types/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  max-width: 400px;
  background: ${({ theme }) => theme.colors.white[500]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
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
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const CloseIcon = styled(Cross2Icon)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const InstrumentList = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const InstrumentButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white[100]};
  border: 2px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[700]};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[50]};
    border-color: ${({ theme }) => theme.colors.blue[500]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface Props {
  isOpen: boolean;
  instruments: Instrument[];
  onClose: () => void;
  onSelect: (instrument: string) => void;
}

export const InstrumentDialog: React.FC<Props> = ({ isOpen, instruments, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent>
          <Dialog.Description asChild>
            <VisuallyHidden>
              Selecciona el instrumento para el músico
            </VisuallyHidden>
          </Dialog.Description>
          <HeaderSection>
            <StyledTitle>Seleccionar Instrumento</StyledTitle>
            <CloseIcon onClick={onClose} />
          </HeaderSection>
          <InstrumentList>
            {instruments.map(instrument => (
              <InstrumentButton
                key={instrument.id}
                onClick={() => {
                  onSelect(instrument.name);
                  onClose();
                }}
              >
                {instrument.name}
              </InstrumentButton>
            ))}
          </InstrumentList>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
