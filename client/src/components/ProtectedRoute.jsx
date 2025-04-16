import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// ProtectedRoute.jsx
// Este componente se encarga de proteger las rutas que requieren autenticación  
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useAuthStore();

  // Si no hay usuario o token, redirigir al login
  if (!user || !token) {
    return <Navigate to="/" />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.rol)) {
      return <Navigate to="/" />;
    }
  }
  return children;
}