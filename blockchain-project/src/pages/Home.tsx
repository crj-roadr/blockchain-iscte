import { useNavigate } from 'react-router-dom';
import { connectWallet, disconnectWallet, isWalletConnected } from '../web3/mockWeb3';
import { useEffect, useState } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [wallet, setWallet] = useState<string | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('auth');
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
            <h2>Dashboard</h2>
            {wallet ? (
                <p>Carteira ligada: {wallet}</p>
            ) : (
                <button onClick={handleConnect}>Ligar carteira</button>
            )}
            <br />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
