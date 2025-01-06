import React from 'react';
import { styled } from 'styled-components';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import {
  ResetIcon,
  CommitIcon,
  PersonIcon,
  ImageIcon,
  ArchiveIcon,
  GearIcon
} from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  ToolButton,
  ToolbarDivider,
  ToolbarWrapper,
  ToolbarGroup
} from './Toolbar.styles';

// Keep StyledContent and StyledArrow here since they're tooltip-specific
const StyledContent = styled(Tooltip.Content)`
  background: ${({ theme }) => theme.colors.blue[900]};
  color: ${({ theme }) => theme.colors.white[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.shadows.md};
  user-select: none;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;

  &[data-state="delayed-open"] {
    animation: slideDownAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const StyledArrow = styled(Tooltip.Arrow)`
  fill: ${({ theme }) => theme.colors.blue[900]};
`;

export interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleLines: () => void;
  onAddMusician: () => void;
  onExportCanvas: () => void;
  onOpenDesigns: () => void;
  onOpenSettings?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showLines: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  onToggleLines,
  onAddMusician,
  onExportCanvas,
  onOpenDesigns,
  onOpenSettings,
  canUndo,
  canRedo,
  showLines
}) => {
  return (
    <Tooltip.Provider delayDuration={700}>
      <ToolbarWrapper>
        {/* Core Design Tools */}
        <ToolbarGroup>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton onClick={onAddMusician}>
                <PersonIcon />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Añadir músicos (A)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton active={showLines} onClick={onToggleLines}>
                <CommitIcon />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Mostrar/ocultar líneas (L)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* View Controls */}
        <ToolbarGroup>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton onClick={onZoomIn}>
                <FaSearchPlus />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Aumentar zoom (+)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton onClick={onZoomOut}>
                <FaSearchMinus />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Reducir zoom (-)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* History Controls */}
        <ToolbarGroup>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton disabled={!canUndo} onClick={onUndo}>
                <ResetIcon />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Deshacer (Ctrl+Z)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton disabled={!canRedo} onClick={onRedo}>
                <ResetIcon style={{ transform: 'scaleX(-1)' }} />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Rehacer (Ctrl+Shift+Z)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* File Operations */}
        <ToolbarGroup>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton onClick={onOpenDesigns}>
                <ArchiveIcon />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Gestionar diseños (D)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ToolButton onClick={onExportCanvas}>
                <ImageIcon />
              </ToolButton>
            </Tooltip.Trigger>
            <StyledContent side="bottom" sideOffset={5}>
              Exportar imagen (E)
              <StyledArrow />
            </StyledContent>
          </Tooltip.Root>

          {onOpenSettings && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <ToolButton onClick={onOpenSettings}>
                  <GearIcon />
                </ToolButton>
              </Tooltip.Trigger>
              <StyledContent side="bottom" sideOffset={5}>
                Configuración (S)
                <StyledArrow />
              </StyledContent>
            </Tooltip.Root>
          )}
        </ToolbarGroup>
      </ToolbarWrapper>
    </Tooltip.Provider>
  );
};
