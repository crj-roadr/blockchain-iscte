import { ethers } from 'ethers';
import { getProvider, switchToAmoy, switchToLocalhost } from './web3';
import { tokenABI, tokenAddress } from './contract.ts';
import { IStoreItem } from '../pages/Store.tsx';

export const rewardTokens = async (studentAddress: string, amount: number) => {
    const contract = await getContract();

    try {
        const tx = await contract.rewardTokens(studentAddress, ethers.parseUnits(amount.toString(), 18));
        await tx.wait();
        alert(`You have been rewarded ${amount} tokens!`);
        return true;
    } catch (error) {
        console.error('Error rewarding tokens:', error);
        alert('Failed to reward tokens!');
    }
};

export const getTokenBalance = async (studentAddress: string) => {
    const contract = await getContract();

    try {
        const balance = await contract.balanceOf(studentAddress);
        return ethers.formatUnits(balance, 18);
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return "0";
    }
};

export const getSymbol = async () => {
    const contract = await getContract();
    try {
        const symbol = await contract.symbol();
        return symbol;
    } catch (error) {
        console.error('Error fetching token symbol:', error);
        return "Unknown";
    }
};


export const buyItem = async (item: IStoreItem) => {
    const contract = await getContract();

    const decimals = await contract.decimals();
    const amount = ethers.parseUnits(item.price, decimals);
    const address = await contract.admin();
    try {
        const tx = await contract.transfer(address, amount);
        await tx.wait();
        alert(`You bought ${item.name} for ${item.price} Tokens!`);
    } catch (error) {
        console.error('Error buying item:', error);
        alert('Purchase failed :(');
    }
}

const getContract = async () => {
    if (import.meta.env.VITE_ENV === "localhost") {
        await switchToLocalhost();
    } else {
        await switchToAmoy();
    }

    const provider = getProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(tokenAddress, tokenABI, signer);
}