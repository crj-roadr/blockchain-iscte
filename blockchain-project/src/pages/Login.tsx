import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('auth') === 'true') {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = () => {
        localStorage.setItem('auth', 'true');
        navigate('/');
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Login</h2>
            <button onClick={handleLogin}>Entrar</button>
        </div>
    );
}
