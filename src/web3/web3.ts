import { ethers } from 'ethers';

export const connectWallet = async (): Promise<string | null> => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
        alert('MetaMask não está instalada!');
        return null;
    }

    const eth = (window as any).ethereum;

    if (!eth || !eth.isMetaMask) {
        alert('Por favor, usa a MetaMask para ligar a tua carteira.');
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];

        localStorage.setItem('wallet', account);
        return account;
    } catch (error) {
        console.error('Erro ao conectar carteira:', error);
        return null;
    }
};

export const disconnectWallet = () => {
    localStorage.removeItem('wallet');
};

export const isWalletConnected = (): string | null => {
    return localStorage.getItem('wallet');
};

export const getProvider = () => {
    return new ethers.BrowserProvider((window as any).ethereum);
};