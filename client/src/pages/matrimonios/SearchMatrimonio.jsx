import { useEffect, useState } from "react";
import { useMatrimonioStore } from "../../store/useMatrimonioStore";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate";
import { SearchBar } from "../../components/SearchBar";
import "../../styles/sacramentos/SearchSacramento.css";
import "../../App.css";
import { generarPDF } from "../../functions/feBautizoPdf";
import { normalizeText } from "../../functions/normalizeText";
import SacramentoButtons from "../../components/SacramentoButtons";
import { useAuthStore } from "../../store/useAuthStore";
import AdminValidationModal from "../../components/AdminValidationModal";

export default function SearchMatrimonio({ showSnackbar }) {
  const { matrimonios, fetchMatrimonios, deleteMatrimonio } = useMatrimonioStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMatrimonios, setFilteredMatrimonios] = useState([]);
  const [filterParam, setFilterParam] = useState("All");
  const navigate = useNavigate();


  const { user, validateAdminPassword } = useAuthStore(); // para validar el admin cuando usuario moderador ocupe eliminar registross
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  });
  const [matrimonioIdToDelete, setMatrimonioIdToDelete] = useState(null); // Estado para almacenar el ID del matrimonio

  useEffect(() => {
    fetchMatrimonios();
  }, [fetchMatrimonios]);

  const handleDelete = async (id) => {
    if (user.rol === "admin") {
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
    } else {
      setMatrimonioIdToDelete(id); // Asignamos el ID del bautizo a eliminar
      setIsModalOpen(true); // Si no es admin, abre el modal para validación
    }
  };

  const handleEdit = async (matrimonio) => {
    navigate("/edit/matrimonio", { state: { matrimonio } });
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
        const deleteResponse = await deleteMatrimonio(matrimonioIdToDelete); // Llama a la función de eliminación
        if (deleteResponse?.status === 200) {
          showSnackbar("Matrimonio eliminado correctamente!", "success");
          setAdmin({ adminName: "", adminPassword: "" })
          setIsModalOpen(false); // Cierra el modal después de la eliminación
        } else {
          showSnackbar("Error al eliminar matrimonio!", "error");
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
      <section className="search-sacramento-header">
        <h1>Búsqueda de Matrimonio</h1>
        <SearchBar
          sacramento={matrimonios}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterParam={setFilterParam}
          fechaField="fecha_matrimonio"
        />
      </section>

      <div className="sacramento-container">
        <ul className="sacramento-container">
          {
            searchQuery.trim() === "" ? (
              <div className="no-elements-item">
                <strong><p>Escribe el nombre de uno de los esposos.</p></strong>
              </div>
            ) :
              filteredMatrimonios.length > 0 ? (
                filteredMatrimonios.map((mat) => (
                  <li key={mat.id_matrimonio} className="sacramento-item">
                    <span><strong>{`${mat.nombre_novio} ${mat.a_pat_novio} y ${mat.nombre_novia} ${mat.a_pat_novia}`}</strong></span>
                    <span>Novio: {mat.nombre_novio + " " + mat.a_pat_novio + " " + mat.a_mat_novio}</span>
                    <span>Novia: {mat.nombre_novia + " " + mat.a_pat_novia + " " + mat.a_mat_novia}</span>
                    <span>Fecha Matrimonio: {formatDateLong(mat.fecha_matrimonio)}</span>
                    <span>Libro: {mat.libro}</span>
                    <span>Foja: {mat.foja}</span>
                    <span>Acta: {mat.acta}</span>
                    <SacramentoButtons
                      handleDelete={() => handleDelete(mat.id_matrimonio)}
                      generarPDF={() => generarPDF({ datos: mat })}
                      handleEdit={() => handleEdit(mat)}
                      tipo="matrimonio"
                    />
                  </li>
                ))
              ) : (
                <div className="no-elements-item">
                  <strong><p>No se encontraron matrimonios.</p></strong>
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
  );
}
