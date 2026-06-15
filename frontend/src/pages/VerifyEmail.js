import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get(`/auth/verify-email/${token}`);
        setMessage(data.message);
        setStatus('success');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Verification failed');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && <><h2>⏳ Verifying...</h2><p style={{ marginTop: '16px', color: '#666' }}>Please wait</p></>}
        {status === 'success' && (
          <>
            <h2 style={{ color: '#2a9d8f' }}>✅ Email Verified!</h2>
            <p style={{ margin: '16px 0', color: '#666' }}>{message}</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 style={{ color: '#e63946' }}>❌ Verification Failed</h2>
            <p style={{ margin: '16px 0', color: '#666' }}>{message}</p>
            <Link to="/login" className="btn btn-outline">Go to Login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;