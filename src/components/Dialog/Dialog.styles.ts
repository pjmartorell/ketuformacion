import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../../theme/theme';

const overlayShow = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const StyledOverlay = styled(Dialog.Overlay)`
  background: ${({ theme }) => theme.colors.blackA9};
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DialogContainer = styled.div<{ theme: Theme }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

export const DialogContent = styled.div<{ theme: Theme }>`
  background: ${({ theme }) => theme.colors.white[500]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 400px;
  max-width: 90vw;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const DialogBody = styled.div<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white[100]};
`;

export const DialogTitle = styled.h2<{ theme: Theme }>`
    margin: 0;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.foreground};
`;

export const DialogHeader = styled.div<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.gradients.primary};
  color: ${({ theme }) => theme.colors.white[500]};
  font-weight: bold;
`;

export const DialogFooter = styled.div<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  button {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:first-child {
      background: ${({ theme }) => theme.gradients.primary};
      color: ${({ theme }) => theme.colors.white[500]};

      &:hover {
        transform: translateY(-1px);
        box-shadow: ${({ theme }) => theme.shadows.md};
      }
    }

    &:last-child {
      background: ${({ theme }) => theme.colors.white[300]};
      color: ${({ theme }) => theme.colors.blue[900]};

      &:hover {
        background: ${({ theme }) => theme.colors.white[400]};
      }
    }
  }
`;
