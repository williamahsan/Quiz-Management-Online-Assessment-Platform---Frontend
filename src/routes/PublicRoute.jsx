import { Navigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext.jsx';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;

  return children;
};

export default PublicRoute;