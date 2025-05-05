import { useEffect, useState } from "react";
import { useMatrimonioStore } from "../../store/useMatrimonioStore";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../functions/formatDate";
import { SearchBar } from "../../components/SearchBar";
import "../../styles/sacramentos/SearchSacramento.css";
import "../../App.css";
import "../../styles/sacramentos/SacramentoButtons.css";
// import { generarPDF } from "../../functions/feBautizoPdf";
import SacramentoButtons from "../../components/SacramentoButtons";
import { useAuthStore } from "../../store/useAuthStore";
import AdminValidationModal from "../../components/AdminValidationModal";
import { useMovimientoStore } from "../../store/useMovimientoStore";
import { ConstanciaMatrimonio } from "../../components/ConstanciaMatrimonio";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function SearchMatrimonio({ showSnackbar }) {
  const { createMovimiento } = useMovimientoStore();
  const { matrimonios, fetchMatrimonios, deleteMatrimonio } = useMatrimonioStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState(""); // filtros

  const navigate = useNavigate();

  const { user, validateAdminPassword } = useAuthStore(); // para validar el admin cuando usuario moderador ocupe eliminar registross
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  });
  const [matrimonioIdToDelete, setMatrimonioIdToDelete] = useState(null); // Estado para almacenar el ID del matrimonio


  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Limpia los registros del estado cuando no hay búsqueda activa
      useMatrimonioStore.setState({ matrimonios: [] });
    }
  }, [searchQuery]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    try {
      await fetchMatrimonios(searchQuery, yearFilter);

      // const nuevoMovimiento = {
      //   id_sacramento: 0, // o null si no aplica
      //   tipo_sacramento: "matrimonio",
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
      if (!window.confirm("¿Estás seguro de que deseas eliminar este matrimonio?")) return;
      try {
        const response = await deleteMatrimonio(id);

        const nuevoMovimiento = {
          id_sacramento: id,
          tipo_sacramento: "matrimonio",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
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

        const nuevoMovimiento = {
          id_sacramento: matrimonioIdToDelete,
          tipo_sacramento: "matrimonio",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (deleteResponse && deleteResponse.status >= 200 && deleteResponse.status < 300 && res && res.status >= 200 && res.status < 300) {
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

  const handleCreateMovimientoMatrimonio = async (matrimonioId) => {
    try {
      const nuevoMovimiento = {
        id_sacramento: matrimonioId,
        tipo_sacramento: "matrimonio",
        tipo_movimiento: "constancia_matrimonio",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: "",
      };
      await createMovimiento(nuevoMovimiento);
    } catch (error) {
      console.error("Error al registrar movimiento de descarga:", error);
    }
  };

  return (
    <div className="search-page">
      <section className="search-sacramento-header">
        <h1>Búsqueda de Matrimonio</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setYearFilter={setYearFilter}
          yearFilter={yearFilter}
          placeholderFiltro={"Año de matrimonio"}
          onSubmit={handleSearchSubmit}
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
              matrimonios.length > 0 ? (
                matrimonios.map((mat) => (
                  <li key={mat.id_matrimonio} className="sacramento-item">
                    <SacramentoButtons
                      handleDelete={() => handleDelete(mat.id_matrimonio)}
                      pdfComponent={
                        <PDFDownloadLink
                          className="dropdown-item download"
                          document={<ConstanciaMatrimonio matrimonio={mat} />}
                          fileName={`Constancia_Matrimonio_${mat.nombre_novio}_${mat.nombre_novia}.pdf`}
                          onClick={() => handleCreateMovimientoMatrimonio(mat.id_matrimonio)}
                        >
                          {({ loading }) => loading ? 'Generando PDF...' : 'Descargar PDF'}
                        </PDFDownloadLink>
                      }
                      handleEdit={() => handleEdit(mat)}
                      tipo="matrimonio"
                    />
                    <span><strong>{`${mat.nombre_novio} ${mat.a_pat_novio} ${mat.a_mat_novio} y ${mat.nombre_novia} ${mat.a_pat_novia} ${mat.a_mat_novia}`}</strong></span>
                    <span>Dirección del Matrimonio: {mat.dir_matrimonio}</span>
                    <span>Lugar del Matrimonio: {mat.lugar_matrimonio}</span>
                    <span>Fecha Matrimonio: {formatDateLong(mat.fecha_matrimonio)}</span>
                    <span>Parroco: {mat.parroco}</span>
                    <span>Asistente: {mat.asistente}</span>
                    <fieldset>
                      <legend>Padres</legend>
                      <span><strong>Padre del Novio: </strong>{`${mat.nom_padre_novio} ${mat.a_pat_padre_novio} ${mat.a_mat_padre_novio}`}</span>
                      <span><strong>Madre del Novio: </strong>{`${mat.nom_madre_novio} ${mat.a_pat_madre_novio} ${mat.a_mat_madre_novio}`}</span>
                      <span><strong>Padre de la Novia: </strong>{`${mat.nom_padre_novia} ${mat.a_pat_padre_novia} ${mat.a_mat_padre_novia}`}</span>
                      <span><strong>Madre de la Novia: </strong>{`${mat.nom_madre_novia} ${mat.a_pat_madre_novia} ${mat.a_mat_madre_novia}`}</span>
                    </fieldset>
                    <fieldset>
                      <legend>Testigos</legend>
                      <span>{mat.testigo_nom + " " + mat.testigo_ap_pat + " " + mat.testigo_ap_mat}</span>
                      <span>{mat.testigo2_nom + " " + mat.testigo2_ap_pat + " " + mat.testigo2_ap_mat}</span>
                    </fieldset>

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
