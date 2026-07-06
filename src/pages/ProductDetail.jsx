import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (error) return <div className="container page"><Message>{error}</Message></div>;
  if (!product) return null;

  return (
    <div className="container page">
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </button>
      <div className="product-detail">
        <img src={product.imageUrl} alt={product.name} />
        <div>
          {product.category?.name && <span className="product-category">{product.category.name}</span>}
          <h1 style={{ marginTop: 8 }}>{product.name}</h1>
          <p className="muted" style={{ marginTop: 16, lineHeight: 1.6 }}>
            {product.description}
          </p>
          <div className="price-tag" style={{ marginTop: 20, fontSize: '1.3rem' }}>
            ${product.price.toFixed(2)}
          </div>

          {product.stock > 0 ? (
            <>
              <div className="qty-selector">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="muted">{product.stock} in stock</span>
              </div>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                {added ? 'Added ✓' : 'Add to cart'}
              </button>
            </>
          ) : (
            <p className="stock-out" style={{ marginTop: 20 }}>
              Currently out of stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
