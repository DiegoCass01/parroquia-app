import { useEffect, useState } from "react";
import { useConfirmacionStore } from "../../store/useConfirmacionStore";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate";
import { SearchBar } from "../../components/SearchBar";
import "../../styles/sacramentos/SearchSacramento.css";
import "../../App.css";
import { generarPDF } from "../../functions/feBautizoPdf";

export default function SearchConfirmacion({ showSnackbar }) {
  const { confirmaciones, fetchConfirmaciones, deleteConfirmacion } = useConfirmacionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConfirmaciones, setFilteredConfirmaciones] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfirmaciones();
  }, [fetchConfirmaciones]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta confirmación?")) return;
    try {
      const response = await deleteConfirmacion(id);
      if (response?.status === 200) {
        showSnackbar("Confirmación eliminada correctamente!", "success");
      } else {
        showSnackbar("Error al eliminar confirmación!", "error");
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Error al eliminar confirmación en el servidor!", "error");
    }
  };

  const handleEdit = async (confirmacion) => {
    navigate("/edit/confirmacion", { state: { confirmacion } });
  };

  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  useEffect(() => {
    if (!confirmaciones.length) return;

    const resultados = confirmaciones.filter((conf) => {
      const fullName = `${conf.nombre} ${conf.a_paterno} ${conf.a_materno}`;
      const fullNameNormalized = normalizeText(fullName);
      const searchQueryNormalized = normalizeText(searchQuery);

      const nombreMatch = fullNameNormalized.includes(searchQueryNormalized);

      const year = conf.fecha_confirmacion ? new Date(conf.fecha_confirmacion).getFullYear() : null;
      const yearMatch = filterParam !== "All" ? year?.toString() === filterParam : true;

      return nombreMatch && yearMatch;
    });

    setFilteredConfirmaciones(resultados);
  }, [searchQuery, confirmaciones, filterParam]);

  return (
    <div className="search-page">
      <h1>Búsqueda de Confirmación</h1>

      <SearchBar
        sacramento={confirmaciones}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterParam={setFilterParam}
        fechaField="fecha_confirmacion" // <-- este campo es clave para usar el año correcto
      />

      <ul className="sacramento-container">
        {filteredConfirmaciones.length > 0 ? (
          filteredConfirmaciones.map((conf) => (
            <li key={conf.id_confirmacion} className="sacramento-item">
              <span><strong>{`${conf.nombre} ${conf.a_paterno} ${conf.a_materno}`}</strong></span>
              <span>Padre: {conf.nom_padre + " " + conf.a_pat_padre + " " + conf.a_mat_padre}</span>
              <span>Madre: {conf.nom_madre + " " + conf.a_pat_madre + " " + conf.a_mat_madre}</span>
              <span>Fecha Confirmación: {formatDateLong(conf.fecha_confirmacion)}</span>
              <span>Libro: {conf.libro}</span>
              <span>Foja: {conf.foja}</span>
              <span>Acta: {conf.acta}</span>
              <button onClick={() => handleDelete(conf.id_confirmacion)} className="submit-button-delete">Eliminar</button>
              <button onClick={() => generarPDF({ datos: conf })} className="submit-button">
                Generar Fe de Confirmacion
              </button>
              <button onClick={() => handleEdit(conf)} className="submit-button-edit">
                Editar Confirmación
              </button>
            </li>
          ))
        ) : (
          <div className="no-elements-item">
            <strong><p>No se encontraron confirmaciones.</p></strong>
          </div>
        )}
      </ul>
    </div>
  );
}
