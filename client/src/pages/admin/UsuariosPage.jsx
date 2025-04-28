import { useEffect, useState } from "react";
import { useUsuarioStore } from "../../store/useUsuarioStore.js";
import "../../styles/admin/UsuariosPage.css";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import SacramentoButtons from "../../components/SacramentoButtons.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import AdminValidationModal from "../../components/AdminValidationModal.jsx";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";

export default function UsuariosPage({ showSnackbar }) {
  const { createMovimiento } = useMovimientoStore();
  const { usuarios, fetchUsuarios, deleteUsuario } = useUsuarioStore();
  const navigate = useNavigate();

  const { user, validateAdminPassword } = useAuthStore(); // para validar el admin cuando usuario moderador ocupe eliminar registross
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para el modal
  const [admin, setAdmin] = useState({
    adminName: "",
    adminPassword: ""
  });
  const [usuarioIdToDelete, setUsuarioIdToDelete] = useState(null); // Estado para almacenar el ID del usuario


  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);


  const handleDelete = async (id) => {
    if (user.rol === "admin") {
      if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
      try {
        const response = await deleteUsuario(id);

        const nuevoMovimiento = {
          id_sacramento: id,
          tipo_sacramento: "usuario",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
          showSnackbar("Usuario eliminado correctamente!", "success");
        } else {
          showSnackbar("Error al eliminar usuario!", "error");
        }
      } catch (e) {
        console.error(e);
        showSnackbar("Error al eliminar usuario en el server!", "error");
      }
    } else {
      setUsuarioIdToDelete(id); // Asignamos el ID del bautizo a eliminar
      setIsModalOpen(true); // Si no es admin, abre el modal para validación
    }
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
        const deleteResponse = await deleteUsuario(usuarioIdToDelete); // Llama a la función de eliminación

        const nuevoMovimiento = {
          id_sacramento: usuarioIdToDelete,
          tipo_sacramento: "usuario",
          tipo_movimiento: "eliminacion",
          id_usuario: user.id,
          usuario: user.n_usuario,
          nombre_completo: user.nombre,
          folio: "",
        };

        const res = await createMovimiento(nuevoMovimiento);

        if (deleteResponse && deleteResponse.status >= 200 && deleteResponse.status < 300 && res && res.status >= 200 && res.status < 300) {
          showSnackbar("Usuario eliminado correctamente!", "success");
          setAdmin({ adminName: "", adminPassword: "" })
          setIsModalOpen(false); // Cierra el modal después de la eliminación
        } else {
          showSnackbar("Error al eliminar usuario!", "error");
        }
      } else {
        showSnackbar("Credenciales incorrectas", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Error en la validación", "error");
    }
  };

  const handleEdit = async (usuario) => {
    navigate("/edit/usuario", { state: { usuario } })
  };

  return (
    <div className="usuarios-page">
      <section className="usuarios-header">
        <h1>Usuarios</h1>
        <button className="usuarios-submit-button" onClick={() => navigate("/create/usuario")} >
          Crear nuevo usuario
        </button>
      </section>

      {/* Lista de usuarios filtrados */}
      <div className="usuario-container">
        <ul >
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              user.id !== usuario.id && (
                < li key={usuario.id} className={`usuario-item ${usuario.rol}`} >
                  <div className="usuario-info">
                    <div className="info-item">
                      <label>Nombre completo</label>
                      <div className="info-content">
                        <span>{usuario.nombre + " " + usuario.a_paterno + " " + usuario.a_materno}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <label>Nombre de usuario</label>
                      <div className="info-content">
                        <span>{usuario.n_usuario}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <label>Rol</label>
                      <div className="info-content">
                        <span>{usuario.rol}</span>
                      </div>
                    </div>
                  </div>

                  <SacramentoButtons
                    handleDelete={() => handleDelete(usuario.id)}
                    handleEdit={() => handleEdit(usuario)}
                    tipo="usuario"

                  />
                </li>)

            ))
          ) : (
            <div className="no-elements-item">
              <strong><p>No se encontraron usuarios.</p></strong>
            </div>
          )}
        </ul>
      </div>

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
