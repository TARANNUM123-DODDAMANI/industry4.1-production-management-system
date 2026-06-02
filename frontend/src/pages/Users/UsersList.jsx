import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import { Plus, Trash2, Edit, X, Eye, Key, Filter } from 'lucide-react';

const ROLES = ['All', 'Admin', 'Manager', 'Operator'];

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ employeeId: '', isActive: true, role: 'Operator' });

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ employeeId: '', oldPassword: '', newPassword: '' });

  useEffect(() => { loadUsers(); }, [activeOnly, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let data;
      if (activeOnly) {
        data = await userService.getActiveUsers();
      } else if (roleFilter !== 'All') {
        data = await userService.getUsersByRole(roleFilter);
      } else {
        data = await userService.getAllUsers();
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm(`Delete user ${employeeId}?`)) return;
    try {
      await userService.deleteUser(employeeId);
      loadUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const openEdit = (user) => {
    setEditData({ employeeId: user.employeeId, isActive: user.isActive, role: user.role || 'Operator' });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(editData.employeeId, editData);
      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const openView = async (employeeId) => {
    try {
      const data = await userService.getUserById(employeeId);
      setViewUser(data);
      setShowViewModal(true);
    } catch (err) {
      alert('Could not load user details');
    }
  };

  const openResetPassword = (employeeId) => {
    setPasswordData({ employeeId, oldPassward: '', newPassward: '' });
    setShowPasswordModal(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await userService.resetPassword(passwordData.employeeId, passwordData.oldPassward, passwordData.newPassward);
      alert('Password reset successfully!');
      setShowPasswordModal(false);
    } catch (err) {
      alert('Error: Check the current password is correct.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <h1>Users</h1>
          <p>Manage system users and operators</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/register'}>
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Filter size={16}/> Filters:</span>

        <select
          className="form-control"
          style={{ width: '160px', display: 'inline-block' }}
          value={roleFilter}
          disabled={activeOnly}
          onChange={e => { setRoleFilter(e.target.value); }}
        >
          {ROLES.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>)}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={e => { setActiveOnly(e.target.checked); setRoleFilter('All'); }}
          />
          Active Users Only
        </label>

        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {users.length} user{users.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: 'var(--space-6)' }}>Loading users...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id || u.employeeId}>
                  <td>{u.id || '—'}</td>
                  <td><strong>{u.employeeId}</strong></td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: u.role === 'Admin' ? '#fee2e2' : u.role === 'Manager' ? '#fef3c7' : '#d1fae5',
                      color: u.role === 'Admin' ? '#991b1b' : u.role === 'Manager' ? '#92400e' : '#065f46'
                    }}>
                      {u.role || 'Operator'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" onClick={() => openView(u.employeeId)} title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-secondary" onClick={() => openEdit(u)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-secondary" onClick={() => openResetPassword(u.employeeId)} title="Reset Password">
                        <Key size={14} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(u.employeeId)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View User Modal */}
      {showViewModal && viewUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '360px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>User Details</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowViewModal(false)}><X size={20} /></button>
            </div>
            <div style={{ background: 'var(--bg-main)', borderRadius: '8px', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(viewUser).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{key}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '380px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>Edit User</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowEditModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Employee ID (Read-only)</label>
                <input type="text" className="form-control" disabled value={editData.employeeId} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                  <option>Operator</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input type="checkbox" id="userActive" checked={editData.isActive} onChange={e => setEditData({ ...editData, isActive: e.target.checked })} />
                <label htmlFor="userActive" className="form-label" style={{ marginBottom: 0 }}>Account Active</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '380px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>Reset Password</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowPasswordModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input type="text" className="form-control" disabled value={passwordData.employeeId} />
              </div>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" required value={passwordData.oldPassward} onChange={e => setPasswordData({ ...passwordData, oldPassward: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" required value={passwordData.newPassward} onChange={e => setPasswordData({ ...passwordData, newPassward: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>Change Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
