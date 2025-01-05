import React from 'react';
import { Position } from '../../types/types';
import styled from 'styled-components';

const MenuContainer = styled.div`
    position: fixed; // Change from absolute to fixed for better mobile positioning
    background-color: white;
    box-shadow: 0 0 5px grey;
    border-radius: 3px;
    z-index: 1000;
    max-width: 200px;
    width: 90%; // More mobile-friendly width
    transform: translate(-50%, -50%); // Center the menu
    touch-action: none; // Prevent default touch actions
`;

const MenuList = styled.ul`
    padding: 0;
    margin: 0;
`;

const MenuItem = styled.li`
    background-color: white;
    border: none;
    margin: 0;
    padding: 10px;
    list-style-type: none;
    cursor: pointer;

    &:hover {
        background-color: lightgray;
    }
`;

interface Props {
    position: Position;
    onOptionSelected: (e: React.MouseEvent, option: string) => void;
    deleteDisabled?: boolean;
}

export const ContextMenu: React.FC<Props> = ({ position, onOptionSelected, deleteDisabled = false }) => {
    const handleOptionSelected = (option: string) => (e: React.MouseEvent) => {
        onOptionSelected(e, option);
    };

    return (
        <MenuContainer
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            <MenuList>
                <MenuItem onClick={handleOptionSelected('change_instrument')}>
                    Cambiar instrumento
                </MenuItem>
                {!deleteDisabled && (
                    <MenuItem onClick={handleOptionSelected('delete_player')}>
                        Eliminar
                    </MenuItem>
                )}
            </MenuList>
        </MenuContainer>
    );
};
