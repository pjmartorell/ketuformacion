import styled from 'styled-components';

export const ToolbarWrapper = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  z-index: 1000;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
`;

export const ToolButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: ${({ active, theme }) =>
    active ? theme.gradients.primary : 'transparent'};
  color: ${({ active, disabled, theme }) =>
    active
      ? theme.colors.white[500]
      : disabled
        ? theme.colors.blue[300]
        : theme.colors.blue[700]};
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${({ active, theme }) =>
      active ? theme.gradients.primary : theme.colors.blue[50]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.blue[200]};
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;
