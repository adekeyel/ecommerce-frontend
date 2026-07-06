import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products?limit=1'), api.get('/orders')])
      .then(([productsRes, ordersRes]) => {
        const orders = ordersRes.data.data;
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        setStats({
          totalProducts: productsRes.data.total,
          totalOrders: orders.length,
          revenue,
          pending: orders.filter((o) => o.status === 'Pending').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <div className="product-card" style={{ padding: 20 }}>
        <span className="product-category">Total products</span>
        <h2 style={{ marginTop: 8 }}>{stats.totalProducts}</h2>
      </div>
      <div className="product-card" style={{ padding: 20 }}>
        <span className="product-category">Total orders</span>
        <h2 style={{ marginTop: 8 }}>{stats.totalOrders}</h2>
      </div>
      <div className="product-card" style={{ padding: 20 }}>
        <span className="product-category">Pending orders</span>
        <h2 style={{ marginTop: 8 }}>{stats.pending}</h2>
      </div>
      <div className="product-card" style={{ padding: 20 }}>
        <span className="product-category">Total revenue</span>
        <h2 className="price-tag" style={{ marginTop: 8, fontSize: '1.4rem' }}>
          ${stats.revenue.toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default AdminOverview;
