import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { Cross2Icon, ArrowRightIcon } from '@radix-ui/react-icons';

const StyledOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.blackA8};
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
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
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    outline: none;
  }
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
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: white;
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

  > p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.blue[900]};
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: ${({ theme }) => theme.colors.blue[100]};
    color: ${({ theme }) => theme.colors.blue[700]};
    border-radius: 50%;
    font-weight: 600;
    flex-shrink: 0;
  }
`;

const CheckboxContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.blue[100]};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.blue[700]};
  font-size: 0.95rem;
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

const Button = styled.button`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const StyledDescription = styled(Dialog.Description)`
  display: none; // Hide visually but keep for accessibility
`;

export const InitialOverlayDialog: React.FC = () => {
  const [showDialog, setShowDialog] = useState(true);
  const [hideDialogForever, setHideDialogForever] = useState(false);

  const handleConfirm = () => {
    if (hideDialogForever) {
      localStorage.setItem('hideInitialDialog', 'true');
    }
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <Dialog.Root open={showDialog}>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent>
          <HeaderSection>
            <StyledTitle>¡Primeros pasos!</StyledTitle>
            <Subtitle>Guía rápida para crear formaciones</Subtitle>
            <CloseIcon onClick={() => setShowDialog(false)} />
          </HeaderSection>

          <StyledDescription>
            Guía rápida para crear formaciones
          </StyledDescription>

          <DialogBody>
            <Step>
              <span>1</span>
              <p>Dirígete al menú principal y selecciona la opción "Percusionistas"</p>
            </Step>
            <Step>
              <span>2</span>
              <p>En la ventana emergente, elige a las personas que deseas añadir o eliminar de tu diseño</p>
            </Step>
            <Step>
              <span>3</span>
              <p>Las personas seleccionadas se añadirán al lienzo y podrás moverlas libremente arrastrándolas</p>
            </Step>
            <CheckboxContainer>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  checked={hideDialogForever}
                  onChange={() => setHideDialogForever(!hideDialogForever)}
                />
                No volver a mostrar
              </CheckboxLabel>
            </CheckboxContainer>
            <Button onClick={handleConfirm}>
              Entendido
            </Button>
          </DialogBody>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
