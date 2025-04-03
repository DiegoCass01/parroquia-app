import { useEffect, useState } from "react";
import { generarPDF } from "../functions/feBautismoPdf.js";
import { formatDateLong } from "../functions/formatDate.js";
import { useBautismoStore } from "../store/useBautismoStore.js";
import "../styles/Searchpage.css"
import { useNavigate } from "react-router-dom";

export default function SearchPage({ showSnackbar }) {
  const { bautismos, fetchBautismos, deleteBautismo } = useBautismoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBautismos, setFilteredBautismos] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBautismos();
  }, [fetchBautismos]);


  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este bautismo?")) return;
    try {
      const response = await deleteBautismo(id);
      if (response?.status === 200) {
        showSnackbar("Bautismo eliminado correctamente!", "success");
      } else {
        showSnackbar("Error al eliminar bautismo!", "error");
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Error al eliminar bautismo!", "error");
    }
  };

  const handleEdit = async (bautismo) => {
    navigate("/edit", { state: { bautismo } })
  };

  useEffect(() => {
    if (!bautismos.length) return; // Solo filtra si hay bautismos disponibles

    // 🔍 Función para normalizar texto (remueve acentos y lo convierte a minúsculas)
    const normalizeText = (text) =>
      text
        .normalize("NFD") // Descompone caracteres con tilde
        .replace(/[\u0300-\u036f]/g, "") // Remueve diacríticos (tildes, acentos)
        .toLowerCase();

    // Filtrar los bautismos basándose en la búsqueda
    const resultados = bautismos.filter((bautismo) => {
      // Asegurar que el nombre existe antes de normalizar
      const nombre = bautismo.nombre ? normalizeText(bautismo.nombre) : "";
      const nombreMatch = nombre.includes(normalizeText(searchQuery));

      // Manejar fechas inválidas de forma segura
      const year = bautismo.fecha_bautismo ? new Date(bautismo.fecha_bautismo).getFullYear() : null;
      const yearMatch = filterParam !== "All" ? year?.toString() === filterParam : true;

      return nombreMatch && yearMatch;
    });

    setFilteredBautismos(resultados);
  }, [searchQuery, bautismos, filterParam]);


  return (
    <div className="search-page">
      <h1>Busqueda de Bautismo</h1>

      <div className="search-bautismo">
        <form className="form-search-bautismo">
          <input type="search" placeholder="Ingrese el nombre" name="q" autoComplete="off" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
        </form>
        <div className="search-filters">
          {/* Filtrado por año */}
          <select
            onChange={(e) => setFilterParam(e.target.value)}
            className="filter"
            defaultValue={"Placeholder"} // <-- Aquí se controla la opción seleccionada
          >
            <option value="Placeholder" disabled hidden>Año de bautismo</option>
            <option value="All">Todos los años</option>
            {[
              ...new Set(
                bautismos
                  .map((bautismo) => new Date(bautismo.fecha_bautismo).getFullYear()) // Extrae solo el año
              ),
            ]
              .sort((a, b) => b - a) // Ordena los años en orden descendente
              .map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
          </select>

        </div>
      </div>


      {/* Lista de bautismos filtrados */}
      <ul className="bautismo-container">
        {filteredBautismos.length > 0 ? (
          filteredBautismos.map((bautismo) => (
            <li key={bautismo.id} className="bautismo-item">
              <span><strong>{bautismo.nombre}</strong></span>
              <span>Fecha Bautismo: {formatDateLong(bautismo.fecha_bautismo)}</span>
              <span>Lugar Bautismo: {bautismo.lugar_bautismo}</span>
              <span>Lugar Nacimiento: {bautismo.lugar_nacimiento}</span>
              <span>Fecha Nacimiento: {formatDateLong(bautismo.fecha_nacimiento)}</span>
              <span>Padre: {bautismo.padre}</span>
              <span>Madre: {bautismo.madre}</span>
              <span>Padrino: {bautismo.padrino}</span>
              <span>Madrina: {bautismo.madrina}</span>
              <button onClick={() => handleDelete(bautismo.id)} className="submit-button-delete">Eliminar</button>
              <button onClick={() => generarPDF({ datos: bautismo })} className="submit-button">
                Generar Fe de Bautismo
              </button>
              <button onClick={() => handleEdit(bautismo)} className="submit-button-edit">
                Editar Bautismo
              </button>
            </li>
          ))
        ) : (
          <div className="no-elements-item">
            <strong><p>No se encontraron bautismos.</p></strong>
          </div>
        )}
      </ul>
    </div>
  )
}
