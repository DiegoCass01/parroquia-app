import { useEffect } from "react";
import { generarPDF } from "../functions/feBautismoPdf.js";
import { formatDateLong } from "../functions/formatDate.js";
import { useBautismoStore } from "../store/useBautismoStore.js";
import "../styles/Searchpage.css"

export default function SearchPage({ showSnackbar }) {
  const { bautismos, fetchBautismos, deleteBautismo } = useBautismoStore();

  useEffect(() => {
    fetchBautismos();
  }, [fetchBautismos]);


  const handleDelete = async (id) => {
    await deleteBautismo(id);
    // Muestra el Snackbar
    showSnackbar("Bautismo eliminado correctamente!", "success");
  };


  return (
    <div className="search-page">
      <h1>Bautismos</h1>
      <search>

      </search>

      <ul className="bautismo-container">
        {bautismos.map((bautismo) => (
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
            <button onClick={() => handleDelete(bautismo.id)} >Eliminar</button>
            <button onClick={() => generarPDF({ datos: bautismo })} className="submit-button">
              Generar Fe de Bautismo
            </button>
          </li>
        ))}
      </ul>

    </div>
  )
}
