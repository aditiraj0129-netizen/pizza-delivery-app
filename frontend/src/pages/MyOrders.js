import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const statusColor = {
  'Order Received': '#ffc107',
  'In the Kitchen': '#fd7e14',
  'Sent to Delivery': '#0dcaf0',
  'Delivered': '#198754'
};

const statusSteps = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="page"><div className="container"><p>Loading orders...</p></div></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '750px' }}>
        <h1 style={{ marginBottom: '8px' }}>My Orders</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Auto-refreshes every 30 seconds</p>

        {orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>No orders yet!</p>
            <Link to="/customize" className="btn btn-primary">Order Your First Pizza 🍕</Link>
          </div>
        ) : (
          orders.map(order => {
            const stepIndex = statusSteps.indexOf(order.status);
            return (
              <div key={order._id} className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '15px' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: '13px', color: '#999' }}>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span style={{
                    background: statusColor[order.status],
                    color: 'white',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* Progress dots */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px', gap: '0' }}>
                  {statusSteps.map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div title={step} style={{
                        width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                        background: i <= stepIndex ? statusColor[step] : '#ddd',
                        border: i === stepIndex ? `2px solid ${statusColor[step]}` : 'none',
                        boxShadow: i === stepIndex ? `0 0 0 3px ${statusColor[step]}33` : 'none'
                      }} />
                      {i < statusSteps.length - 1 && (
                        <div style={{ flex: 1, height: '2px', background: i < stepIndex ? '#aaa' : '#eee' }} />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '14px', color: '#555', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px' }}>{order.pizzaBase}</span>
                  <span style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px' }}>{order.sauce}</span>
                  <span style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px' }}>{order.cheese}</span>
                  {order.veggies.map(v => <span key={v} style={{ background: '#e8f5e9', padding: '4px 10px', borderRadius: '20px' }}>{v}</span>)}
                </div>

                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', fontWeight: '600', color: '#e63946' }}>
                  ₹{order.totalPrice}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyOrders;