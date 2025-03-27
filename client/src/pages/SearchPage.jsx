import { useEffect, useState } from "react";
import { generarPDF } from "../functions/feBautismoPdf.js";
import { formatDateLong } from "../functions/formatDate.js";
import { useBautismoStore } from "../store/useBautismoStore.js";
import "../styles/Searchpage.css"

export default function SearchPage({ showSnackbar }) {
  const { bautismos, fetchBautismos, deleteBautismo } = useBautismoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBautismos, setFilteredBautismos] = useState([]);

  useEffect(() => {
    fetchBautismos();
  }, [fetchBautismos]);


  const handleDelete = async (id) => {
    await deleteBautismo(id);
    // Muestra el Snackbar
    showSnackbar("Bautismo eliminado correctamente!", "success");
  };

  useEffect(() => {
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
      <h1>Bautismos</h1>

      <search className="search-bautismo">
        <form className="search-bautismo">
          <input type="search" placeholder="Ingrese el nombre" name="q" autocomplete="off" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
        </form>
      </search>

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
            </li>
          ))
        ) : (
          <p>No se encontraron bautismos.</p>
        )}
      </ul>
    </div>
  )
}
