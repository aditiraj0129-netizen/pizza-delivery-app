import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

// Pizza card images using food emojis styled beautifully
const PIZZA_IMAGES = {
  'Margherita': '🍅',
  'BBQ Chicken': '🍗',
  'Veggie Supreme': '🥦',
  'Pepperoni': '🍖',
  default: '🍕'
};

function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const recentOrder = orders[0];

  const statusColor = {
    'Order Received': '#ffc107',
    'In the Kitchen': '#fd7e14',
    'Sent to Delivery': '#0dcaf0',
    'Delivered': '#2a9d8f'
  };

  const pizzaOptions = [
    { name: 'Classic Margherita', desc: 'Tomato sauce, fresh mozzarella', price: 199, emoji: '🍅', color: '#fff0f0' },
    { name: 'BBQ Smoky', desc: 'BBQ sauce, cheddar, onions', price: 249, emoji: '🍗', color: '#fff4e6' },
    { name: 'Veggie Delight', desc: 'Pesto, mushrooms, bell peppers', price: 229, emoji: '🥦', color: '#e8f5e9' },
    { name: 'Cheese Burst', desc: 'Four cheese blend, garlic sauce', price: 279, emoji: '🧀', color: '#f3e8ff' },
  ];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── Hero Section ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1d3557 0%, #2d4a73 60%, #1d3557 100%)',
        padding: '60px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px',
          fontSize: '280px', opacity: 0.06, transform: 'rotate(-15deg)',
          lineHeight: 1
        }}>🍕</div>
        <div style={{
          position: 'absolute', left: '5%', bottom: '-20px',
          fontSize: '120px', opacity: 0.04, transform: 'rotate(10deg)'
        }}>🍕</div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '40px' }}>
            <div>
              <p style={{ color: '#E63946', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '48px',
                color: 'white',
                lineHeight: 1.15,
                marginBottom: '16px'
              }}>
                Hey, {user?.name.split(' ')[0]}! 👋<br />
                <span style={{ color: '#E63946' }}>Ready to build</span> your pizza?
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', marginBottom: '36px', maxWidth: '480px' }}>
                Choose from 5 bases, 5 sauces, 4 cheeses and 8 toppings.
                Your perfect pizza is just a few clicks away.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/customize" style={{
                  background: '#E63946',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '16px',
                  boxShadow: '0 4px 20px rgba(230,57,70,0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}>
                  🍕 Build Your Pizza
                </Link>
                <Link to="/my-orders" style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📦 Track Orders
                </Link>
              </div>
            </div>

            {/* Stats card */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '28px 32px',
              minWidth: '220px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                Your Stats
              </p>
              {[
                { label: 'Total Orders', value: orders.length, icon: '📦' },
                { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: '✅' },
                { label: 'In Progress', value: orders.filter(o => o.status !== 'Delivered').length, icon: '🔄' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{s.icon} {s.label}</span>
                  <span style={{ color: 'white', fontWeight: '800', fontSize: '20px' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px' }}>

        {/* ── Active Order Banner ── */}
        {recentOrder && recentOrder.status !== 'Delivered' && (
          <div style={{
            background: 'white',
            border: `2px solid ${statusColor[recentOrder.status]}`,
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: `0 4px 20px ${statusColor[recentOrder.status]}22`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px',
                background: `${statusColor[recentOrder.status]}22`,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px'
              }}>
                {recentOrder.status === 'In the Kitchen' ? '👨‍🍳' : recentOrder.status === 'Sent to Delivery' ? '🛵' : '📋'}
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '15px', color: '#1d3557' }}>
                  Active Order #{recentOrder._id.slice(-6).toUpperCase()}
                </p>
                <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                  {recentOrder.pizzaBase} · {recentOrder.sauce} · {recentOrder.cheese}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                background: `${statusColor[recentOrder.status]}22`,
                color: statusColor[recentOrder.status],
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '700'
              }}>
                {recentOrder.status}
              </span>
              <Link to="/my-orders" style={{
                color: '#1d3557', textDecoration: 'none', fontSize: '13px',
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                Track →
              </Link>
            </div>
          </div>
        )}

        {/* ── Popular Pizzas ── */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <p className="section-title">Our Specialties</p>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Popular Pizzas</h2>
            </div>
            <Link to="/customize" className="link" style={{ fontWeight: '600' }}>Customize yours →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {pizzaOptions.map((pizza, i) => (
              <div key={pizza.name} className="card card-hover" style={{
                padding: 0,
                overflow: 'hidden',
                animationDelay: `${i * 0.1}s`
              }}>
                {/* Image area */}
                <div style={{
                  background: pizza.color,
                  height: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '72px',
                  position: 'relative'
                }}>
                  {pizza.emoji}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'white',
                    borderRadius: '100px',
                    padding: '4px 12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#E63946'
                  }}>
                    ₹{pizza.price}
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1d3557', marginBottom: '6px' }}>
                    {pizza.name}
                  </h3>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>{pizza.desc}</p>
                  <Link to="/customize" style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#1d3557',
                    color: 'white',
                    padding: '9px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => e.target.style.background = '#E63946'}
                    onMouseLeave={e => e.target.style.background = '#1d3557'}
                  >
                    Customize & Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '48px 40px',
          marginBottom: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="section-title">Simple Process</p>
            <h2 className="section-heading">How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
            {[
              { step: '01', icon: '🧱', title: 'Choose Base', desc: 'Pick from 5 crust types' },
              { step: '02', icon: '🍅', title: 'Add Sauce', desc: 'Select your favorite sauce' },
              { step: '03', icon: '🧀', title: 'Pick Cheese', desc: 'Mozzarella to vegan' },
              { step: '04', icon: '🥦', title: 'Add Toppings', desc: 'Load up on veggies' },
              { step: '05', icon: '💳', title: 'Pay Securely', desc: 'Razorpay powered' },
              { step: '06', icon: '🛵', title: 'Track Live', desc: 'Real-time updates' },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'var(--cream)',
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto 14px',
                  position: 'relative'
                }}>
                  {s.icon}
                  <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: '#E63946', color: 'white',
                    width: '20px', height: '20px',
                    borderRadius: '50%',
                    fontSize: '10px', fontWeight: '800',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {s.step}
                  </div>
                </div>
                <h4 style={{ fontWeight: '700', color: '#1d3557', marginBottom: '6px', fontSize: '15px' }}>{s.title}</h4>
                <p style={{ color: '#888', fontSize: '13px' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;