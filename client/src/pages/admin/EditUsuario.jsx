import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useUsuarioStore } from "../../store/useUsuarioStore.js";
import "../../styles/admin/CreateUsuario.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditUsuario({ showSnackbar }) {
  const location = useLocation();
  const initialUsuario = location.state?.usuario;
  const navigate = useNavigate();
  const { editUsuario } = useUsuarioStore();

  const [usuario, setUsuario] = useState(initialUsuario);
  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios en el form
  const [newPassword, setNewPassword] = useState("");

  // 🔄 Sincronizar los inputs con los datos del usuario cuando se cargue la página o cambie el usuario seleccionado
  useEffect(() => {
    setUsuario((prev) => ({
      ...prev
    }));
  }, []);

  // 📌 Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "password") {
      setNewPassword(value); // Solo cambiamos este estado si es la contraseña
      setHasChanges(value !== ""); // Consideramos como cambio si hay algo
      return;
    }

    const isDifferent = initialUsuario?.[id] !== value;
    setUsuario((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges && !newPassword) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    const dataToSend = {
      ...usuario,
      ...(newPassword && { password: newPassword }), // Solo si hay nueva contraseña
    };

    try {
      const response = await editUsuario(dataToSend);

      if (response && response.status >= 200 && response.status < 300) {
        navigate("/search/usuario", { replace: true });
        showSnackbar("Usuario editado correctamente!", "success");
      } else {
        console.error("Error editing usuario:", response?.data || response);
        showSnackbar("Error al editar usuario!", "error");
      }
    } catch (error) {
      console.error("Error while editing usuario:", error);
      showSnackbar("Error de red al editar usuario!", "error");
    }
  };


  return (
    <div className="form-div">
      <h1>Editar Usuario de {usuario.nombre} {usuario.a_paterno} {usuario.a_materno}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {/* DATOS DEL USUARIO */}
        <fieldset>
          <legend>Datos del Usuario</legend>
          <FormGroup
            id="n_usuario"
            label="Nombre de Usuario"
            value={usuario.n_usuario}
            onChange={handleChange}
            required
          />
          {/* No mostrar la contraseña existente, solo un campo vacío para ingresarla si se quiere cambiar */}
          <FormGroup
            id="password"
            label="Contraseña"
            value={newPassword} // Campo vacío para la contraseña
            onChange={handleChange}
            type="password"
            placeholder="Ingrese nueva contraseña"
          />
          <label htmlFor="rol" className="label">
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            value={usuario.rol}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="usuario">Usuario</option>
            <option value="moderador">Moderador</option>
            <option value="admin">Administrador</option>
          </select>
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos Generales</legend>
          <FormGroup
            id="nombre"
            label="Nombre"
            value={usuario.nombre}
            onChange={handleChange}
            required
          />
          <FormGroup
            id="a_paterno"
            label="Apellido Paterno"
            value={usuario.a_paterno}
            onChange={handleChange}
            required
          />
          <FormGroup
            id="a_materno"
            label="Apellido Materno"
            value={usuario.a_materno}
            onChange={handleChange}
            required
          />
        </fieldset>

        <button type="submit" className="submit-button">
          Editar
        </button>
      </form>
    </div>
  );
}
