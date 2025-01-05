import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { Cross2Icon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { CanvasDesign } from '../../types/types';
import { useToast } from '../../context/ToastContext';
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
  max-width: 600px;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.blue[50]}, white);
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
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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

const SaveSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Input = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: ${({ theme }) => theme.shadows.highlight};
  }
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

const DesignsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.sm};

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

const DesignItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const DesignInfo = styled.div`
  flex: 1;
`;

const DesignName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.blue[900]};
`;

const DesignDate = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.blue[600]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.blue[50]};
  color: ${({ theme }) => theme.colors.blue[600]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[100]};
    color: ${({ theme }) => theme.colors.blue[700]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    designs: CanvasDesign[];
    onLoad: (design: CanvasDesign) => void;
    onSave: (name: string) => void;
    onDelete: (id: string) => void;
    currentDesign?: CanvasDesign;
}

export const CanvasDesignsDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    designs,
    onLoad,
    onSave,
    onDelete,
    currentDesign
}) => {
    const [newDesignName, setNewDesignName] = useState('');
    const { showToast } = useToast();

    const handleSave = () => {
        if (!newDesignName.trim()) {
            showToast({
                title: 'Error',
                description: 'Por favor, introduce un nombre para el diseño',
                type: 'error'
            });
            return;
        }

        onSave(newDesignName);
        setNewDesignName('');
        showToast({
            title: 'Éxito',
            description: 'Diseño guardado correctamente',
            type: 'success'
        });
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    // Sort designs by updatedAt in descending order
    const sortedDesigns = [...designs].sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <Dialog.Root open={isOpen}>
            <Dialog.Portal>
                <StyledOverlay />
                <StyledContent>
                    <Dialog.Description asChild>
                        <VisuallyHidden>
                            Gestiona tus diseños guardados. Aquí puedes guardar el diseño actual,
                            cargar diseños existentes o eliminarlos.
                        </VisuallyHidden>
                    </Dialog.Description>

                    <HeaderSection>
                        <StyledTitle>Mis Diseños</StyledTitle>
                        <CloseIcon onClick={onClose} />
                    </HeaderSection>

                    <DialogBody>
                        <SaveSection>
                            <Input
                                type="text"
                                value={newDesignName}
                                onChange={(e) => setNewDesignName(e.target.value)}
                                placeholder="Nombre del diseño..."
                            />
                            <Button variant="primary" onClick={handleSave}>
                                Guardar diseño actual
                            </Button>
                        </SaveSection>

                        <DesignsList>
                            {sortedDesigns.map((design) => (
                                <DesignItem key={design.id}>
                                    <DesignInfo>
                                        <DesignName>{design.name}</DesignName>
                                        <DesignDate>
                                            Modificado: {formatDate(design.updatedAt)}
                                        </DesignDate>
                                    </DesignInfo>
                                    <ActionButtons>
                                        <ActionButton
                                            onClick={() => onLoad(design)}
                                            title="Cargar diseño"
                                        >
                                            <Pencil1Icon />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={() => onDelete(design.id)}
                                            title="Eliminar diseño"
                                        >
                                            <TrashIcon />
                                        </ActionButton>
                                    </ActionButtons>
                                </DesignItem>
                            ))}
                        </DesignsList>
                    </DialogBody>
                </StyledContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
