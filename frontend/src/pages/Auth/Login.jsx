import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Auth.css';
import { Factory } from 'lucide-react';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(employeeId, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or server error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Factory size={48} className="auth-icon" />
          <h2>Industry 4.1</h2>
          <p>Sign in to your account</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input 
              type="text" 
              className="form-control" 
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">Login</button>
        </form>
        <div className="auth-footer">
          <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Forgot password?</Link>
          <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>·</span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
