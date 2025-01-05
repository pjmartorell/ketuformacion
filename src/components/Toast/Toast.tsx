import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import styled, { keyframes } from 'styled-components';

const VIEWPORT_PADDING = 25;

const hide = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideIn = keyframes`
  from { transform: translateX(calc(100% + ${VIEWPORT_PADDING}px)); }
  to { transform: translateX(0); }
`;

const swipeOut = keyframes`
  from { transform: translateX(var(--radix-toast-swipe-end-x)); }
  to { transform: translateX(calc(100% + ${VIEWPORT_PADDING}px)); }
`;

const StyledViewport = styled(ToastPrimitive.Viewport)`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: ${VIEWPORT_PADDING}px;
  gap: 10px;
  width: 390px;
  max-width: 100vw;
  margin: 0;
  list-style: none;
  z-index: 2147483647;
  outline: none;
`;

const StyledToast = styled(ToastPrimitive.Root)`
  background-color: white;
  border-radius: 6px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  &[data-state="open"] {
    animation: ${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-state="closed"] {
    animation: ${hide} 100ms ease-in;
  }
  &[data-swipe="move"] {
    transform: translateX(var(--radix-toast-swipe-move-x));
  }
  &[data-swipe="cancel"] {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }
  &[data-swipe="end"] {
    animation: ${swipeOut} 100ms ease-out;
  }
`;

const StyledTitle = styled(ToastPrimitive.Title)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[900]};
  font-size: 15px;
`;

const StyledDescription = styled(ToastPrimitive.Description)`
  color: ${({ theme }) => theme.colors.blue[700]};
  font-size: 13px;
  line-height: 1.5;
`;

interface ToastProps {
  title?: string;
  description?: string;
  type?: 'info' | 'error' | 'success';
  duration?: number;
}

export const Toast = ({ title, description, type = 'info', duration = 5000 }: ToastProps) => (
  <StyledToast duration={duration}>
    {title && <StyledTitle>{title}</StyledTitle>}
    {description && <StyledDescription>{description}</StyledDescription>}
  </StyledToast>
);

export const ToastViewport = StyledViewport;
