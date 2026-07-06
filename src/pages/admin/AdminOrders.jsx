import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusBadgeClass = (status) => `badge badge-${status.toLowerCase()}`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => setOrders(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h3 style={{ marginBottom: 20 }}>All orders ({orders.length})</h3>
      {error && <Message>{error}</Message>}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id.slice(-8).toUpperCase()}</td>
              <td>{order.user?.name || 'Unknown'}</td>
              <td className="price-tag">${order.totalPrice.toFixed(2)}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  style={{ padding: '6px 10px', width: 'auto' }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className={statusBadgeClass(order.status)} style={{ marginLeft: 8 }}>
                  {order.status}
                </span>
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
    </div>
  );
};

export default AdminOrders;
