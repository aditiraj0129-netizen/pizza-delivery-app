import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1d3557',
      padding: '0 24px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <Link to="/" style={{ color: '#e63946', fontSize: '22px', fontWeight: 'bold', textDecoration: 'none' }}>
        🍕 Pizza App
      </Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={link}>Menu</Link>
            <Link to="/customize" style={link}>Build Pizza</Link>
            <Link to="/my-orders" style={link}>My Orders</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...link, color: '#ffd700' }}>Admin ⚙️</Link>
            )}
            <span style={{ color: '#a8dadc', fontSize: '14px' }}>Hi, {user.name}!</span>
            <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '14px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={link}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '14px' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const link = {
  color: '#a8dadc',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '15px'
};

export default Navbar;