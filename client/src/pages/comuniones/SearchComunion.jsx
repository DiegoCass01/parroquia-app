import { useEffect, useState } from "react";
// import { generarPDF } from "../../functions/feComunionPdf.js";
import { useComunionStore } from "../../store/useComunionStore.js";
import "../../styles/sacramentos/SearchSacramento.css";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate.js";
import { SearchBar } from "../../components/SearchBar.jsx";
import "../../App.css";
import "../../styles/sacramentos/SacramentoButtons.css";
// import { generarPDF } from "../../functions/feBautizoPdf.js";
import SacramentoButtons from "../../components/SacramentoButtons.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import AdminValidationModal from "../../components/AdminValidationModal.jsx";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";

export default function SearchComunion({ showSnackbar }) {
  const { createMovimiento } = useMovimientoStore();
  const { comuniones, fetchComuniones, deleteComunion } = useComunionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState(""); // filtros
  const [yearNac, setYearNac] = useState(""); // filtros

  const navigate = useNavigate();

  const { user, validateAdminPassword } = useAuthStore(); // para validar el admin cuando usuario moderador ocupe eliminar registross
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  });
  const [comunionIdToDelete, setComunionIdToDelete] = useState(null); // Estado para almacenar el ID del comunion

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Limpia los registros del estado cuando no hay búsqueda activa
      useComunionStore.setState({ comuniones: [] });
    }
  }, [searchQuery]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    try {
      await fetchComuniones(searchQuery, yearFilter, yearNac);

      // const nuevoMovimiento = {
      //   id_sacramento: 0, // o null si no aplica
      //   tipo_sacramento: "comunion",
      //   tipo_movimiento: "busqueda",
      //   id_usuario: user.id,
      //   usuario: user.n_usuario,
      //   nombre_completo: user.nombre,
      //   folio: "",
      // };

      // await createMovimiento(nuevoMovimiento);
    } catch (err) {
      console.error("Error en búsqueda o movimiento:", err);
      showSnackbar("Hubo un error al buscar registros.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (user.rol === "admin") {
      if (!window.confirm("¿Estás seguro de que deseas eliminar este comunion?")) return;
      try {
        const response = await deleteComunion(id);

        const nuevoMovimiento = {
          id_sacramento: id,
          tipo_sacramento: "comunion",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
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

        const nuevoMovimiento = {
          id_sacramento: comunionIdToDelete,
          tipo_sacramento: "comunion",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (deleteResponse && deleteResponse.status >= 200 && deleteResponse.status < 300 && res && res.status >= 200 && res.status < 300) {
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

  return (
    <div className="search-page">
      <section className="search-sacramento-header">
        <h1>Busqueda de Comunion</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setYearFilter={setYearFilter}
          yearFilter={yearFilter}
          placeholderFiltro={"Año de comunion"}
          yearNac={yearNac}
          setYearNac={setYearNac}
          onSubmit={handleSearchSubmit}
        />
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
              comuniones.length > 0 ? (
                comuniones.map((comunion) => (
                  <li key={comunion.id_comunion} className="sacramento-item">

                    <SacramentoButtons
                      handleDelete={() => handleDelete(comunion.id_comunion)}
                      // generarPDF={() => generarPDF({ datos: comunion })}
                      handleEdit={() => handleEdit(comunion)}
                      tipo="comunion"
                    />
                    <span><strong>{comunion.nombre + " " + comunion.a_paterno + " " + comunion.a_materno}</strong></span>
                    <span>Bautizado(a) en: {comunion.parroquia_bautizo}</span>
                    <span>Fecha Comunion: {formatDateLong(comunion.fecha_comunion)}</span>
                    <span>Dirección de Comunión: {comunion.dir_comunion}</span>
                    <span>Lugar Comunion: {comunion.lugar_comunion}</span>
                    <span>Fecha Nacimiento: {formatDateLong(comunion.fecha_nac)}</span>
                    <span>Parroco: {comunion.parroco}</span>
                    <fieldset>
                      <legend>Padres</legend>
                      <span>{comunion.nom_padre + " " + comunion.a_pat_padre + " " + comunion.a_mat_padre}</span>
                      <span>{comunion.nom_madre + " " + comunion.a_pat_madre + " " + comunion.a_mat_madre}</span>
                    </fieldset>
                    <fieldset>
                      <legend>Padrinos</legend>
                      <span>{comunion.pad_nom + " " + comunion.pad_ap_pat + " " + comunion.pad_ap_mat}</span>
                      <span>{comunion.mad_nom + " " + comunion.mad_ap_pat + " " + comunion.mad_ap_mat}</span>
                    </fieldset>


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
