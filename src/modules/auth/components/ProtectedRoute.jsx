import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

const ROLE_HOME = {
  administrador: '/admin/home',
  paciente: '/',
};

function ProtectedRoute({ children, redirectTo = '/login', allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  //entender este bloque
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedRole = role?.toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedRole) {
      return <Navigate to={redirectTo} replace />;
    }

    if (!normalizedAllowed.includes(normalizedRole)) {
      const fallback = ROLE_HOME[normalizedRole] || redirectTo;
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
