import React, { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HamburgerMenuIcon, PersonIcon, ImageIcon } from '@radix-ui/react-icons';
import styled from 'styled-components';

interface Props {
    onMenuItemClick: () => void;
    onExportCanvas: () => void;
}

const StyledTrigger = styled(DropdownMenu.Trigger)`
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.white[500]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledContent = styled(DropdownMenu.Content)`
  background: ${({ theme }) => theme.colors.white[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 180px;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xs};
  z-index: 100;
`;

const StyledItem = styled(DropdownMenu.Item)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.blue[900]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[50]};
    color: ${({ theme }) => theme.colors.blue[700]};
  }

  svg {
    color: ${({ theme }) => theme.colors.blue[500]};
  }
`;

export const HamburgerMenu: React.FC<Props> = ({ onMenuItemClick, onExportCanvas }) => {
    return (
        <DropdownMenu.Root>
            <StyledTrigger>
                <HamburgerMenuIcon />
            </StyledTrigger>
            <StyledContent>
                <StyledItem onSelect={onMenuItemClick}>
                    <PersonIcon /> Percusionistas
                </StyledItem>
                <StyledItem onSelect={onExportCanvas}>
                    <ImageIcon /> Exportar imagen
                </StyledItem>
            </StyledContent>
        </DropdownMenu.Root>
    );
};
