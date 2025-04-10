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

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/homepage" />; // Puedes crear esta página o redirigir al home
  }
  return children;
}