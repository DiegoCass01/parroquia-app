import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faUserShield, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import "../styles/Navbar.css"
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect, useRef, useState } from "react";

export default function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Obtener el estado y la función de logout
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // 👉 Cierra el menú si se hace clic fuera del sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    // CAMBIA de 'mousedown' a 'click'
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Cierra el sidebar al cambiar de ruta
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    logout(); // Llamar a la función de logout del store
    navigate("/"); // Redirigir al home
  };

  return (
    <nav className="navbar">
      {user && (
        <>
          <section className="navbar-user-info" onClick={toggleSidebar}>
            <div className="user-details">
              <span className="user-name">{user.n_usuario}</span>
              <span className={`user-role ${user.rol}`}>{user.rol.toUpperCase()}</span>
            </div>
            <FontAwesomeIcon
              icon={
                user.rol === "admin"
                  ? faUserShield
                  : user.rol === "moderador"
                    ? faUserTie
                    : faUser
              }
              className="button-nav-icon"
            />
          </section>

          {/* Sidebar separado para detectar clics correctamente */}
          <div
            ref={sidebarRef}
            className={`sidebar-menu ${isSidebarOpen ? 'show' : ''}`}
          >
            {(user.rol === "admin" || user.rol === "moderador") && (
              <fieldset>
                <legend>Ajustes</legend>
                <button onClick={() => (navigate("/search/usuario"))} className="config">
                  <FontAwesomeIcon icon={faGear} />
                  &nbsp;&nbsp;Administrar usuarios
                </button>
              </fieldset>
            )}

            <fieldset>
              <button onClick={handleLogout} className="logout">
                <FontAwesomeIcon icon={faSignOutAlt} />
                &nbsp;&nbsp;Cerrar sesión
              </button>
            </fieldset>
          </div>
        </>
      )}

      <section className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <p>Registros</p>
        </Link>

        <Link to="/create" className={location.pathname === "/create" ? "active" : ""}>
          <p>Crear Registro</p>
        </Link>
      </section>
    </nav>

  );
}
