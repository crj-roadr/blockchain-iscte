import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './walletConnect.css';
import Button from '../components/Button';
import { connectWallet, isWalletConnected } from '../web3/web3';

export default function WalletConnect() {
    const navigate = useNavigate();
    const [wallet, setWallet] = useState<string | null>(null);

    useEffect(() => {
        const connected = isWalletConnected();
        if (connected) {
            setWallet(connected);
        }
        const auth = localStorage.getItem('auth');
        if (auth !== 'true') {
            navigate('/login');
        }
        if (localStorage.getItem('walletConnected') === 'true') {
            navigate('/');
        }
    }, [navigate]);


    const handleConnect = async () => {
        const address = await connectWallet();
        if (address) {
            setWallet(address);
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('wallet', address);
            navigate('/');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome! Please connect your wallet to continue.</h2>
                <div className='login-input'>
                    <Button text='Connect wallet' onClick={handleConnect}></Button>
                </div>
            </div>
        </div>
    );
}
