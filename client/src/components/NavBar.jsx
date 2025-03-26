import { Link } from "react-router-dom";
import { descargarSQLDump } from "../functions/getAndDownloadDump.js";
import "../styles/Navbar.css"

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavBar() {

  return (
    <header className="header" >
      <a href="/" className="logo">
        <img src="/vite.svg" height={100} />
      </a>

      <nav className="navbar">
        <Link to="/">
          Search Page
        </Link>

        <Link to="/create">
          Create Page
        </Link>

        <button onClick={descargarSQLDump} className="button-nav">
          Exportar DB
        </button>
      </nav>
    </header>
  );
}
