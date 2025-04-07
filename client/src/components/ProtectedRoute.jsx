import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// ProtectedRoute.jsx
// Este componente se encarga de proteger las rutas que requieren autenticación  
export default function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" />;
}
