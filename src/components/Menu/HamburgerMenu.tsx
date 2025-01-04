import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';

interface Props {
    onMenuItemClick: () => void;
    onExportCanvas: () => void;
}

const MenuContainer = styled.div`
    position: relative;
    display: inline-block;
    margin: 10px;
`;

const MenuIcon = styled.div`
    cursor: pointer;
    z-index: 1;
`;

const MenuDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    width: 140px;
    z-index: 2;
`;

const MenuItem = styled.div`
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #ccc;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: #f0f0f0;
    }
`;

export const HamburgerMenu: React.FC<Props> = ({ onMenuItemClick, onExportCanvas }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (isOpen && !(e.target as Element).closest('.menu-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isOpen]);

    return (
        <MenuContainer className="menu-container">
            <MenuIcon onClick={() => setIsOpen(!isOpen)}>
                <FaBars size={'2rem'} />
            </MenuIcon>
            {isOpen && (
                <MenuDropdown>
                    <MenuItem onClick={() => {
                        onMenuItemClick();
                        setIsOpen(false);
                    }}>
                        Percusionistas
                    </MenuItem>
                    <MenuItem onClick={() => {
                        onExportCanvas();
                        setIsOpen(false);
                    }}>
                        Exportar imagen
                    </MenuItem>
                </MenuDropdown>
            )}
        </MenuContainer>
    );
};
