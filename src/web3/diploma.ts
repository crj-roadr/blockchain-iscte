import { ethers } from 'ethers';
import { getProvider, switchToAmoy } from './web3';
import { contractABI, contractAddress } from "./contract.ts";

export const issueCredential = async (
    studentAddress: string,
    studentName: string,
    degree: string,
    university: string
) => {
    await switchToAmoy();
    const provider = getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
        const tx = await contract.issueCredential(
            studentAddress,
            studentName,
            degree,
            university
        );
        await tx.wait();
        alert('Credential issued successfully!');
    } catch (error) {
        console.error('Error issuing credential:', error);
        alert('Failed to issue credential!');
    }
};

export const getCredential = async (studentAddress: string) => {
    await switchToAmoy();
    const provider = getProvider();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
        const credential = await contract.getCredential(studentAddress);
        return credential;
    } catch (error) {
        console.error('Error getting credential:', error);
    }
};


export const revokeCredential = async (studentAddress: string) => {
    await switchToAmoy();
    const provider = getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const credential = await contract.revokeCredential(studentAddress);
        await credential.wait();
        alert('Credential was revoked');
        return true;
    } catch (error) {
        console.error('Error revoking credential:', error);
        alert('Error revoking credential!');
    }
};