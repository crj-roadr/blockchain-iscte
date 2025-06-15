import { useEffect, useState } from 'react';
import { isWalletConnected } from '../web3/web3';
import { getCredential } from '../web3/diploma';
import './wallet.css';
import Spinner from '../components/Spinner';
import { W3CCredential } from '@0xpolygonid/js-sdk';

export default function Wallet() {
    const [wallet, setWallet] = useState<string | null>(null);
    const [credential, setCredential] = useState<W3CCredential | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const connected = isWalletConnected();
            setWallet(connected);
            try {
                const connected = isWalletConnected();
                if (!connected) return;

                setWallet(connected);
                const studentCredential = localStorage.getItem("studentCredential");
                const credential = studentCredential ? JSON.parse(studentCredential) : null;
                const credentialId = credential ? credential.credentialSubject.id : "";

                const res = await getCredential(credentialId); //retreiving null
                setCredential(res || credential || null);

            } catch (err) {
                console.error('Erro ao obter certificado:', err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="wallet-container">
            {wallet && (
                <div>
                    {loading && <Spinner />}
                    <p>Connected wallet: {wallet}</p>

                    {credential ? (
                        <div className='certificate-card'>
                            <h3>🎓 Certificate Obtained</h3>

                            <p><strong>Degree: </strong>{credential.credentialSubject.degree as string}</p>
                            <p><strong>Id: </strong>{credential.credentialSubject.id as string}</p>
                            <p><strong>Student Wallet Address: </strong>{credential.credentialSubject.studentAddress as string}</p>
                            <p><strong>Student Name: </strong>{credential.credentialSubject.studentName as string}</p>
                            <p><strong>Credential type: </strong>{credential.credentialSubject.type as string}</p>
                            <p><strong>University: </strong>{credential.credentialSubject.university as string}</p>
                        </div>

                    ) : (
                        <p>🔍 No certificates found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
