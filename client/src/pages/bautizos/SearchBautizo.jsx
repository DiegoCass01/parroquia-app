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
import { useAuthStore } from "../../store/useAuthStore.js";
export default function SearchBautizo({ showSnackbar }) {
  const { bautizos, fetchBautizos, deleteBautizo } = useBautizoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBautizos, setFilteredBautizos] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();
  const { user, validateAdminPassword } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  }); // Para almacenar la contraseña
  const [bautizoIdToDelete, setBautizoIdToDelete] = useState(null); // Estado para almacenar el ID del bautizo

  useEffect(() => {
    fetchBautizos();
  }, [fetchBautizos]);

  const handleDelete = async (id) => {
    if (user.rol === "admin") {
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
    } else {
      setBautizoIdToDelete(id); // Asignamos el ID del bautizo a eliminar
      setIsModalOpen(true); // Si no es admin, abre el modal para validación
    }
  };

  const handleEdit = async (bautizo) => {
    navigate("/edit/bautizo", { state: { bautizo } })
  };

  const handleAdminValidation = async () => {
    try {
      console.log(admin.adminName, admin.adminPassword);

      const response = await validateAdminPassword({
        n_usuario: admin.adminName,
        password: admin.adminPassword
      }); // Enviar la contraseña para validarla
      if (response?.status === 200) {
        // Si las credenciales son correctas, proceder con la eliminación
        const deleteResponse = await deleteBautizo(bautizoIdToDelete); // Llama a la función de eliminación
        if (deleteResponse?.status === 200) {
          showSnackbar("Bautizo eliminado correctamente!", "success");
          setAdmin({ adminName: "", adminPassword: "" })
          setIsModalOpen(false); // Cierra el modal después de la eliminación
        } else {
          showSnackbar("Error al eliminar bautizo!", "error");
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
      <section className="search-sacramento-header">
        <h1>Busqueda de Bautizo</h1>
        <SearchBar
          sacramento={bautizos}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterParam={setFilterParam}
          fechaField="fecha_bautizo" />
      </section>

      {/* Lista de bautizos filtrados */}
      <div className="sacramento-container">
        <ul >
          {
            searchQuery.trim() === "" ? (
              <div className="no-elements-item">
                <strong><p>¿A quién buscas? Escribe el nombre del bautizado.</p></strong>
              </div>
            ) :
              filteredBautizos.length > 0 ? (
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
              )
          }
        </ul>
      </div>

      {/* Modal para validar admin */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Validar Admin</h2>
            <input
              id="adminName"
              type="text"
              placeholder="Nombre de Admin"
              value={admin.adminName}
              onChange={(e) =>
                setAdmin(prev => ({ ...prev, adminName: e.target.value }))
              }
            />
            <input
              id="adminPassword"
              type="password"
              placeholder="Contraseña de Admin"
              value={admin.adminPassword}
              onChange={(e) =>
                setAdmin(prev => ({ ...prev, adminPassword: e.target.value }))
              }
            />
            <section className="buttons-modal">
              <button onClick={handleAdminValidation}>Validar</button>
              <button onClick={() => {
                setIsModalOpen(false);
                setAdmin({
                  adminName: "",
                  adminPassword: ""
                })
              }}>Cancelar</button>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
