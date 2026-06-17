import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getPasswordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: 'Too short', color: '#E63946', width: '20%' };
    if (p.length < 8) return { label: 'Weak', color: '#fd7e14', width: '40%' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: '#ffc107', width: '65%' };
    return { label: 'Strong', color: '#2a9d8f', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Panel */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🍕</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '42px',
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '20px'
          }}>
            Your pizza,<br />
            <span style={{ color: '#E63946' }}>your rules.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: 1.8 }}>
            Join thousands of pizza lovers<br />
            who craft their perfect slice<br />
            every single day.
          </p>

          <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { num: '5+', label: 'Base Options' },
              { num: '5+', label: 'Sauce Options' },
              { num: '4+', label: 'Cheese Types' },
              { num: '8+', label: 'Toppings' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#E63946', fontSize: '24px', fontWeight: '800' }}>{s.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card fade-in-up">
          <div style={{ marginBottom: '32px' }}>
            <p className="section-title">Join us today</p>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1d3557', marginBottom: '8px' }}>
              Create your account
            </h2>
            <p style={{ color: '#666', fontSize: '15px' }}>
              Already have one? <Link to="/login" className="link">Sign in →</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#aaa' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Password strength bar */}
              {strength && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', background: '#e8e8e8', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s', borderRadius: '2px' }} />
                  </div>
                  <p style={{ fontSize: '12px', color: strength.color, marginTop: '4px', fontWeight: '600' }}>{strength.label}</p>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Creating account...</>
              ) : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
            By registering you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;