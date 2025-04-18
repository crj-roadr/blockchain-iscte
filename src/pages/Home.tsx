import { useNavigate } from 'react-router-dom';
import { connectWallet, disconnectWallet, isWalletConnected } from '../web3/mockWeb3';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

export default function Home() {
    const navigate = useNavigate();
    const [wallet, setWallet] = useState<string | null>(null);
    const user = localStorage.getItem('user');

    const handleLogout = () => {
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        disconnectWallet();
        navigate('/login');
    };

    const handleConnect = () => {
        const address = connectWallet();
        setWallet(address);
    };

    useEffect(() => {
        const connected = isWalletConnected();
        if (connected) {
            setWallet(connected);
        }
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Olá {user} !</h2>
            {wallet ? (
                <p>Carteira ligada: {wallet}</p>
            ) : (
                <Button text='Ligar carteira' onClick={handleConnect}></Button>
            )}
            <br />
            <Button text='Logout' type='reset' onClick={handleLogout}></Button>
        </div>
    );
}
