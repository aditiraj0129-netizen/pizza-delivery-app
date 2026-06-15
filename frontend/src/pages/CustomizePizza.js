import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

function CustomizePizza() {
  const [options, setOptions] = useState({ bases: [], sauces: [], cheeses: [], veggies: [] });
  const [selection, setSelection] = useState({ pizzaBase: '', sauce: '', cheese: '', veggies: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASE_PRICE = 199;
  const VEGGIE_PRICE = 30;
  const totalPrice = BASE_PRICE + (selection.veggies.length * VEGGIE_PRICE);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/pizza/options');
        setOptions(data);
      } catch {
        toast.error('Failed to load options');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleVeggie = (v) => {
    setSelection(prev => ({
      ...prev,
      veggies: prev.veggies.includes(v)
        ? prev.veggies.filter(x => x !== v)
        : [...prev.veggies, v]
    }));
  };

  const handleProceed = () => {
    if (!selection.pizzaBase || !selection.sauce || !selection.cheese) {
      toast.error('Please select a base, sauce, and cheese!');
      return;
    }
    navigate('/checkout', { state: { ...selection, totalPrice } });
  };

  const OptionButton = ({ value, selected, onClick, color = '#e63946' }) => (
    <button onClick={onClick} className="btn" style={{
      background: selected ? color : '#f5f5f5',
      color: selected ? 'white' : '#333',
      border: `2px solid ${selected ? color : 'transparent'}`,
      margin: '4px',
      fontSize: '14px'
    }}>
      {selected ? '✓ ' : ''}{value}
    </button>
  );

  if (loading) return <div className="page container"><p>Loading pizza options...</p></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '8px' }}>Build Your Pizza 🍕</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Customize every ingredient</p>

        {/* Step 1 */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1d3557', marginBottom: '4px' }}>Step 1 — Choose Your Base</h3>
          <p style={{ color: '#999', fontSize: '13px', marginBottom: '14px' }}>Pick one (required)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {options.bases.map(b => (
              <OptionButton key={b} value={b} selected={selection.pizzaBase === b}
                onClick={() => setSelection({ ...selection, pizzaBase: b })} />
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1d3557', marginBottom: '4px' }}>Step 2 — Choose Your Sauce</h3>
          <p style={{ color: '#999', fontSize: '13px', marginBottom: '14px' }}>Pick one (required)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {options.sauces.map(s => (
              <OptionButton key={s} value={s} selected={selection.sauce === s}
                onClick={() => setSelection({ ...selection, sauce: s })} color="#457b9d" />
            ))}
          </div>
        </div>

        {/* Step 3 */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1d3557', marginBottom: '4px' }}>Step 3 — Choose Your Cheese</h3>
          <p style={{ color: '#999', fontSize: '13px', marginBottom: '14px' }}>Pick one (required)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {options.cheeses.map(c => (
              <OptionButton key={c} value={c} selected={selection.cheese === c}
                onClick={() => setSelection({ ...selection, cheese: c })} color="#f4a261" />
            ))}
          </div>
        </div>

        {/* Step 4 */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1d3557', marginBottom: '4px' }}>Step 4 — Add Veggies</h3>
          <p style={{ color: '#999', fontSize: '13px', marginBottom: '14px' }}>₹{VEGGIE_PRICE} each — pick as many as you want</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {options.veggies.map(v => (
              <OptionButton key={v} value={v} selected={selection.veggies.includes(v)}
                onClick={() => toggleVeggie(v)} color="#2a9d8f" />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ background: '#1d3557', color: 'white' }}>
          <h3 style={{ marginBottom: '16px' }}>📋 Your Order</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '15px', marginBottom: '20px' }}>
            <span style={{ opacity: 0.7 }}>Base:</span><strong>{selection.pizzaBase || '—'}</strong>
            <span style={{ opacity: 0.7 }}>Sauce:</span><strong>{selection.sauce || '—'}</strong>
            <span style={{ opacity: 0.7 }}>Cheese:</span><strong>{selection.cheese || '—'}</strong>
            <span style={{ opacity: 0.7 }}>Veggies:</span><strong>{selection.veggies.length > 0 ? selection.veggies.join(', ') : 'None'}</strong>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '22px' }}>Total: <strong>₹{totalPrice}</strong></span>
            <button onClick={handleProceed} className="btn" style={{ background: '#e63946', color: 'white', padding: '12px 28px', fontSize: '16px' }}>
              Proceed to Pay →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizePizza;