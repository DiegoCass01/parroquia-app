import { useEffect, useState } from "react";
// import { generarPDF } from "../../functions/feComunionPdf.js";
import { useComunionStore } from "../../store/useComunionStore.js";
import "../../styles/sacramentos/SearchSacramento.css";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate.js";
import { SearchBar } from "../../components/SearchBar.jsx";
import "../../App.css";
import { generarPDF } from "../../functions/feBautizoPdf.js";
import { normalizeText } from "../../functions/normalizeText.js";
import SacramentoButtons from "../../components/SacramentoButtons.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import AdminValidationModal from "../../components/AdminValidationModal.jsx";

export default function SearchComunion({ showSnackbar }) {
  const { comuniones, fetchComuniones, deleteComunion } = useComunionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredComuniones, setFilteredComuniones] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();

  const { user, validateAdminPassword } = useAuthStore(); // para validar el admin cuando usuario moderador ocupe eliminar registross
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  });
  const [comunionIdToDelete, setComunionIdToDelete] = useState(null); // Estado para almacenar el ID del comunion

  useEffect(() => {
    fetchComuniones();
  }, [fetchComuniones]);

  const handleDelete = async (id) => {
    if (user.rol === "admin") {
      if (!window.confirm("¿Estás seguro de que deseas eliminar este comunion?")) return;
      try {
        const response = await deleteComunion(id);
        if (response?.status === 200) {
          showSnackbar("Comunion eliminado correctamente!", "success");
        } else {
          showSnackbar("Error al eliminar comunion!", "error");
        }
      } catch (e) {
        console.error(e);
        showSnackbar("Error al eliminar comunion en el server!", "error");
      }
    } else {
      setComunionIdToDelete(id); // Asignamos el ID del bautizo a eliminar
      setIsModalOpen(true); // Si no es admin, abre el modal para validación
    }
  };

  const handleEdit = async (comunion) => {
    navigate("/edit/comunion", { state: { comunion } })
  };

  const handleAdminValidation = async () => {
    if (admin.adminName === "" || admin.adminPassword === "") return showSnackbar("Ingrese todos los datos!", "warning");
    try {
      const response = await validateAdminPassword({
        n_usuario: admin.adminName,
        password: admin.adminPassword
      }); // Enviar la contraseña para validarla
      if (response?.status === 200) {
        // Si las credenciales son correctas, proceder con la eliminación
        const deleteResponse = await deleteComunion(comunionIdToDelete); // Llama a la función de eliminación
        if (deleteResponse?.status === 200) {
          showSnackbar("Comunion eliminado correctamente!", "success");
          setAdmin({ adminName: "", adminPassword: "" })
          setIsModalOpen(false); // Cierra el modal después de la eliminación
        } else {
          showSnackbar("Error al eliminar comunion!", "error");
        }
      } else {
        showSnackbar("Credenciales incorrectas", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Error en la validación", "error");
    }
  };

  useEffect(() => {
    if (!comuniones.length) return;

    const resultados = comuniones.filter((comunion) => {
      // Combine the name fields
      const fullName = `${comunion.nombre} ${comunion.a_paterno} ${comunion.a_materno}`;

      // Normalize the full name and search query
      const fullNameNormalized = normalizeText(fullName);
      const searchQueryNormalized = normalizeText(searchQuery);

      // Check if the full name contains the search query
      const nombreMatch = fullNameNormalized.includes(searchQueryNormalized);

      // Handle the year filtering
      const year = comunion.fecha_comunion ? new Date(comunion.fecha_comunion).getFullYear() : null;
      const yearMatch = filterParam !== "All" ? year?.toString() === filterParam : true;

      return nombreMatch && yearMatch;
    });

    setFilteredComuniones(resultados);
  }, [searchQuery, comuniones, filterParam]);


  return (
    <div className="search-page">
      <section className="search-sacramento-header">
        <h1>Busqueda de Comunion</h1>
        <SearchBar
          sacramento={comuniones}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterParam={setFilterParam}
          fechaField="fecha_comunion" />
      </section>

      {/* Lista de comuniones filtrados */}
      <div className="sacramento-container">
        <ul className="sacramento-container">
          {
            searchQuery.trim() === "" ? (
              <div className="no-elements-item">
                <strong><p>Escribe el nombre de quien recibió la primera comunión.</p></strong>
              </div>
            ) :
              filteredComuniones.length > 0 ? (
                filteredComuniones.map((comunion) => (
                  <li key={comunion.id_comunion} className="sacramento-item">
                    <span><strong>{comunion.nombre + " " + comunion.a_paterno + " " + comunion.a_materno}</strong></span>
                    <span>Fecha Comunion: {formatDateLong(comunion.fecha_comunion)}</span>
                    <span>Lugar Comunion: {comunion.lugar_comunion}</span>
                    <span>Padre: {comunion.nom_padre + " " + comunion.a_pat_padre + " " + comunion.a_mat_padre}</span>
                    <span>Madre: {comunion.nom_madre + " " + comunion.a_pat_madre + " " + comunion.a_mat_madre}</span>
                    <SacramentoButtons
                      handleDelete={() => handleDelete(comunion.id_comunion)}
                      generarPDF={() => generarPDF({ datos: comunion })}
                      handleEdit={() => handleEdit(comunion)}
                      tipo="comunion"
                    />
                  </li>
                ))
              ) : (
                <div className="no-elements-item">
                  <strong><p>No se encontraron comuniones.</p></strong>
                </div>
              )
          }
        </ul>
      </div>

      {/* Modal para validar admin */}
      {isModalOpen && (
        <AdminValidationModal
          admin={admin}
          setAdmin={setAdmin}
          onValidate={handleAdminValidation}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
