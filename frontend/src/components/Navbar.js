import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const dashboardPath = user?.role === 'hr' ? '/hr/dashboard' : '/dashboard';

  return (
    <nav style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #e8e5df',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 1.5rem',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#2563eb', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem',
          }}>I</div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a1917', letterSpacing: '-0.02em' }}>
            Intern<span style={{ color: '#2563eb' }}>Hub</span>
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {user ? (
            <>
              <span style={{
                fontSize: '0.82rem', color: '#514e48', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <span style={{
                  backgroundColor: user.role === 'hr' ? '#ede9fe' : '#dbeafe',
                  color: user.role === 'hr' ? '#7c3aed' : '#2563eb',
                  padding: '0.15rem 0.55rem', borderRadius: '20px',
                  fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                }}>{user.role}</span>
                {user.name.split(' ')[0]}
              </span>
              <Link to={dashboardPath} style={{
                fontSize: '0.88rem', fontWeight: 600, color: '#2563eb',
                padding: '0.4rem 0.9rem', borderRadius: '7px',
                backgroundColor: location.pathname === dashboardPath ? '#dbeafe' : 'transparent',
                border: '1px solid transparent',
                textDecoration: 'none',
              }}>Dashboard</Link>
              <button onClick={handleLogout} style={{
                fontSize: '0.85rem', fontWeight: 500, color: '#514e48',
                padding: '0.4rem 0.9rem', borderRadius: '7px',
                border: '1px solid #e8e5df', backgroundColor: '#f7f6f3',
              }}>Logout</button>
            </>
          ) : (
            <Link to="/auth" style={{
              fontSize: '0.9rem', fontWeight: 700, color: '#fff',
              padding: '0.45rem 1.2rem', borderRadius: '8px',
              backgroundColor: '#2563eb', textDecoration: 'none',
              border: 'none', display: 'inline-block',
            }}>Login / Sign Up</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
