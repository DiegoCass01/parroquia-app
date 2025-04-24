import { useEffect, useState } from "react";
import { useConfirmacionStore } from "../../store/useConfirmacionStore";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate";
import { SearchBar } from "../../components/SearchBar";
import "../../styles/sacramentos/SearchSacramento.css";
import "../../App.css";
import { generarPDF } from "../../functions/feBautizoPdf";
import SacramentoButtons from "../../components/SacramentoButtons";
import AdminValidationModal from "../../components/AdminValidationModal";
import { useAuthStore } from "../../store/useAuthStore";
import { useMovimientoStore } from "../../store/useMovimientoStore";

export default function SearchConfirmacion({ showSnackbar }) {
  const { createMovimiento } = useMovimientoStore();
  const { confirmaciones, fetchConfirmaciones, deleteConfirmacion } = useConfirmacionStore();
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
  const [confIdToDelete, setConfIdToDelete] = useState(null); // Estado para almacenar el ID del confirmacion

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchConfirmaciones(searchQuery, yearFilter, yearNac);
      }
    }, 500); // espera 500ms después de dejar de escribir

    return () => clearTimeout(delayDebounce); // limpia si el user sigue escribiendo
  }, [searchQuery, yearFilter, fetchConfirmaciones, yearNac]);

  const handleDelete = async (id) => {
    if (user.rol === "admin") {
      if (!window.confirm("¿Estás seguro de que deseas eliminar esta confirmación?")) return;
      try {
        const response = await deleteConfirmacion(id);

        const nuevoMovimiento = {
          id_sacramento: id,
          tipo_sacramento: "confirmacion",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
          showSnackbar("Confirmación eliminada correctamente!", "success");
        } else {
          showSnackbar("Error al eliminar confirmación!", "error");
        }
      } catch (e) {
        console.error(e);
        showSnackbar("Error al eliminar confirmación en el servidor!", "error");
      }
    } else {
      setConfIdToDelete(id); // Asignamos el ID del bautizo a eliminar
      setIsModalOpen(true); // Si no es admin, abre el modal para validación
    }
  };

  const handleEdit = async (confirmacion) => {
    navigate("/edit/confirmacion", { state: { confirmacion } });
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
        const deleteResponse = await deleteConfirmacion(confIdToDelete); // Llama a la función de eliminación

        const nuevoMovimiento = {
          id_sacramento: confIdToDelete,
          tipo_sacramento: "confirmacion",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (deleteResponse && deleteResponse.status >= 200 && deleteResponse.status < 300 && res && res.status >= 200 && res.status < 300) {
          showSnackbar("Confirmacion eliminado correctamente!", "success");
          setAdmin({ adminName: "", adminPassword: "" })
          setIsModalOpen(false); // Cierra el modal después de la eliminación
        } else {
          showSnackbar("Error al eliminar confirmacion!", "error");
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
        <h1>Búsqueda de Confirmación</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setYearFilter={setYearFilter}
          yearFilter={yearFilter}
          placeholderFiltro={"Año de confirmacion"}
          yearNac={yearNac}
          setYearNac={setYearNac}
        />
      </section>

      <div className="sacramento-container">
        <ul className="sacramento-container">
          {
            searchQuery.trim() === "" ? (
              <div className="no-elements-item">
                <strong><p>Busca por nombre de la persona confirmada.</p></strong>
              </div>
            ) :
              confirmaciones.length > 0 ? (
                confirmaciones.map((conf) => (
                  <li key={conf.id_confirmacion} className="sacramento-item">
                    <span><strong>{`${conf.nombre} ${conf.a_paterno} ${conf.a_materno}`}</strong></span>
                    <span>Fecha Confirmación: {formatDateLong(conf.fecha_confirmacion)}</span>
                    <span>Dirección: {conf.dir_confirmacion}</span>
                    <span>Lugar Confirmación: {conf.lugar_confirmacion}</span>
                    <span>Parroco: {conf.parroco}</span>
                    <span>Fecha Nacimiento: {formatDateLong(conf.fecha_nac)}</span>
                    <span>Lugar de Nacimiento: {conf.lugar_nac}</span>
                    <fieldset>
                      <legend>Padres</legend>
                      <span>{conf.nom_padre} {conf.a_pat_padre} {conf.a_mat_padre}</span>
                      <span>{conf.nom_madre} {conf.a_pat_madre} {conf.a_mat_madre}</span>
                    </fieldset>
                    <fieldset>
                      <legend>Padrinos</legend>
                      <span>{conf.pad_nom + " " + conf.pad_ap_pat + " " + conf.pad_ap_mat}</span>
                      <span>{conf.mad_nom + " " + conf.mad_ap_pat + " " + conf.mad_ap_mat}</span>
                    </fieldset>

                    <SacramentoButtons
                      handleDelete={() => handleDelete(conf.id_confirmacion)}
                      generarPDF={() => generarPDF({ datos: conf })}
                      handleEdit={() => handleEdit(conf)}
                      tipo="confirmación"
                    />

                  </li>
                ))
              ) : (
                <div className="no-elements-item">
                  <strong><p>No se encontraron confirmaciones.</p></strong>
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
