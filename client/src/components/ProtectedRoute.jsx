import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { isTokenExpired } from "../functions/parseJwt";

// ProtectedRoute.jsx
// Este componente se encarga de proteger las rutas que requieren autenticación  
export default function ProtectedRoute({ children }) {
  const { user, token } = useAuthStore();

  // Si no hay usuario o token, redirigir al login
  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  // Verificar si el token ha expirado
  if (isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }

  return children;
}