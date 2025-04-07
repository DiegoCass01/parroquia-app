import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// HomeRedirect.jsx
// Este componente redirige al usuario a la página de login o a la página de búsqueda dependiendo de si está autenticado
// Si el usuario está autenticado, lo redirige a "/search", de lo contrario a "/login"
export default function HomeRedirect() {
  const { user } = useAuthStore();
  return user ? <Navigate to="/homepage" /> : <Navigate to="/login" />;
}
