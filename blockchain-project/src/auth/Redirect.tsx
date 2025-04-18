import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const isAuth = localStorage.getItem('auth') === 'true';
    return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;