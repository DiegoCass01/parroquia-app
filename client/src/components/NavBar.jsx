import { Link, useLocation, useNavigate } from "react-router-dom";
import { descargarSQLDump } from "../functions/getAndDownloadDump.js";
import "../styles/Navbar.css"
import { useAuthStore } from "../store/useAuthStore.js";

export default function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Obtener el estado y la función de logout
  const navigate = useNavigate();

  // Verificar si el usuario está correctamente cargado
  console.log("Usuario en NavBar:", user);

  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    logout(); // Llamar a la función de logout del store
    navigate("/"); // Redirigir al home
  };

  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === "/homepage" ? "active" : ""}>
        <p>Registros</p>
      </Link>

      <Link to="/create" className={location.pathname === "/create" ? "active" : ""}>
        <p>Crear Registro</p>
      </Link>

      <button onClick={descargarSQLDump} className="button-nav">
        <p>Exportar BD</p>
      </button>

      {/* Verificar si hay un usuario logueado para mostrar el botón de logout */}
      {user && (
        <button onClick={handleLogout} className="button-nav">
          <p>Cerrar sesión</p>
        </button>
      )}

      {/* Aparecerá el botón si el usuario es administrador */}
      {user && user.rol === "admin" && (
        <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
          <p>Admin</p>
        </Link>

      )}
    </nav>
  );
}
