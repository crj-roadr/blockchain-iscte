import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './auth/Redirect';
import WalletConnect from './pages/WalletConnect';
import Profile from './pages/Wallet';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

export default function App() {
  const user = localStorage.getItem('user');
  const location = useLocation();

  const hideLayout = location.pathname === '/login' || location.pathname === '/wallet-connect';

  return (
    <div className="app-container">
      {!hideLayout && <Navbar username={user} />}
      <div className="content-layout">
        {!hideLayout && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/wallet-connect" element={<WalletConnect />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
