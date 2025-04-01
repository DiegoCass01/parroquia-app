import { Link, useLocation } from "react-router-dom";
import { descargarSQLDump } from "../functions/getAndDownloadDump.js";
import "../styles/Navbar.css"

export default function NavBar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        <p>Registros</p>
      </Link>

      <Link to="/create" className={location.pathname === "/create" ? "active" : ""}>
        <p>Crear Registro</p>
      </Link>

      <button onClick={descargarSQLDump} className="button-nav">
        <p>Exportar BD</p>
      </button>
    </nav>
  );
}
