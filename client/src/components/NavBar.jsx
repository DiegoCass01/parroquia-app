import { Link } from "react-router-dom";
import { descargarSQLDump } from "../functions/getAndDownloadDump.js";
import "../styles/Navbar.css"


export default function NavBar() {

  return (
    <header className="header" >
      <a href="/" className="logo">
        <img src="/vite.svg" />
      </a>

      <nav className="navbar">
        <Link to="/">
          <p>
            Registros
          </p>
        </Link>

        <Link to="/create">
          <p>
            Crear Registro
          </p>
        </Link>

        <button onClick={descargarSQLDump} className="button-nav">
          <p>
            Exportar BD
          </p>
        </button>
      </nav>
    </header>
  );
}
