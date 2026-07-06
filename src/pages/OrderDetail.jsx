import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

const statusBadgeClass = (status) => `badge badge-${status.toLowerCase()}`;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container page"><Message>{error}</Message></div>;
  if (!order) return null;

  return (
    <div className="container page">
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1>Order #{order.id.slice(-8).toUpperCase()}</h1>
        <span className={statusBadgeClass(order.status)}>{order.status}</span>
      </div>

      <div className="product-detail" style={{ alignItems: 'start' }}>
        <div>
          <h3 style={{ marginBottom: 12 }}>Shipping address</h3>
          <p className="muted">
            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="muted" style={{ marginTop: 8 }}>Payment method: {order.paymentMethod}</p>

          <h3 style={{ margin: '24px 0 12px' }}>Items</h3>
          {order.orderItems.map((item) => (
            <div className="cart-item" key={item.product} style={{ gridTemplateColumns: '70px 1fr auto auto' }}>
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
              <span>x{item.qty}</span>
              <span className="price-tag">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 style={{ marginBottom: 16 }}>Summary</h3>
          <div className="summary-row">
            <span>Items</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
