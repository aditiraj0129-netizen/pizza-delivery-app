import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api';

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const { data } = await API.get('/inventory');
      setInventory(data);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const seedInventory = async () => {
    try {
      await API.post('/inventory/seed');
      toast.success('Inventory seeded!');
      fetchInventory();
    } catch {
      toast.error('Seed failed');
    }
  };

  const updateQty = async (id, qty) => {
    try {
      await API.put(`/inventory/${id}`, { quantity: Number(qty) });
      toast.success('Stock updated!');
      setEditing({});
      fetchInventory();
    } catch {
      toast.error('Update failed');
    }
  };

  const grouped = inventory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>Inventory 📦</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Items marked ⚠️ are below threshold</p>
          </div>
          <button onClick={seedInventory} className="btn btn-secondary">Reset to Default Stock</button>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '32px' }}>
            <h2 style={{
              textTransform: 'capitalize',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '2px solid #e63946',
              color: '#1d3557'
            }}>
              {category}s ({items.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {items.map(item => {
                const isLow = item.quantity < item.threshold;
                const isEditing = editing[item._id] !== undefined;
                return (
                  <div key={item._id} className="card" style={{ borderLeft: `4px solid ${isLow ? '#dc3545' : '#2a9d8f'}`, padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px' }}>{item.name}</strong>
                      {isLow && <span title="Low stock">⚠️</span>}
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                      Stock: <strong style={{ color: isLow ? '#dc3545' : '#333' }}>{item.quantity}</strong> · Min: {item.threshold}
                    </p>

                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="number"
                          min="0"
                          value={editing[item._id]}
                          onChange={(e) => setEditing({ ...editing, [item._id]: e.target.value })}
                          style={{ width: '70px', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <button onClick={() => updateQty(item._id, editing[item._id])} className="btn btn-success" style={{ padding: '5px 10px', fontSize: '13px' }}>✓</button>
                        <button onClick={() => setEditing({})} className="btn" style={{ padding: '5px 10px', fontSize: '13px', background: '#eee' }}>✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditing({ [item._id]: item.quantity })}
                        className="btn btn-secondary"
                        style={{ padding: '5px 12px', fontSize: '13px', width: '100%' }}
                      >
                        Update Stock
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminInventory;