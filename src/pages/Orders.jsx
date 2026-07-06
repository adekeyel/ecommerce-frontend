import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

const statusBadgeClass = (status) => `badge badge-${status.toLowerCase()}`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my-orders')
      .then(({ data }) => setOrders(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container page">
      <h1 style={{ marginBottom: 24 }}>My Orders</h1>
      {error && <Message>{error}</Message>}
      {!error && orders.length === 0 && (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            Start shopping
          </Link>
        </div>
      )}
      {orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(-8).toUpperCase()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="price-tag">${order.totalPrice.toFixed(2)}</td>
                <td>
                  <span className={statusBadgeClass(order.status)}>{order.status}</span>
                </td>
                <td>
                  <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
