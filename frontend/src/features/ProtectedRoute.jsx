import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ requireAdmin }) {
  const { token, role } = useSelector((state) => state.auth);
  const location = useLocation();

  
  const isAdminRoute = location.pathname.includes('/dashboard/') && 
    ['users', 'categories', 'fournisseurs', 'statistique'].some(path => 
      location.pathname.includes(path)
    );


  const isProfileRoute = location.pathname.includes('/dashboard/profile');

  if (!token) {
    return <Navigate to="/" replace />;
  }

 
  if (isProfileRoute && role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  
  if (isAdminRoute && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}