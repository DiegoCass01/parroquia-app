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
  const navigate = useNavigate();

  useEffect(() => {
    fetchBautismos();
  }, [fetchBautismos]);


  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este bautismo?")) return;
    try {
      await deleteBautismo(id);
      // Muestra el Snackbar
      showSnackbar("Bautismo eliminado correctamente!", "success");
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
    const resultados = bautismos.filter((bautismo) =>
      normalizeText(bautismo.nombre).includes(normalizeText(searchQuery))
    );
    setFilteredBautismos(resultados);
  }, [searchQuery, bautismos]);


  return (
    <div className="search-page">
      <h1>Busqueda de Bautismo</h1>

      <div className="search-bautismo">
        <form className="form-search-bautismo">
          <input type="search" placeholder="Ingrese el nombre" name="q" autoComplete="off" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
        </form>
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
              <button onClick={() => handleDelete(bautismo.id)}>Eliminar</button>
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
