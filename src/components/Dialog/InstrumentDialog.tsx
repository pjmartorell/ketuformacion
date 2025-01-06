import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import styled from 'styled-components';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Instrument } from '../../types/types';
import {
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  CloseButton
} from './Dialog.styles';

const InstrumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const InstrumentButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[700]};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[50]};
    border-color: ${({ theme }) => theme.colors.blue[500]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
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
        <DialogOverlay />
        <DialogContent>
          <Dialog.Description asChild>
            <VisuallyHidden>
              Selecciona el instrumento para el músico
            </VisuallyHidden>
          </Dialog.Description>
          <DialogHeader>
            <DialogTitle>Seleccionar Instrumento</DialogTitle>
            <CloseButton onClick={onClose}>
              <Cross2Icon />
            </CloseButton>
          </DialogHeader>
          <DialogBody>
            <InstrumentGrid>
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
            </InstrumentGrid>
          </DialogBody>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
