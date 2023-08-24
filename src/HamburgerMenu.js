import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import './HamburgerMenu.css';

const HamburgerMenu = ({ onMenuItemClick, onExportCanvas }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isMenuOpen && e.target.closest('.menu-container') === null) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [isMenuOpen]);

    return (
        <div className="menu-container">
            <div className="menu-icon" onClick={handleToggleMenu}>
                <FaBars size={'2rem'} />
            </div>
            {isMenuOpen && (
                <div className="menu">
                    <div
                        className="menu-item"
                        onClick={() => {
                            setIsMenuOpen(false);
                            onMenuItemClick('percusionistas');
                        }}
                    >
                        Percusionistas
                    </div>
                    <div className="menu-item" onClick={onExportCanvas}>
                        Export Canvas
                    </div>
                    {/* Add more menu items here */}
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
