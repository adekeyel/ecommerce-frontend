import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="product-card">
    <img src={product.imageUrl} alt={product.name} loading="lazy" />
    <div className="product-card-body">
      {product.category?.name && <span className="product-category">{product.category.name}</span>}
      <span className="product-name">{product.name}</span>
      <span className="price-tag">${product.price.toFixed(2)}</span>
      {product.stock === 0 && <span className="stock-out">Out of stock</span>}
    </div>
  </Link>
);

export default ProductCard;
