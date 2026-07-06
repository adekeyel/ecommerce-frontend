import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  category: '',
  stock: '',
  isFeatured: false,
};

const AdminProductEdit = () => {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.data;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          category: p.category?.id || '',
          stock: p.stock,
          isFeatured: p.isFeatured,
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (isNew) {
        await api.post('/products', payload);
      } else {
        await api.put(`/products/${id}`, payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="form-card" style={{ margin: '0 auto' }}>
      <h3 style={{ marginBottom: 20 }}>{isNew ? 'New product' : 'Edit product'}</h3>
      {error && <Message>{error}</Message>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (USD)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock quantity</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </div>
        <div className="form-group flex gap-8" style={{ alignItems: 'center' }}>
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            style={{ width: 'auto' }}
            checked={form.isFeatured}
            onChange={handleChange}
          />
          <label htmlFor="isFeatured" style={{ margin: 0, textTransform: 'none' }}>
            Feature this product on the homepage
          </label>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductEdit;
