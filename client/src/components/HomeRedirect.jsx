import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { isTokenExpired } from "../functions/parseJwt";

// Este componente redirige al login si el token no existe o ha expirado.
// Si está autenticado correctamente, va a /homepage
export default function HomeRedirect() {
  const { user, token } = useAuthStore();

  // Si no hay token o está expirado, redirigir al login
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }

  // Si hay token válido y usuario, redirigir al home
  return user ? <Navigate to="/" /> : <Navigate to="/login" />;
}
