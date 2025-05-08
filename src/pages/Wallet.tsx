import { useEffect, useState } from 'react';
import { isWalletConnected } from '../web3/web3';
import { getCredential, revokeCredential } from '../web3/diploma';
import './wallet.css';
import Spinner from '../components/Spinner';

type Certificate = {
    studentName: string;
    degree: string;
    university: string;
    issueDate: string;
    issued: any;
};

export default function Wallet() {
    const [wallet, setWallet] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const connected = isWalletConnected();
            if (connected) {
                setWallet(connected);
                try {
                    const res = await getCredential(connected);
                    if (res) {
                        const parsed: Certificate = typeof res === 'string'
                            ? JSON.parse(res)
                            : res;

                        setCertificate(parsed);
                    }
                } catch (err) {
                    // console.error('Erro ao obter certificado:', err);
                    // setCertificate(null);
                }
            }
        };

        fetchData();
    }, []);

    const handleRevoke = async () => {
        if (!wallet) return;
        setLoading(true);

        try {
            await revokeCredential(wallet).then((res) => {
                if (res) setCertificate(null);
            });
        } catch (err: any) {
            console.error('Error revoking certificate:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wallet-container">
            {wallet && (
                <div>
                    {loading && <Spinner />}
                    <p>Connected wallet: {wallet}</p>

                    {certificate ? (
                        <div className="certificate-card">
                            <button
                                onClick={handleRevoke}
                                disabled={loading}
                                className="revoke-button"
                            >
                                🗑
                            </button>

                            <h3>🎓 Certificate Obtained</h3>
                            <h4>{certificate.degree}</h4>
                            <p><strong>Student:</strong> {certificate.studentName}</p>
                            <p><strong>University:</strong> {certificate.university}</p>
                            <p><strong>Date Issued:</strong> {new Date(Number(certificate.issueDate) * 1000).toLocaleDateString()}</p>
                        </div>

                    ) : (
                        <p>🔍 No certificates found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
