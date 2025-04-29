import React, { useEffect, useRef, useState } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    username: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <h1 className="navbar-title" onClick={handleHomeClick}>Blockchain Demo</h1>
            <div className="dropdown-container" ref={dropdownRef}>
                <label onClick={toggleDropdown} className='username-field'>{username}</label>
                <button onClick={toggleDropdown} className="profile-button">
                    <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt="Perfil"
                        className="profile-image"
                    />
                </button>
                {isOpen && (
                    <div className="dropdown-menu">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
