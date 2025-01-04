import styled from 'styled-components';
import { Theme } from '../../theme/theme';

export const CanvasContainer = styled.div<{ theme: Theme }>`
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

export const ToolbarContainer = styled.div<{ theme: Theme }>`
    position: absolute;
    top: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    z-index: 100;
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm};
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadows.md};

    .zoom-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: ${({ theme }) => theme.spacing.xs};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        transition: background ${({ theme }) => theme.transitions.fast};

        &:hover {
            background: ${({ theme }) => theme.colors.gray.light};
        }
    }

    .lines-label {
        display: flex;
        align-items: center;
        gap: ${({ theme }) => theme.spacing.xs};
        user-select: none;
    }
`;
