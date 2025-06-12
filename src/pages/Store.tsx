import { useEffect, useState } from "react";
import "./Store.css";
import Button from "../components/Button";
import { getProvider } from "../web3/web3";
import { buyItem, getTokenBalance, getSymbol } from "../web3/course-token";

export interface IStoreItem {
    id: number;
    name: string;
    price: string;
    description: string;
    category: "Merch" | "Software";
}

const storeItems: IStoreItem[] = [
    { id: 1001, name: "ChatGPT Premium", price: "10", description: "Premium infinite knowledge.", category: "Software" },
    { id: 1002, name: "Microsoft Office", price: "10", description: "The essencial package for productivity", category: "Software" },
    { id: 1003, name: "Adobe Creative Cloud", price: "15", description: "The complete toolkit for creativity,", category: "Software" },
    { id: 1004, name: "Spotify Premium", price: "5", description: "Unlimited ad-free music streaming.", category: "Software" },

    { id: 2001, name: "Sweatshirt", price: "25", description: "Unique branded merchandise.", category: "Merch" },
    { id: 2002, name: "Blockchain Stickers", price: "1", description: "Sticker pack to customize your laptop.", category: "Merch" },
];

export default function Store() {
    const [account, setAccount] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");
    const [wallet, setWallet] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");

    useEffect(() => {
        const init = async () => {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const symbol = await getSymbol();
            setWallet(address);
            setAccount(address);
            setSymbol(symbol);
        };
        init();
    }, []);

    useEffect(() => {
        if (wallet) {
            fetchBalance();
        }
    }, [wallet]);

    const fetchBalance = async () => {
        const balance = await getTokenBalance(wallet);
        setBalance(balance);
    };

    const handleBuy = async (item: IStoreItem) => {
        await buyItem(item);
        fetchBalance();
    };

    const groupedItems = storeItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, IStoreItem[]>);

    return (
        <div className="store-container">
            <div className="balance-container">
                <div className="balance-info">
                    <p><strong>Balance:</strong> {parseFloat(balance)} {symbol}</p>
                </div>
            </div>

            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                    <h3 className="category-title">{category}</h3>
                    <div className="items-grid">
                        {items.map((item) => (
                            <div key={item.id} className="item-card">
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <div className="item-footer">
                                    <p className="price"><strong>{item.price} {symbol}</strong></p>
                                    <Button
                                        text="Buy"
                                        onClick={() => handleBuy(item)}
                                        disabled={parseFloat(balance) < parseFloat(item.price)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
