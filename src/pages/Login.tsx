import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Login.css';
import Button from '../components/Button';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        if (localStorage.getItem('auth') === 'true') {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = () => {
        if (username && password) {
            localStorage.setItem('auth', 'true');
            localStorage.setItem('user', username);
            navigate('/wallet-connect');
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Hello</h2>
                <div className='login-input'>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='login-input'>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button text='Login' onClick={handleLogin}></Button>
            </div>
        </div>
    );
}
