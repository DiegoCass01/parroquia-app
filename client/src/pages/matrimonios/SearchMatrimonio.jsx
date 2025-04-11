import { useEffect, useState } from "react";
import { useMatrimonioStore } from "../../store/useMatrimonioStore";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate";
import { SearchBar } from "../../components/SearchBar";
import "../../styles/sacramentos/SearchSacramento.css";
import "../../App.css";
import { generarPDF } from "../../functions/feBautizoPdf";
import { normalizeText } from "../../functions/normalizeText";

export default function SearchMatrimonio({ showSnackbar }) {
  const { matrimonios, fetchMatrimonios, deleteMatrimonio } = useMatrimonioStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMatrimonios, setFilteredMatrimonios] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatrimonios();
  }, [fetchMatrimonios]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este matrimonio?")) return;
    try {
      const response = await deleteMatrimonio(id);
      if (response?.status === 200) {
        showSnackbar("Matrimonio eliminado correctamente!", "success");
      } else {
        showSnackbar("Error al eliminar matrimonio!", "error");
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Error al eliminar matrimonio en el servidor!", "error");
    }
  };

  const handleEdit = async (matrimonio) => {
    navigate("/edit/matrimonio", { state: { matrimonio } });
  };

  useEffect(() => {
    if (!matrimonios.length) return;

    const resultados = matrimonios.filter((mat) => {
      const fullNameNovio = `${mat.nombre_novio} ${mat.a_pat_novio} ${mat.a_mat_novio}`;
      const fullNameNovia = `${mat.nombre_novia} ${mat.a_pat_novia} ${mat.a_mat_novia}`;
      const fullNameNormalized = normalizeText(fullNameNovio + " " + fullNameNovia);
      const searchQueryNormalized = normalizeText(searchQuery);

      const nombreMatch = fullNameNormalized.includes(searchQueryNormalized);

      const year = mat.fecha_matrimonio ? new Date(mat.fecha_matrimonio).getFullYear() : null;
      const yearMatch = filterParam !== "All" ? year?.toString() === filterParam : true;

      return nombreMatch && yearMatch;
    });

    setFilteredMatrimonios(resultados);
  }, [searchQuery, matrimonios, filterParam]);

  return (
    <div className="search-page">
      <h1>Búsqueda de Matrimonio</h1>

      <SearchBar
        sacramento={matrimonios}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterParam={setFilterParam}
        fechaField="fecha_matrimonio"
      />

      <div className="sacramento-container">
        <ul className="sacramento-container">
          {filteredMatrimonios.length > 0 ? (
            filteredMatrimonios.map((mat) => (
              <li key={mat.id_matrimonio} className="sacramento-item">
                <span><strong>{`${mat.nombre_novio} ${mat.a_pat_novio} y ${mat.nombre_novia} ${mat.a_pat_novia}`}</strong></span>
                <span>Novio: {mat.nombre_novio + " " + mat.a_pat_novio + " " + mat.a_mat_novio}</span>
                <span>Novia: {mat.nombre_novia + " " + mat.a_pat_novia + " " + mat.a_mat_novia}</span>
                <span>Fecha Matrimonio: {formatDateLong(mat.fecha_matrimonio)}</span>
                <span>Libro: {mat.libro}</span>
                <span>Foja: {mat.foja}</span>
                <span>Acta: {mat.acta}</span>
                <section className="sacramento-buttons">
                  <button onClick={() => handleDelete(mat.id_matrimonio)} className="submit-button-delete">Eliminar</button>
                  <button onClick={() => generarPDF({ datos: mat })} className="submit-button">Generar Fe de Matrimonio</button>
                  <button onClick={() => handleEdit(mat)} className="submit-button-edit">Editar Matrimonio</button>
                </section>
              </li>
            ))
          ) : (
            <div className="no-elements-item">
              <strong><p>No se encontraron matrimonios.</p></strong>
            </div>
          )}
        </ul>

      </div>

    </div>
  );
}
