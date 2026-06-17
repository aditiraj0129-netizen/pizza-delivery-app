/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    color: isActive(path) ? '#E63946' : 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontWeight: isActive(path) ? '700' : '500',
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '6px',
    background: isActive(path) ? 'rgba(230,57,70,0.12)' : 'transparent',
    transition: 'all 0.2s',
    letterSpacing: '0.2px'
  });

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1d3557 0%, #2d4a73 100%)',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '38px', height: '38px',
          background: '#E63946',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(230,57,70,0.4)'
        }}>🍕</div>
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', lineHeight: 1 }}>PizzaCraft</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Fresh · Fast · Custom</div>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Menu</Link>
            <Link to="/customize" style={navLinkStyle('/customize')}>Build Pizza</Link>
            <Link to="/my-orders" style={navLinkStyle('/my-orders')}>My Orders</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...navLinkStyle('/admin'), background: 'rgba(255,215,0,0.12)', color: '#ffd700' }}>
                ⚙️ Admin
              </Link>
            )}
            <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #E63946, #c1121f)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: '14px'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', padding: '7px 16px',
                borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600'
              }}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle('/login')}>Login</Link>
            <Link to="/register" style={{
              background: '#E63946', color: 'white',
              padding: '9px 20px', borderRadius: '8px',
              textDecoration: 'none', fontWeight: '600',
              fontSize: '14px', marginLeft: '8px',
              boxShadow: '0 4px 12px rgba(230,57,70,0.4)'
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;