import { useEffect, useState } from 'react';
import { isWalletConnected } from '../web3/web3';
import { getCredential } from '../web3/diploma';
import './wallet.css';

type Certificate = {
    studentName: string;
    degree: string;
    university: string;
    issueDate: string;
};

export default function Wallet() {
    const [wallet, setWallet] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<Certificate | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const connected = isWalletConnected();
            if (connected) {
                setWallet(connected);
                try {
                    const res = await getCredential(connected);
                    console.log('res:', res);
                    if (res) {
                        const parsed: Certificate = typeof res === 'string'
                            ? JSON.parse(res)
                            : res;

                        setCertificate(parsed);
                    }
                } catch (err) {
                    console.error('Erro ao obter certificado:', err);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="wallet-container">
            {wallet && (
                <div>
                    <p>Connected wallet: {wallet}</p>

                    {certificate ? (
                        <div className="certificate-card">
                            <h3>🎓 Certificate Obtained</h3>
                            <h4>{certificate.degree}</h4>
                            <p><strong>Student:</strong> {certificate.studentName}</p>
                            <p><strong>University:</strong> {certificate.university}</p>
                            <p><strong>Date Issued:</strong> {new Date(Number(certificate.issueDate) * 1000).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <p>🔍 No certificate found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
