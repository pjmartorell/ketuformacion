import styled from 'styled-components';
import { Theme } from '../../theme/theme';

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
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    min-width: 300px;
    max-width: 90vw;
    padding: ${({ theme }) => theme.spacing.md};
`;

export const DialogBody = styled.div<{ theme: Theme }>`
    padding: ${({ theme }) => theme.spacing.md};
`;

export const DialogTitle = styled.h2<{ theme: Theme }>`
    margin: 0;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.text};
`;

export const DialogHeader = styled.div<{ theme: Theme }>`
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray.light};
    font-weight: bold;
`;

export const DialogFooter = styled.div<{ theme: Theme }>`
    padding: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.gray.light};
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};

    button {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        border: none;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        background: ${({ theme }) => theme.colors.primary};
        color: white;
        cursor: pointer;
        transition: opacity ${({ theme }) => theme.transitions.fast};

        &:hover {
            opacity: 0.8;
        }
    }
`;
