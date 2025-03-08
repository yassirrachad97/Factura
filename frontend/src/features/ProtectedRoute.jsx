import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ requireAdmin }) {
  const { token, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.includes('/dashboard/') && 
    ['users', 'categories', 'fournisseurs', 'statistique'].some(path => 
      location.pathname.includes(path)
    );

  // Check if it's a profile route
  const isProfileRoute = location.pathname.includes('/dashboard/profile');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Redirect admin trying to access profile
  if (isProfileRoute && role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect non-admin users trying to access admin routes
  if (isAdminRoute && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}