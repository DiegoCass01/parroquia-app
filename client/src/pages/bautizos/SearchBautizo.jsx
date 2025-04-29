import { useEffect, useState } from "react";
import { FeBautizoPDF } from "../../components/FeBautizoPDF.jsx";
import { useBautizoStore } from "../../store/useBautizoStore.js";
import "../../styles/sacramentos/SearchSacramento.css";
import "../../styles/sacramentos/SacramentoButtons.css";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate.js";
import { SearchBar } from "../../components/SearchBar.jsx";
import "../../App.css";
import SacramentoButtons from "../../components/SacramentoButtons.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import AdminValidationModal from "../../components/AdminValidationModal.jsx";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function SearchBautizo({ showSnackbar }) {
  const { createMovimiento } = useMovimientoStore();
  const { bautizos, fetchBautizos, deleteBautizo } = useBautizoStore();
  const [searchQuery, setSearchQuery] = useState(""); // texto de la busqueda
  const [yearFilter, setYearFilter] = useState(""); // filtros
  const [yearNac, setYearNac] = useState(""); // filtros
  const navigate = useNavigate();

  const { user, validateAdminPassword } = useAuthStore(); // para validar el admin cuando usuario moderador ocupe eliminar registross
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  });
  const [bautizoIdToDelete, setBautizoIdToDelete] = useState(null); // Estado para almacenar el ID del bautizo

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Limpia los bautizos del estado cuando no hay búsqueda activa
      useBautizoStore.setState({ bautizos: [] });
    }
  }, [searchQuery]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    try {
      await fetchBautizos(searchQuery, yearFilter, yearNac);

      // const nuevoMovimiento = {
      //   id_sacramento: 0, // o null si no aplica
      //   tipo_sacramento: "bautizo",
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
      if (!window.confirm("¿Estás seguro de que deseas eliminar este bautizo?")) return;
      try {
        const response = await deleteBautizo(id);

        const nuevoMovimiento = {
          id_sacramento: id,
          tipo_sacramento: "bautizo",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
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
    if (admin.adminName === "" || admin.adminPassword === "") return showSnackbar("Ingrese todos los datos!", "warning");
    try {
      const response = await validateAdminPassword({
        n_usuario: admin.adminName,
        password: admin.adminPassword
      }); // Enviar la contraseña para validarla
      if (response?.status === 200) {
        // Si las credenciales son correctas, proceder con la eliminación
        const deleteResponse = await deleteBautizo(bautizoIdToDelete); // Llama a la función de eliminación

        const nuevoMovimiento = {
          id_sacramento: bautizoIdToDelete,
          tipo_sacramento: "bautizo",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (deleteResponse && deleteResponse.status >= 200 && deleteResponse.status < 300 && res && res.status >= 200 && res.status < 300) {
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

  const handleCreateMovimientoBautizo = async (bautizo) => {
    try {
      const nuevoMovimiento = {
        id_sacramento: bautizo.id_bautizo,
        tipo_sacramento: "bautizo",
        tipo_movimiento: "constancia_bautizo",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: bautizo.folio || "",
      };
      await createMovimiento(nuevoMovimiento);
    } catch (error) {
      console.error("Error al registrar movimiento de descarga:", error);
    }
  };


  return (
    <div className="search-page">
      <section className="search-sacramento-header">
        <h1>Busqueda de Bautizo</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setYearFilter={setYearFilter}
          yearFilter={yearFilter}
          placeholderFiltro={"Año de bautizo"}
          yearNac={yearNac}
          setYearNac={setYearNac}
          onSubmit={handleSearchSubmit}
        />
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
              bautizos.length > 0 ? (
                bautizos.map((bautizo) => (
                  <li key={bautizo.id_bautizo} className="sacramento-item">
                    <SacramentoButtons
                      handleDelete={() => handleDelete(bautizo.id_bautizo)}
                      pdfComponent={
                        <PDFDownloadLink
                          className="dropdown-item"
                          document={<FeBautizoPDF datos={bautizo} />}
                          fileName={`Fe_Bautizo_${bautizo.nombre}_${bautizo.a_paterno}.pdf`}
                          onClick={() => handleCreateMovimientoBautizo(bautizo)}
                        >
                          {({ loading }) => loading ? 'Generando PDF...' : 'Descargar PDF'}
                        </PDFDownloadLink>
                      }
                      handleEdit={() => handleEdit(bautizo)}
                      tipo="bautizo"
                    />
                    <span><strong>{bautizo.nombre + " " + bautizo.a_paterno + " " + bautizo.a_materno}</strong></span>
                    <span>Fecha Bautizo: {formatDateLong(bautizo.fecha_bautizo)}</span>
                    <span>Dirección Bautizo: {bautizo.dir_bautizo}</span>
                    <span>Lugar Bautizo: {bautizo.lugar_bautizo}</span>
                    <span>Fecha Nacimiento: {formatDateLong(bautizo.fecha_nac)}</span>
                    <span>Parroco: {bautizo.parroco}</span>
                    <fieldset>
                      <legend>Padres</legend>
                      <span>{bautizo.nom_padre + " " + bautizo.a_pat_padre + " " + bautizo.a_mat_padre}</span>
                      <span>{bautizo.nom_madre + " " + bautizo.a_pat_madre + " " + bautizo.a_mat_madre}</span>
                    </fieldset>
                    <fieldset>
                      <legend>Padrinos</legend>
                      <span>{bautizo.pad_nom + " " + bautizo.pad_ap_pat + " " + bautizo.pad_ap_mat}</span>
                      <span>{bautizo.mad_nom + " " + bautizo.mad_ap_pat + " " + bautizo.mad_ap_mat}</span>
                    </fieldset>

                  </li >
                ))
              ) : (
                <div className="no-elements-item">
                  <strong><p>No se encontraron bautizos.</p></strong>
                </div>
              )
          }
        </ul >
      </div >

      {/* Modal para validar admin */}
      {
        isModalOpen && (
          <AdminValidationModal
            admin={admin}
            setAdmin={setAdmin}
            onValidate={handleAdminValidation}
            onCancel={() => setIsModalOpen(false)}
          />
        )
      }
    </div >
  )
}

