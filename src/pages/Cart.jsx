import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const total = itemsPrice + shipping;

  const handleCheckout = () => {
    navigate(user ? '/checkout' : '/login?redirect=/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p className="muted" style={{ margin: '12px 0 20px' }}>
            Browse the catalog and add something you like.
          </p>
          <Link to="/" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 style={{ marginBottom: 24 }}>Your Cart</h1>
      <div className="product-detail" style={{ alignItems: 'start' }}>
        <div>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.product}>
              <img src={item.image} alt={item.name} />
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <span className="price-tag" style={{ marginTop: 6 }}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item.product, Number(e.target.value))}
              >
                {Array.from({ length: item.stock || 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="price-tag">${(item.price * item.qty).toFixed(2)}</span>
              <button className="btn btn-outline btn-sm" onClick={() => removeFromCart(item.product)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={handleCheckout}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
