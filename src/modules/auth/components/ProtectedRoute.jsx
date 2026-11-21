import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

const ROLE_HOME = {
  Administrador: '/admin/home',
  Paciente: '/',
};

function ProtectedRoute({ children, redirectTo = '/login', allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role) {
      return <Navigate to={redirectTo} replace />;
    }

    if (!allowedRoles.includes(role)) {
      const fallback = ROLE_HOME[role] || redirectTo;
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
