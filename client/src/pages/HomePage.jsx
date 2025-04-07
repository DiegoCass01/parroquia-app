import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import { SacramentosCard } from "../components/SacramentosCard";

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    const [accion, tipo] = e.currentTarget.name.split(":");
    navigate(`/${accion}/${tipo}`);
  }

  return (
    <div className="homepage">
      <h1 className="homepage-title">Bienvenido a la página de inicio</h1>
      <div className="sacramentos-container">
        <SacramentosCard name={"search:bautizo"} handleNavigate={handleNavigate} title={"Bautizos"} />
        <SacramentosCard name={"search:comunion"} handleNavigate={handleNavigate} title={"Comuniones"} />
        <SacramentosCard name={"search:confirmacion"} handleNavigate={handleNavigate} title={"Confirmaciones"} />
        <SacramentosCard name={"search:matrimonio"} handleNavigate={handleNavigate} title={"Matrimonios"} />
      </div>

    </div>
  )
}