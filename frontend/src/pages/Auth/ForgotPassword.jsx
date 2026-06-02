import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import { Factory, KeyRound, CheckCircle } from 'lucide-react';
import '../Auth/Auth.css';

const ForgotPassword = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [key, setKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await userService.forgotPassword(employeeId, key, newPassword);
      setSuccess('Password has been reset successfully! You can now log in.');
    } catch (err) {
      const msg = err.response?.data?.Message || err.response?.data?.message || 'Invalid Employee ID or security key.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Factory size={32} />
          </div>
          <h1>Forgot Password</h1>
          <p>Enter your Employee ID and security key to reset your password.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#10b981', fontWeight: 600 }}>{success}</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. EMP001"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your security/recovery key"
                value={key}
                onChange={e => setKey(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>Contact your administrator if you don't have a key.</small>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Resetting...' : <><KeyRound size={16} /> Reset Password</>}
            </button>

            <div className="auth-footer">
              <Link to="/login">← Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
