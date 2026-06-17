import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 🍕`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
            Crafted with<br />
            <span style={{ color: '#E63946' }}>passion.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: 1.8 }}>
            Build your perfect pizza exactly<br />
            the way you like it. Fresh ingredients,<br />
            delivered fast.
          </p>

          {/* Feature pills */}
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
            {['🔐 Secure authentication', '🍕 100+ ingredient combinations', '💳 Safe & fast payments', '📦 Real-time order tracking'].map(f => (
              <div key={f} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '100px',
                padding: '8px 18px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card fade-in-up">
          <div style={{ marginBottom: '32px' }}>
            <p className="section-title">Welcome back</p>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1d3557', marginBottom: '8px' }}>
              Sign in to your account
            </h2>
            <p style={{ color: '#666', fontSize: '15px' }}>
              Don't have one? <Link to="/register" className="link">Create account →</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '16px', color: '#aaa'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', marginTop: '-8px' }}>
              <Link to="/forgot-password" className="link" style={{ fontSize: '13px' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Signing in...</>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f8f4f0',
            borderRadius: '10px',
            border: '1px solid #e8e0d8'
          }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#1d3557', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Demo Credentials
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={() => setForm({ email: 'admin@pizzaapp.com', password: 'Admin@123' })}
                style={{ padding: '8px', background: '#1d3557', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                👑 Admin Login
              </button>
              <button onClick={() => setForm({ email: 'testuser@gmail.com', password: 'password123' })}
                style={{ padding: '8px', background: '#E63946', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                👤 User Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;