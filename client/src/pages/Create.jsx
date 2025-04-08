import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import { SacramentosCard } from "../components/SacramentosCard";

export default function Create() {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    const [accion, tipo] = e.currentTarget.name.split(":");
    navigate(`/${accion}/${tipo}`);
  }

  return (
    <div className="homepage">
      <h1 className="homepage-title">Bienvenido! Crea un Sacramento</h1>
      <div className="sacramentos-container">
        <SacramentosCard name={"create:bautizo"} handleNavigate={handleNavigate} title={"Bautizos"} />
        <SacramentosCard name={"create:comunion"} handleNavigate={handleNavigate} title={"Comuniones"} />
        <SacramentosCard name={"create:confirmacion"} handleNavigate={handleNavigate} title={"Confirmaciones"} />
        <SacramentosCard name={"create:matrimonio"} handleNavigate={handleNavigate} title={"Matrimonios"} />
      </div>

    </div>
  )
}