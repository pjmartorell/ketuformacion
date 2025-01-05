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
`;
