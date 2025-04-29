import { isWalletConnected } from '../web3/web3';
import { useEffect, useState } from 'react';

export default function Wallet() {
    const [wallet, setWallet] = useState<string | null>(null);
    const user = localStorage.getItem('user');

    useEffect(() => {
        const connected = isWalletConnected();
        if (connected) {
            setWallet(connected);
        }
    }, []);

    return (
        <div className='container'>
            <h2>Olá {user} !</h2>
            {wallet ? (
                <div>
                    <p>Carteira conectada: {wallet}</p>
                </div>
            ) : <></>}
        </div>
    );
}
