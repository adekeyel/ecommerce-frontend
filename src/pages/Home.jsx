import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const activeCategory = searchParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchParams.get('keyword')) params.keyword = searchParams.get('keyword');
      if (searchParams.get('category')) params.category = searchParams.get('category');
      const { data } = await api.get('/products', { params });
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(data.data))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword) params.keyword = keyword;
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params);
  };

  const handleCategoryClick = (id) => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (id) params.category = id;
    setSearchParams(params);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Everyday essentials, chosen well.</h1>
          <p>
            Browse a curated catalog of electronics, apparel, and home goods — stocked,
            checked, and shipped fast.
          </p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container page">
        <div className="flex gap-8" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${!activeCategory ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleCategoryClick('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading && <Loader />}
        {error && <Message>{error}</Message>}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">No products match your search.</div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
