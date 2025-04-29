import React from 'react';
import './sidebar.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const pages = {
        Dashboard: '/',
        Store: '/store',
        Wallet: '/wallet',
    }
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <aside className="sidebar">
            <ul>
                {Object.entries(pages).map(([page, path]) => (
                    <li
                        key={page}
                        className={location.pathname === path ? 'active' : ''}
                        onClick={() => navigate(path)}
                    >
                        {location.pathname === path && <span className="dot" />}
                        {page}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
