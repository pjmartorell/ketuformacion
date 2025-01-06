import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import styled from 'styled-components';
import {
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogSubtitle,
  DialogBody,
  DialogFooter,
  DialogButton,
  CloseButton
} from './Dialog.styles';
import { Musician } from '../../types/types';
import { storageService } from '../../services/storage';
import { MusicianForm } from './MusicianForm';

const MusicianItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.blue[100]};

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.blue[300]};
    box-shadow: ${({ theme }) => theme.shadows.sm};
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

const ActionButton = styled(DialogButton)`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.blue[50]};
  color: ${({ theme }) => theme.colors.blue[600]};
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[100]};
    color: ${({ theme }) => theme.colors.blue[700]};
    border-color: ${({ theme }) => theme.colors.blue[300]};
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

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface DeleteWarningProps {
  isOpen: boolean;
  musician: Musician;
  isInUse: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteWarning: React.FC<DeleteWarningProps> = ({ isOpen, musician, isInUse, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <VisuallyHidden>
            <Dialog.Description>
              Confirma si deseas eliminar al músico {musician.name}
            </Dialog.Description>
          </VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Eliminar Músico</DialogTitle>
            <CloseButton onClick={onCancel}>
              <Cross2Icon />
            </CloseButton>
          </DialogHeader>
          <DialogBody>
            <p>¿Estás seguro de que quieres eliminar a {musician.name}?</p>
            {isInUse && (
              <WarningMessage>
                ⚠️ Este músico está presente en el canvas actual.
                Si continúas, será eliminado de la formación.
              </WarningMessage>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogButton onClick={onCancel}>Cancelar</DialogButton>
            <DialogButton variant="primary" onClick={onConfirm}>Confirmar</DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const WarningMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.blue[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.blue[700]};
`;

interface EditDialogProps {
  isOpen: boolean;
  musician?: Musician;
  instruments: string[];
  onClose: () => void;
  onSave: (musician: Partial<Musician>, imageFile?: File) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, musician, instruments, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <VisuallyHidden>
            <Dialog.Description>
              {musician ? `Editar músico ${musician.name}` : 'Añadir nuevo músico'}
            </Dialog.Description>
          </VisuallyHidden>
          <DialogHeader>
            <DialogTitle>{musician ? 'Editar' : 'Nuevo'} Músico</DialogTitle>
            <CloseButton onClick={onClose}>
              <Cross2Icon />
            </CloseButton>
          </DialogHeader>
          <DialogBody>
            <MusicianForm
              musician={musician}
              instruments={instruments || []} // Provide default empty array
              onSubmit={onSave}
              id="musician-form"
            />
          </DialogBody>
          <DialogFooter>
            <DialogButton onClick={onClose}>Cancelar</DialogButton>
            <DialogButton variant="primary" type="submit" form="musician-form">
              Guardar
            </DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  musicians: Musician[];
  onSelect: (musicians: Musician[]) => void;
  currentMusicians: Musician[];
  onMusicianDeleted: (musicianId: number) => void;
  instruments: string[];
  onEdit: (musician: Musician) => void;
  editDialog: { isOpen: boolean; musician?: Musician };
  onEditDialogClose: () => void;
  onSave: (musician: Partial<Musician>, imageFile?: File) => void;
}

export const MusicianDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  musicians,
  onSelect,
  currentMusicians,
  onMusicianDeleted,
  instruments,
  onEdit,
  editDialog,
  onEditDialogClose,
  onSave
}) => {
  const [selectedMusicians, setSelectedMusicians] = useState<Musician[]>([]);
  const [deleteWarning, setDeleteWarning] = useState<{ isOpen: boolean; musician?: Musician, isInUse?: boolean }>({
    isOpen: false,
    musician: undefined,
    isInUse: false,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedMusicians(currentMusicians);
    }
  }, [isOpen, currentMusicians]);

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
    onSelect(selectedMusicians);
    onClose();
  };

  const handleDelete = async (musician: Musician) => {
    const isInUse = currentMusicians.some(m => m.id === musician.id);
    setDeleteWarning({ isOpen: true, musician, isInUse });
  };

  const handleConfirmDelete = () => {
    if (deleteWarning.musician) {
      const updatedMusicians = musicians.filter(m => m.id !== deleteWarning.musician?.id);
      storageService.saveMusicians(updatedMusicians);
      onMusicianDeleted(deleteWarning.musician.id);
      setDeleteWarning({ isOpen: false, musician: undefined, isInUse: false });
    }
  };

  const handleEdit = (musician: Musician) => {
    onEdit(musician);
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <VisuallyHidden>
            <Dialog.Description>
              Selecciona los músicos para tu formación. Puedes editar, eliminar o añadir nuevos músicos.
            </Dialog.Description>
          </VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Seleccionar Percusionistas</DialogTitle>
            <DialogSubtitle>Elige los integrantes para tu formación</DialogSubtitle>
            <CloseButton onClick={onClose}>
              <Cross2Icon />
            </CloseButton>
          </DialogHeader>

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
                <ActionButtons>
                  <ActionButton onClick={() => handleEdit(musician)} title="Editar">
                    <Pencil1Icon />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(musician)} title="Eliminar">
                    <TrashIcon />
                  </ActionButton>
                </ActionButtons>
              </MusicianItem>
            ))}
          </DialogBody>

          <DialogFooter>
            <DialogButton onClick={onClose}>Cancelar</DialogButton>
            <DialogButton variant="primary" onClick={handleConfirm}>
              Confirmar
            </DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog.Portal>
      <DeleteWarning
        isOpen={deleteWarning.isOpen}
        musician={deleteWarning.musician!}
        isInUse={deleteWarning.isInUse!}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteWarning({ isOpen: false, musician: undefined, isInUse: false })}
      />
      <EditDialog
        isOpen={editDialog.isOpen}
        musician={editDialog.musician}
        instruments={instruments}
        onClose={onEditDialogClose}
        onSave={onSave}
      />
    </Dialog.Root>
  );
};
