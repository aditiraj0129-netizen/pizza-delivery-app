import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  const features = [
    { icon: '🍕', title: 'Build Your Pizza', desc: 'Choose base, sauce, cheese & toppings', link: '/customize', color: '#e63946' },
    { icon: '📋', title: 'My Orders', desc: 'Track your order status live', link: '/my-orders', color: '#457b9d' },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #1d3557, #457b9d)',
          borderRadius: '16px',
          padding: '50px 40px',
          color: 'white',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ opacity: 0.85, fontSize: '18px', marginBottom: '28px' }}>
            What pizza are you craving today?
          </p>
          <Link to="/customize" className="btn" style={{ background: '#e63946', color: 'white', padding: '14px 36px', fontSize: '17px' }}>
            Build Your Pizza 🍕
          </Link>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {features.map((f) => (
            <Link to={f.link} key={f.title} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ borderTop: `4px solid ${f.color}`, cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '8px', color: '#1d3557' }}>{f.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;