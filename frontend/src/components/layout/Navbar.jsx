import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, ChevronDown, Shield, Lock } from 'lucide-react';
import authService from '../../services/authService';
import './Layout.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'admin': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'operator': return '#10b981';
      default: return '#6366f1';
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-spacer"></div>
      <div className="navbar-actions">
        
        {/* User Profile Dropdown */}
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="user-profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-sidebar)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              color: 'var(--text-main)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, var(--primary), #6366f1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              {(user?.employeeId || 'U')[0].toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.employeeId || 'User'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role || 'Operator'}</div>
            </div>
            <ChevronDown size={14} style={{ marginLeft: '0.25rem', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {showDropdown && (
            <div className="user-dropdown-menu" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '260px',
              background: 'var(--bg-card)',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              zIndex: 1000,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              {/* Profile Header */}
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), #6366f1)',
                padding: '1.25rem',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '56px', height: '56px',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  {(user?.employeeId || 'U')[0].toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.employeeId || 'User'}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.25rem' }}>Industry 4.1 System</div>
              </div>

              {/* Profile Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg-main)',
                  borderRadius: '8px',
                  marginBottom: '0.75rem'
                }}>
                  <User size={16} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>EMPLOYEE ID</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.employeeId || '—'}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg-main)',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <Shield size={16} style={{ color: getRoleBadgeColor(user?.role) }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>SYSTEM ROLE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'capitalize'
                      }}>{user?.role || 'Operator'}</span>
                      <span style={{
                        background: getRoleBadgeColor(user?.role),
                        color: 'white',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>Active</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/change-password"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    color: '#1d4ed8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    marginBottom: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Lock size={16} /> Change Password
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
