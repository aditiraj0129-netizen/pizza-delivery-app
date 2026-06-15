import { Link } from 'react-router-dom';

function AdminDashboard() {
  const cards = [
    { icon: '📋', title: 'Manage Orders', desc: 'View all orders and update their status', link: '/admin/orders', color: '#e63946' },
    { icon: '📦', title: 'Inventory', desc: 'Track and restock ingredients', link: '/admin/inventory', color: '#2a9d8f' },
  ];

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: '8px' }}>Admin Panel ⚙️</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Manage your pizza business</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {cards.map(c => (
            <Link to={c.link} key={c.title} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ borderLeft: `5px solid ${c.color}`, cursor: 'pointer', padding: '32px' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '44px', marginBottom: '14px' }}>{c.icon}</div>
                <h2 style={{ color: '#1d3557', marginBottom: '8px' }}>{c.title}</h2>
                <p style={{ color: '#666', fontSize: '14px' }}>{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;