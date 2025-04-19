import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useUsuarioStore } from "../../store/useUsuarioStore.js";
import "../../styles/admin/CreateUsuario.css";
export default function CreateUsuario({ showSnackbar }) {

  const { createUsuario } = useUsuarioStore();
  const roleOptions = [
    { value: "usuario", name: "Usuario" },
    { value: "moderador", name: "Moderador" },
    { value: "admin", name: "Administrador" },

  ];

  const [usuario, setUsuario] = useState({
    nombre: "", a_paterno: "", a_materno: "", n_usuario: "", password: "", rol: roleOptions[0].value,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createUsuario(usuario);

      if (response && response.status >= 200 && response.status < 300) {
        setUsuario({
          nombre: "", a_paterno: "", a_materno: "", n_usuario: "", password: "", rol: "usuario"
        });
        showSnackbar("Usuario creado correctamente!", "success");
      } else {
        console.error("Error creating usuario:", response?.data || response);
        showSnackbar("Error al crear usuario!", "error");
      }

    } catch (error) {
      console.error("Error while creating usuario:", error);
      showSnackbar("Error de red al crear usuario!", "error");
    }
  };

  const handleChange = (e) => {
    setUsuario(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }


  return (
    <div className="form-div">
      <h1>Registro de Usuarios</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {/* DATOS DEL USUARIO */}
        <fieldset>
          <legend>Datos del Usuario</legend>
          <FormGroup id="n_usuario" label="Nombre de Usuario" value={usuario.n_usuario} onChange={handleChange} required />
          <FormGroup id="password" label="Contraseña" value={usuario.password} onChange={handleChange} type="password" required />
          <FormGroup id="rol" label="Rol" value={usuario.rol} onChange={handleChange} type="select" options={roleOptions} required />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos Generales</legend>
          <FormGroup id="nombre" label="Nombre" value={usuario.nombre} onChange={handleChange} required />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={usuario.a_paterno} onChange={handleChange} required />
          <FormGroup id="a_materno" label="Apellido Materno" value={usuario.a_materno} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button" >Agregar</button>
      </form>


    </div >
  )
}