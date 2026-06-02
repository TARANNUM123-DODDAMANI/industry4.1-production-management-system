import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { Lock, CheckCircle } from 'lucide-react';
import '../Auth/Auth.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [oldPassward, setOldPassward] = useState('');
  const [newPassward, setNewPassward] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassward !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!currentUser?.employeeId) {
      setError('No logged-in user found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      await userService.resetPassword(currentUser.employeeId, oldPassward, newPassward);
      setSuccess('Password changed successfully! Logging you out...');
      setTimeout(() => {
        authService.logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.Message || err.response?.data?.message || 'Incorrect current password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '42px', height: '42px',
            background: 'linear-gradient(135deg, var(--primary), #6366f1)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Lock size={20} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Change Password</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Logged in as <strong>{currentUser?.employeeId}</strong>
            </p>
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#10b981', fontWeight: 600 }}>{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fecaca',
                color: '#991b1b', padding: '0.75rem 1rem',
                borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your current password"
                value={oldPassward}
                onChange={e => setOldPassward(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassward}
                onChange={e => setNewPassward(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Saving...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
