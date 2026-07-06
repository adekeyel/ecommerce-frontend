import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    api
      .get('/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <h3>All products ({products.length})</h3>
        <Link to="/admin/products/new" className="btn btn-primary btn-sm">
          + New product
        </Link>
      </div>
      {error && <Message>{error}</Message>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category?.name || '—'}</td>
              <td className="price-tag">${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td className="flex gap-8">
                <Link to={`/admin/products/${p.id}/edit`} className="btn btn-outline btn-sm">
                  Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
