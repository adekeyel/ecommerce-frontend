import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import Message from '../components/Message.jsx';

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const shipping = itemsPrice > 100 ? 0 : 10;
  const total = itemsPrice + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({ product: item.product, qty: item.qty }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      navigate(`/orders/${data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container page">
      <div className="form-card">
        <h2 style={{ marginBottom: 24 }}>Shipping details</h2>
        {error && <Message>{error}</Message>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input id="city" name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal code</label>
            <input
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" value={form.country} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment method</label>
            <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option>Cash on Delivery</option>
              <option>Card on Delivery</option>
              <option>Bank Transfer</option>
            </select>
          </div>

          <div className="summary-row summary-total" style={{ marginBottom: 20 }}>
            <span>Total due</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
