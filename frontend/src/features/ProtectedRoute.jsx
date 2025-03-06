import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { token } = useSelector(state => state.auth);

  if (!token) {
    return <Navigate to="/" replace />;
  }

 
  return <Outlet />;
};

export default ProtectedRoute;