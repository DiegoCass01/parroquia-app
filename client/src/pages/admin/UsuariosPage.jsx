import { useEffect } from "react";
import { useUsuarioStore } from "../../store/useUsuarioStore.js";
import "../../styles/admin/UsuariosPage.css";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import SacramentoButtons from "../../components/SacramentoButtons.jsx";

export default function UsuariosPage({ showSnackbar }) {
  const { usuarios, fetchUsuarios, deleteUsuario } = useUsuarioStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);


  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    try {
      const response = await deleteUsuario(id);
      if (response?.status === 200) {
        showSnackbar("Usuario eliminado correctamente!", "success");
      } else {
        showSnackbar("Error al eliminar usuario!", "error");
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Error al eliminar usuario en el server!", "error");
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
              <li key={usuario.id} className={`usuario-item ${usuario.rol}`}>
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
              </li>
            ))
          ) : (
            <div className="no-elements-item">
              <strong><p>No se encontraron usuarios.</p></strong>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
