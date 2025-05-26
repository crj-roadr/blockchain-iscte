import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./Store.css";
import Button from "../components/Button";
import { getProvider } from "../web3/web3";

interface StoreItem {
    id: number;
    name: string;
    priceEth: string;
    description: string;
}

const storeItems: StoreItem[] = [
    { id: 1, name: "ChatGPT Premium", priceEth: "0.01", description: "Premium infinite knowledge." },
    { id: 2, name: "Blockchain Certificate", priceEth: "1000000", description: "Prove your blockchain knowledge." },
    { id: 3, name: "Exclusive NFT", priceEth: "0.05", description: "Unique NFT collectible." },
];

export default function Store() {
    const [account, setAccount] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");

    useEffect(() => {
        const init = async () => {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const bal = await provider.getBalance(address);
            setAccount(address);
            setBalance(ethers.formatEther(bal));
        };
        init();
    }, []);

    const handleBuy = async (item: StoreItem) => {
        console.log(`Buying ${item.name} for ${item.priceEth} ETH`);
        // try {
        //     const provider = getProvider();
        //     const signer = await provider.getSigner();

        //     const tx = await signer.sendTransaction({
        //         to: "0x000000000000000000000000000000000000dead", // Replace with contract or recipient address
        //         value: ethers.parseEther(item.priceEth),
        //     });

        //     await tx.wait();
        //     alert(`You bought ${item.name} for ${item.priceEth} ETH!`);
        // } catch (error) {
        //     console.error("Purchase failed:", error);
        //     alert("Transaction failed.");
        // }
    };

    return (
        <div className="store-container">
            <h2 className='title'>Store</h2>

            <div className="wallet-info">
                <p><strong>Wallet:</strong> {account}</p>
                <p><strong>Balance:</strong> {parseFloat(balance).toFixed(4)} ETH</p>
            </div>

            <div className="items-grid">
                {storeItems.map((item) => (
                    <div key={item.id} className="item-card">
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <div className="item-footer">
                            <p className="price"><strong>{item.priceEth} ETH</strong></p>
                            <Button
                                text="Buy"
                                onClick={() => handleBuy(item)}
                                disabled={parseFloat(balance) < parseFloat(item.priceEth)}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
