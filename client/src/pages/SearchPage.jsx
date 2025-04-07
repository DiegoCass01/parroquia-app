import { useEffect, useState } from "react";
import { generarPDF } from "../functions/feBautizoPdf.js";
import { useBautizoStore } from "../store/useBautizoStore.js";
import "../styles/Searchpage.css"
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../functions/formatDate.js";

export default function SearchPage({ showSnackbar }) {
  const { bautizos, fetchBautizos, deleteBautizo } = useBautizoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBautizos, setFilteredBautizos] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBautizos();
  }, [fetchBautizos]);


  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este bautizo?")) return;
    try {
      const response = await deleteBautizo(id);
      if (response?.status === 200) {
        showSnackbar("Bautizo eliminado correctamente!", "success");
      } else {
        showSnackbar("Error al eliminar bautizo!", "error");
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Error al eliminar bautizo en el server!", "error");
    }
  };

  const handleEdit = async (bautizo) => {
    navigate("/edit", { state: { bautizo } })
  };

  // Function to normalize text (removes accents and converts to lowercase)
  const normalizeText = (text) =>
    text
      .normalize("NFD") // Decompose characters with accents
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks (accents)
      .toLowerCase();

  useEffect(() => {
    if (!bautizos.length) return;

    const resultados = bautizos.filter((bautizo) => {
      // Combine the name fields
      const fullName = `${bautizo.nombre} ${bautizo.a_paterno} ${bautizo.a_materno}`;

      // Normalize the full name and search query
      const fullNameNormalized = normalizeText(fullName);
      const searchQueryNormalized = normalizeText(searchQuery);

      // Check if the full name contains the search query
      const nombreMatch = fullNameNormalized.includes(searchQueryNormalized);

      // Handle the year filtering
      const year = bautizo.fecha_bautizo ? new Date(bautizo.fecha_bautizo).getFullYear() : null;
      const yearMatch = filterParam !== "All" ? year?.toString() === filterParam : true;

      return nombreMatch && yearMatch;
    });

    setFilteredBautizos(resultados);
  }, [searchQuery, bautizos, filterParam]);


  return (
    <div className="search-page">
      <h1>Busqueda de Bautizo</h1>

      <div className="search-bautizo">
        <form className="form-search-bautizo">
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
            <option value="Placeholder" disabled hidden>Año de bautizo</option>
            <option value="All">Todos los años</option>
            {[
              ...new Set(
                bautizos
                  .map((bautizo) => new Date(bautizo.fecha_bautizo).getFullYear()) // Extrae solo el año
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


      {/* Lista de bautizos filtrados */}
      <ul className="bautizo-container">
        {filteredBautizos.length > 0 ? (
          filteredBautizos.map((bautizo) => (
            <li key={bautizo.id_bautizo} className="bautizo-item">
              <span><strong>{bautizo.nombre + " " + bautizo.a_paterno + " " + bautizo.a_materno}</strong></span>
              <span>Fecha Bautizo: {formatDateLong(bautizo.fecha_bautizo)}</span>
              <span>Lugar Bautizo: {bautizo.lugar_bautizo}</span>
              {/* <span>Lugar Nacimiento: {bautizo.lugar_nacimiento}</span>*/}
              <span>Fecha Nacimiento: {formatDateLong(bautizo.fecha_nac)}</span>
              {/* <span>Padre: {bautizo.padre}</span>
              <span>Madre: {bautizo.madre}</span>
              <span>Padrino: {bautizo.padrino}</span>
              <span>Madrina: {bautizo.madrina}</span> */}
              <button onClick={() => handleDelete(bautizo.id_bautizo)} className="submit-button-delete">Eliminar</button>
              <button onClick={() => generarPDF({ datos: bautizo })} className="submit-button">
                Generar Fe de Bautizo
              </button>
              <button onClick={() => handleEdit(bautizo)} className="submit-button-edit">
                Editar Bautizo
              </button>
            </li>
          ))
        ) : (
          <div className="no-elements-item">
            <strong><p>No se encontraron bautizos.</p></strong>
          </div>
        )}
      </ul>
    </div>
  )
}
