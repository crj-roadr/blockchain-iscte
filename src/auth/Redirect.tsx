import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const isAuth = localStorage.getItem('auth') === 'true';
    const isWalletConnected = localStorage.getItem('walletConnected') === 'true';

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    if (!isWalletConnected) {
        return <Navigate to="/wallet-connect" />;
    }

    return children;
};

export default ProtectedRoute;