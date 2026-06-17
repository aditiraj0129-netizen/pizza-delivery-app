import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

const STEP_ICONS = { 0: '🧱', 1: '🍅', 2: '🧀', 3: '🥦' };
const STEP_COLORS = { 0: '#E63946', 1: '#f4a261', 2: '#ffd700', 3: '#2a9d8f' };

function CustomizePizza() {
  const [options, setOptions] = useState({ bases: [], sauces: [], cheeses: [], veggies: [] });
  const [selection, setSelection] = useState({ pizzaBase: '', sauce: '', cheese: '', veggies: [] });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASE_PRICE = 199;
  const VEGGIE_PRICE = 30;
  const totalPrice = BASE_PRICE + (selection.veggies.length * VEGGIE_PRICE);

  const steps = [
    { title: 'Choose Base', subtitle: 'Your foundation', key: 'pizzaBase', items: options.bases },
    { title: 'Pick Sauce', subtitle: 'Flavor starts here', key: 'sauce', items: options.sauces },
    { title: 'Select Cheese', subtitle: 'The good stuff', key: 'cheese', items: options.cheeses },
    { title: 'Add Veggies', subtitle: 'Optional toppings', key: 'veggies', items: options.veggies },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await API.get('/pizza/options');
        setOptions(data);
      } catch {
        toast.error('Failed to load options');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const toggleVeggie = (v) => {
    setSelection(prev => ({
      ...prev,
      veggies: prev.veggies.includes(v) ? prev.veggies.filter(x => x !== v) : [...prev.veggies, v]
    }));
  };

  const canGoNext = () => {
    if (currentStep === 0) return !!selection.pizzaBase;
    if (currentStep === 1) return !!selection.sauce;
    if (currentStep === 2) return !!selection.cheese;
    return true;
  };

  const handleProceed = () => {
    if (!selection.pizzaBase || !selection.sauce || !selection.cheese) {
      toast.error('Please complete all required steps!');
      return;
    }
    navigate('/checkout', { state: { ...selection, totalPrice } });
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading ingredients...</p>
    </div>
  );

  const currentStepData = steps[currentStep];
  const isVeggieStep = currentStep === 3;

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e8e8e8',
        padding: '24px 32px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1d3557', marginBottom: '4px' }}>
            🍕 Build Your Perfect Pizza
          </h1>
          <p style={{ color: '#888', fontSize: '15px' }}>
            Customize every ingredient exactly how you like it
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>

          {/* Left: Steps */}
          <div>
            {/* Step Progress */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px',
              background: 'white',
              borderRadius: '14px',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {steps.map((step, i) => (
                <div key={step.title} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                  <div
                    onClick={() => setCurrentStep(i)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '6px'
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px',
                      borderRadius: '50%',
                      background: i === currentStep ? STEP_COLORS[i] : i < currentStep ? '#e8f5e9' : '#f0f0f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px',
                      border: i === currentStep ? `3px solid ${STEP_COLORS[i]}` : '3px solid transparent',
                      boxShadow: i === currentStep ? `0 4px 14px ${STEP_COLORS[i]}44` : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {i < currentStep ? '✓' : STEP_ICONS[i]}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: i === currentStep ? '700' : '500',
                      color: i === currentStep ? STEP_COLORS[i] : '#aaa',
                      whiteSpace: 'nowrap'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      margin: '0 8px',
                      background: i < currentStep ? '#2a9d8f' : '#e8e8e8',
                      marginBottom: '20px',
                      transition: 'all 0.3s'
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '28px' }}>{STEP_ICONS[currentStep]}</span>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1d3557' }}>
                      {currentStepData.title}
                    </h2>
                    <p style={{ color: '#888', fontSize: '14px' }}>{currentStepData.subtitle}
                      {!isVeggieStep && <span style={{ color: '#E63946', fontSize: '12px', marginLeft: '8px' }}>* Required</span>}
                      {isVeggieStep && <span style={{ color: '#2a9d8f', fontSize: '12px', marginLeft: '8px' }}>Optional — ₹{VEGGIE_PRICE} each</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {currentStepData.items.map(item => {
                  const isSelected = isVeggieStep
                    ? selection.veggies.includes(item)
                    : selection[currentStepData.key] === item;

                  return (
                    <button
                      key={item}
                      onClick={() => isVeggieStep
                        ? toggleVeggie(item)
                        : setSelection({ ...selection, [currentStepData.key]: item })
                      }
                      style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: `2px solid ${isSelected ? STEP_COLORS[currentStep] : '#e8e8e8'}`,
                        background: isSelected ? `${STEP_COLORS[currentStep]}15` : 'white',
                        color: isSelected ? STEP_COLORS[currentStep] : '#555',
                        fontWeight: isSelected ? '700' : '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {isSelected && '✓ '}{item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentStep(s => s - 1)}
                disabled={currentStep === 0}
                className="btn btn-ghost"
                style={{ padding: '12px 28px' }}
              >
                ← Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => {
                    if (!canGoNext()) {
                      toast.error(`Please select a ${currentStepData.title.toLowerCase().replace('choose ', '').replace('pick ', '').replace('select ', '')}`);
                      return;
                    }
                    setCurrentStep(s => s + 1);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleProceed}
                  className="btn btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  Proceed to Checkout →
                </button>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div style={{ position: 'sticky', top: '88px' }}>
            {/* Pizza Visual */}
            <div style={{
              background: 'linear-gradient(135deg, #1d3557, #2d4a73)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '16px', animation: 'pulse 2s infinite' }}>
                🍕
              </div>
              <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '20px' }}>
                Your Pizza
              </h3>

              {[
                { label: 'Base', value: selection.pizzaBase, icon: '🧱' },
                { label: 'Sauce', value: selection.sauce, icon: '🍅' },
                { label: 'Cheese', value: selection.cheese, icon: '🧀' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{ color: item.value ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: '600' }}>
                    {item.value || '—'}
                  </span>
                </div>
              ))}

              {selection.veggies.length > 0 && (
                <div style={{ marginTop: '8px', textAlign: 'left' }}>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '8px' }}>🥦 Veggies</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selection.veggies.map(v => (
                      <span key={v} style={{
                        background: 'rgba(42,157,143,0.3)',
                        color: '#7fffd4',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="card">
              <h4 style={{ fontWeight: '700', color: '#1d3557', marginBottom: '16px' }}>Price Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Base pizza</span>
                  <span>₹{BASE_PRICE}</span>
                </div>
                {selection.veggies.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>{selection.veggies.length} topping{selection.veggies.length > 1 ? 's' : ''}</span>
                    <span>₹{selection.veggies.length * VEGGIE_PRICE}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>Total</span>
                  <span style={{ fontWeight: '800', fontSize: '20px', color: '#E63946' }}>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizePizza;