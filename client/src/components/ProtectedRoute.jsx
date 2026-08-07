import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth(); const location = useLocation();
  if (loading) return <Loading label="Checking your account…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/account" replace />;
  return children;
}
