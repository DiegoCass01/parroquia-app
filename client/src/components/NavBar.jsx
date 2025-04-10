import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import "../styles/Navbar.css"
import { useAuthStore } from "../store/useAuthStore.js";

export default function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Obtener el estado y la función de logout
  const navigate = useNavigate();

  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    logout(); // Llamar a la función de logout del store
    navigate("/"); // Redirigir al home
  };

  return (
    <nav className="navbar">
      {/* Aparecerá el botón si el usuario es administrador */}
      {user && user.rol === "admin" && (
        <Link to="/edit/user" className={location.pathname === "/edit/user" ? "active" : ""}>
          <p>Admin</p>
        </Link>
      )}

      <Link to="/" className={location.pathname === "/homepage" ? "active" : ""}>
        <p>Registros</p>
      </Link>

      <Link to="/create" className={location.pathname === "/create" ? "active" : ""}>
        <p>Crear Registro</p>
      </Link>

      {/* <button onClick={descargarSQLDump} className="button-nav">
        <p className="button-nav-title">Exportar BD</p>
      </button> */}

      {/* Verificar si hay un usuario logueado para mostrar el botón de logout */}
      {user && (
        <button onClick={handleLogout} className="button-nav">
          <FontAwesomeIcon icon={faPowerOff} className="button-nav-icon" />
        </button>
      )}
    </nav>
  );
}
