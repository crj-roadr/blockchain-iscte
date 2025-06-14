import { useEffect, useState } from 'react';
import { isWalletConnected } from '../web3/web3';
import { getCredential, revokeCredential } from '../web3/diploma';
import './wallet.css';
import Spinner from '../components/Spinner';
import { W3CCredential } from '@0xpolygonid/js-sdk';

// type Certificate = {
//     studentName: string;
//     degree: string;
//     university: string;
//     issueDate: string;
//     issued: any;
// };

export default function Wallet() {
    const [wallet, setWallet] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<W3CCredential | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const connected = isWalletConnected();
            if (connected) {
                setWallet(connected);
                try {
                    const studentCredential = localStorage.getItem("studentCredential");
                    const credential = studentCredential ? JSON.parse(studentCredential) : null;
                    const credentialId = credential ? credential.credentialSubject.id : "";
                    const res = await getCredential(credentialId);
                    if (res) {
                        setCertificate(res);
                    }
                } catch (err) {
                    console.error('Erro ao obter certificado:', err);
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
                if (res) {
                    setCertificate(null);
                    localStorage.removeItem('course');
                }
            });
        } catch (err) {
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
                            <h4>{certificate.credentialSubject.degree as string}</h4>
                            <p><strong>Student:</strong> {certificate.credentialSubject.studentName as string}</p>
                            <p><strong>University:</strong> {certificate.credentialSubject.university as string}</p>
                            <p><strong>Date Issued:</strong> {new Date(Number(certificate.credentialSubject.issuanceDate) * 1000).toLocaleDateString()}</p>
                        </div>

                    ) : (
                        <p>🔍 No certificates found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
