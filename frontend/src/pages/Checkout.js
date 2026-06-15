import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api';

function Checkout() {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!state) {
    navigate('/customize');
    return null;
  }

  const { pizzaBase, sauce, cheese, veggies, totalPrice } = state;

  const handlePayment = async () => {
    try {
      const { data: order } = await API.post('/orders/create-payment', { amount: totalPrice });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Pizza App',
        description: 'Custom Pizza Order',
        order_id: order.id,
        handler: async (response) => {
          try {
            await API.post('/orders/place', {
              pizzaBase, sauce, cheese, veggies, totalPrice,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            toast.success('🎉 Order placed successfully!');
            navigate('/my-orders');
          } catch {
            toast.error('Order failed after payment. Contact support.');
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#e63946' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Try again.'));
      rzp.open();

    } catch (error) {
      toast.error('Could not initiate payment. Try again.');
    }
  };

  const rows = [
    ['Base', pizzaBase],
    ['Sauce', sauce],
    ['Cheese', cheese],
    ['Veggies', veggies?.length > 0 ? veggies.join(', ') : 'None'],
  ];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '580px' }}>
        <h1 style={{ marginBottom: '30px' }}>Checkout 🛒</h1>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1d3557' }}>Order Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 0', color: '#666', width: '100px' }}>{label}</td>
                  <td style={{ padding: '10px 0', fontWeight: '600' }}>{value}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '16px 0', fontSize: '20px', fontWeight: 'bold' }}>Total</td>
                <td style={{ padding: '16px 0', fontSize: '20px', fontWeight: 'bold', color: '#e63946' }}>₹{totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{ background: '#fffbe6', border: '1px solid #ffd700', marginBottom: '20px' }}>
          <p style={{ fontWeight: '600', marginBottom: '6px' }}>🧪 Test Mode — Use these card details:</p>
          <p style={{ fontSize: '14px', color: '#555' }}>Card: <strong>4111 1111 1111 1111</strong></p>
          <p style={{ fontSize: '14px', color: '#555' }}>Expiry: <strong>12/28</strong> &nbsp; CVV: <strong>123</strong></p>
        </div>

        <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '18px' }}>
          Pay ₹{totalPrice} Securely →
        </button>
      </div>
    </div>
  );
}

export default Checkout;