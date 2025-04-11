import { useEffect, useState } from "react";
import { generarPDF } from "../../functions/feBautizoPdf.js";
import { useBautizoStore } from "../../store/useBautizoStore.js";
import "../../styles/sacramentos/SearchSacramento.css";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate.js";
import { SearchBar } from "../../components/SearchBar.jsx";
import "../../App.css";
import { normalizeText } from "../../functions/normalizeText.js";
import SacramentoButtons from "../../components/SacramentoButtons.jsx";

export default function SearchBautizo({ showSnackbar }) {
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
    navigate("/edit/bautizo", { state: { bautizo } })
  };

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

      <SearchBar sacramento={filteredBautizos} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setFilterParam={setFilterParam} fechaField="fecha_bautizo" />

      {/* Lista de bautizos filtrados */}
      <div className="sacramento-container">
        <ul >
          {filteredBautizos.length > 0 ? (
            filteredBautizos.map((bautizo) => (
              <li key={bautizo.id_bautizo} className="sacramento-item">
                <span><strong>{bautizo.nombre + " " + bautizo.a_paterno + " " + bautizo.a_materno}</strong></span>
                <span>Fecha Bautizo: {formatDateLong(bautizo.fecha_bautizo)}</span>
                <span>Lugar Bautizo: {bautizo.lugar_bautizo}</span>
                <span>Fecha Nacimiento: {formatDateLong(bautizo.fecha_nac)}</span>
                <SacramentoButtons
                  handleDelete={() => handleDelete(bautizo.id_bautizo)}
                  generarPDF={() => generarPDF({ datos: bautizo })}
                  handleEdit={() => handleEdit(bautizo)}
                  tipo="bautizo"
                />
              </li>
            ))
          ) : (
            <div className="no-elements-item">
              <strong><p>No se encontraron bautizos.</p></strong>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
