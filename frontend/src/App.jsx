import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Guards
import AdminLayout from './components/layout/AdminLayout';
import AuthGuard from './components/auth/AuthGuard';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ChangePassword from './pages/Auth/ChangePassword';
import Dashboard from './pages/Dashboard/Dashboard';

import UsersList from './pages/Users/UsersList';
import MachinesList from './pages/Machines/MachinesList';
import ShiftsList from './pages/Shifts/ShiftsList';
import ProductionList from './pages/Production/ProductionList';
import Reports from './pages/Reports/Reports';
import { X } from 'lucide-react';
import './components/Toast.css';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleMessage = (e) => {
      const newToast = { id: Date.now(), ...e.detail };
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('apiMessage', handleMessage);
    return () => window.removeEventListener('apiMessage', handleMessage);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-msg toast-${t.type}`}>
          <span>{t.text}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}><X size={16}/></button>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="machines" element={<MachinesList />} />
            <Route path="shifts" element={<ShiftsList />} />
            <Route path="production" element={<ProductionList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
