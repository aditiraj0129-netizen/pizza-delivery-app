import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const STEPS = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

const STATUS_CONFIG = {
  'Order Received':  { color: '#ffc107', bg: '#fff8e1', icon: '📋', emoji: '📋' },
  'In the Kitchen':  { color: '#fd7e14', bg: '#fff3e0', icon: '👨‍🍳', emoji: '👨‍🍳' },
  'Sent to Delivery':{ color: '#0dcaf0', bg: '#e0f7fa', icon: '🛵', emoji: '🛵' },
  'Delivered':       { color: '#2a9d8f', bg: '#e0f2f1', icon: '✅', emoji: '🎉' },
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8e8e8', padding: '32px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="section-title">Order History</p>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1d3557' }}>My Orders</h1>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Auto-refreshes every 30s</span>
              <button onClick={fetchOrders} style={{
                background: '#f0f0f0', border: 'none', borderRadius: '8px',
                padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#555'
              }}>
                🔄 Refresh
              </button>
              <Link to="/customize" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                + New Order
              </Link>
            </div>
          </div>

          {/* Summary stats */}
          {orders.length > 0 && (
            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Orders', value: orders.length, color: '#1d3557' },
                { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#2a9d8f' },
                { label: 'In Progress', value: orders.filter(o => o.status !== 'Delivered').length, color: '#fd7e14' },
                { label: 'Total Spent', value: `₹${orders.reduce((sum, o) => sum + o.totalPrice, 0)}`, color: '#E63946' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>🍕</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1d3557', marginBottom: '12px' }}>
              No orders yet!
            </h2>
            <p style={{ color: '#888', marginBottom: '28px', fontSize: '16px' }}>
              Build your first custom pizza and it'll appear here.
            </p>
            <Link to="/customize" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '16px' }}>
              🍕 Order Your First Pizza
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => {
              const config = STATUS_CONFIG[order.status];
              const stepIndex = STEPS.indexOf(order.status);
              const isExpanded = expandedOrder === order._id;
              const isDelivered = order.status === 'Delivered';

              return (
                <div key={order._id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: `1px solid ${isDelivered ? '#e0f2f1' : '#f0f0f0'}`,
                  transition: 'all 0.2s'
                }}>
                  {/* Order Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    style={{
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      flexWrap: 'wrap',
                      gap: '12px',
                      borderBottom: isExpanded ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px', height: '48px',
                        background: config.bg,
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px'
                      }}>
                        {config.emoji}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '15px', color: '#1d3557' }}>
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: '800', fontSize: '18px', color: '#E63946' }}>
                        ₹{order.totalPrice}
                      </span>
                      <span style={{
                        background: config.bg,
                        color: config.color,
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: config.color, display: 'inline-block' }} />
                        {order.status}
                      </span>
                      <span style={{ color: '#aaa', fontSize: '18px' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ padding: '24px', background: '#fafafa' }}>

                      {/* Progress Tracker */}
                      {!isDelivered && (
                        <div style={{ marginBottom: '28px' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                            Order Progress
                          </p>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            {STEPS.map((step, i) => {
                              const done = i <= stepIndex;
                              const active = i === stepIndex;
                              return (
                                <div key={step} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                      width: '36px', height: '36px',
                                      borderRadius: '50%',
                                      background: done ? STATUS_CONFIG[step].color : '#e8e8e8',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      fontSize: '16px',
                                      boxShadow: active ? `0 0 0 4px ${STATUS_CONFIG[step].color}33` : 'none',
                                      transition: 'all 0.3s'
                                    }}>
                                      {done ? (active ? STATUS_CONFIG[step].emoji : '✓') : '○'}
                                    </div>
                                    <span style={{
                                      fontSize: '10px',
                                      fontWeight: active ? '700' : '500',
                                      color: done ? STATUS_CONFIG[step].color : '#aaa',
                                      textAlign: 'center',
                                      maxWidth: '70px',
                                      lineHeight: 1.3
                                    }}>
                                      {step}
                                    </span>
                                  </div>
                                  {i < STEPS.length - 1 && (
                                    <div style={{
                                      flex: 1,
                                      height: '2px',
                                      margin: '17px 4px 0',
                                      background: i < stepIndex ? STATUS_CONFIG[STEPS[i]].color : '#e8e8e8',
                                      transition: 'all 0.3s'
                                    }} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {isDelivered && (
                        <div style={{
                          background: '#e0f2f1',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span style={{ fontSize: '24px' }}>🎉</span>
                          <p style={{ color: '#2a9d8f', fontWeight: '600', fontSize: '15px' }}>
                            Your pizza was delivered! Enjoy! 🍕
                          </p>
                        </div>
                      )}

                      {/* Ingredients */}
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                          Your Pizza
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {[
                            { label: order.pizzaBase, type: 'base' },
                            { label: order.sauce, type: 'sauce' },
                            { label: order.cheese, type: 'cheese' },
                            ...order.veggies.map(v => ({ label: v, type: 'veggie' }))
                          ].map((item, i) => (
                            <span key={i} style={{
                              padding: '6px 14px',
                              borderRadius: '100px',
                              fontSize: '13px',
                              fontWeight: '500',
                              background: item.type === 'veggie' ? '#e0f2f1' : item.type === 'cheese' ? '#fff8e1' : item.type === 'sauce' ? '#fff3e0' : '#f3e8ff',
                              color: item.type === 'veggie' ? '#2a9d8f' : item.type === 'cheese' ? '#f4a261' : item.type === 'sauce' ? '#fd7e14' : '#7b2d8b'
                            }}>
                              {item.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#888' }}>Payment ID: {order.paymentId?.slice(-12) || 'N/A'}</p>
                        <p style={{ fontWeight: '700', color: '#E63946' }}>Total: ₹{order.totalPrice}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;