import { ethers } from 'ethers';

export const connectWallet = async (): Promise<string | null> => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
        alert('No wallet installed!');
        return null;
    }

    const eth = (window as any).ethereum;

    if (!eth || !eth.isMetaMask) {
        alert('Please, use MetaMask to connect your wallet.');
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        if (import.meta.env.VITE_ENV === "localhost") {
            await switchToLocalhost();
        } else {
            await switchToAmoy();
        }
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];

        localStorage.setItem('wallet', account);
        return account;
    } catch (error) {
        console.error('Error connecting to wallet:', error);
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

export const switchToAmoy = async () => {
    const eth = (window as any).ethereum;
    try {
        await eth.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13882" }],
        });
    } catch (switchError: any) {
        if (switchError.code === 4902) {
            switchToAmoy();
        }
        else console.error("Failed to switch to Amoy network", switchError);
    }
};

export const addAmoyTestnet = async () => {
    const eth = (window as any).ethereum;
    try {
        await eth.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: "0x13882",
                    chainName: "Polygon Amoy Testnet",
                    rpcUrls: ["https://rpc-amoy.polygon.technology"],
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18,
                    },
                    blockExplorerUrls: ["https://amoy.polygonscan.com"],
                },
            ],
        });
    } catch (addError) {
        console.error("Failed to add Amoy network", addError);
    }
}

export const switchToLocalhost = async () => {
    const eth = (window as any).ethereum;
    try {
        await eth.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7A69" }],
        });
    } catch (switchError: any) {
        if (switchError.code === 4902) {
            await addLocalhostNetwork();
        } else {
            console.error("Failed to switch to Localhost network", switchError);
        }
    }
};

export const addLocalhostNetwork = async () => {
    const eth = (window as any).ethereum;
    try {
        await eth.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: "0x7A69",
                    chainName: "Hardhat Localhost",
                    rpcUrls: ["http://127.0.0.1:8545"],
                    nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    blockExplorerUrls: [],
                },
            ],
        });
    } catch (addError) {
        console.error("Failed to add localhost network", addError);
    }
};
