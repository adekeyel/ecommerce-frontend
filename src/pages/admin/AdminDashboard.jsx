import { Link, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/admin', label: 'Overview', end: true },
  { path: '/admin/products', label: 'Products' },
  { path: '/admin/orders', label: 'Orders' },
];

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="container page">
      <h1 style={{ marginBottom: 24 }}>Admin Dashboard</h1>
      <div className="flex gap-8" style={{ marginBottom: 28 }}>
        {tabs.map((tab) => {
          const isActive = tab.end
            ? location.pathname === tab.path
            : location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
