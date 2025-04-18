import React from 'react';
import './Button.css';

interface ButtonProps {
    text: string;
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    type = 'button',
    disabled = false,
}) => {
    const className = type === 'button' ? 'default-button' : '';

    return (
        <button className={className} onClick={onClick} type={type} disabled={disabled}>
            {text}
        </button>
    );
};

export default Button;
