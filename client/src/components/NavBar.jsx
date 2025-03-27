import { Link } from "react-router-dom";
import { descargarSQLDump } from "../functions/getAndDownloadDump.js";
import "../styles/Navbar.css"


export default function NavBar() {

  return (
    <header className="header" >
      <a href="/" className="logo">
        <img src="/vite.svg" height={90} />
      </a>

      <nav className="navbar">
        <Link to="/">
          Registros
        </Link>

        <Link to="/create">
          Crear Registro
        </Link>

        <button onClick={descargarSQLDump} className="button-nav">
          Exportar BD
        </button>
      </nav>
    </header>
  );
}
