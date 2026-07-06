import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Shop<span>Sphere</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Products</Link>
          {user?.isAdmin && <Link to="/admin">Admin</Link>}
          {user && <Link to="/orders">My Orders</Link>}
          <Link to="/cart" className="cart-badge">
            Cart
            {itemsCount > 0 && <span className="cart-count">{itemsCount}</span>}
          </Link>
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
