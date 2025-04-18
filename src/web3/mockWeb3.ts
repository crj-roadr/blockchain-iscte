export const connectWallet = (): string => {
    const mockAddress = '0x1234...abcd';
    localStorage.setItem('wallet', mockAddress);
    return mockAddress;
};

export const disconnectWallet = () => {
    localStorage.removeItem('wallet');
};

export const isWalletConnected = (): string | null => {
    return localStorage.getItem('wallet');
};
