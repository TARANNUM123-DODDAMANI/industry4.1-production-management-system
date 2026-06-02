import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Auth.css';
import { Factory } from 'lucide-react';

const Register = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Operator');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register({ employeeId, password, role, isActive: true });
      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error occurred during registration. Please check if user exists.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Factory size={48} className="auth-icon" />
          <h2>Industry 4.1</h2>
          <p>Create a new account</p>
        </div>
        {success && <div className="badge badge-success" style={{display:'block', textAlign:'center', marginBottom:16}}>{success}</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleRegister} className="auth-form">
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
            <label className="form-label">Role</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Operator">Operator</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
            </select>
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
          <button type="submit" className="btn btn-primary auth-submit">Register</button>
        </form>
        <div className="auth-footer"><Link to="/login">Already have an account? Login</Link></div>
      </div>
    </div>
  );
};

export default Register;
