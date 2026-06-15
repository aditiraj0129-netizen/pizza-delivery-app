import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api';

const STATUSES = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

const statusColor = {
  'Order Received': '#ffc107',
  'In the Kitchen': '#fd7e14',
  'Sent to Delivery': '#0dcaf0',
  'Delivered': '#198754'
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/admin/all');
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/admin/${id}/status`, { status });
      toast.success('✅ Status updated & customer notified!');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: '8px' }}>All Orders</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          {orders.length} total · Auto-refreshes every 15s
        </p>

        {orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#666' }}>No orders yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px' }}>{order.user?.name}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>{order.user?.email}</p>
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {new Date(order.createdAt).toLocaleString()} · <strong style={{ color: '#e63946' }}>₹{order.totalPrice}</strong>
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: `2px solid ${statusColor[order.status]}`,
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: statusColor[order.status],
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[order.pizzaBase, order.sauce, order.cheese, ...order.veggies].map((item, i) => (
                  <span key={i} style={{ background: '#f0f0f0', padding: '3px 10px', borderRadius: '20px', fontSize: '13px' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminOrders;