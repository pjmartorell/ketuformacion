import styled, { keyframes } from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';

const overlayShow = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

export const DialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1100;
`;

export const DialogContent = styled(Dialog.Content)`
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

export const DialogHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  position: relative;
`;

export const DialogTitle = styled(Dialog.Title)`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const DialogSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.blue[100]};
  font-size: 1rem;
  max-width: 80%;
  opacity: 0.9;
`;

export const DialogBody = styled.div`
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

export const DialogFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white[100]};
  border-top: 1px solid ${({ theme }) => theme.colors.blue[100]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const DialogButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
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

export const CloseButton = styled(Dialog.Close)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 20px;
  height: 20px;
  color: white;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
