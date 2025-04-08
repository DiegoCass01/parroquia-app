import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useComunionStore } from "../../store/useComunionStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/SearchSacramento.css";

export default function EditComunion({ showSnackbar }) {
  const location = useLocation();
  const initialComunion = location.state?.comunion;
  const navigate = useNavigate();
  const { editComunion } = useComunionStore();

  // 📌 Estado del formulario
  const [comunion, setComunion] = useState(initialComunion);

  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios en el form

  // 🔄 Sincronizar los inputs con los datos del comunion cuando se cargue la página o cambie el comunion seleccionado
  useEffect(() => {
    setComunion((prev) => ({
      ...prev,
      fecha_comunion: prev.fecha_comunion?.substring(0, 10) || "",
    }));

  }, []);

  // 📌 Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Detecta si el nuevo valor es diferente al inicial
    const isDifferent = initialComunion?.[id] !== value;

    setComunion((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  }

  // 📌 Función para manejar el envío del formulario
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editComunion(comunion);

      if (response?.status === 200) {
        navigate("/search/comunion", { replace: true });
        showSnackbar("Comunion editado correctamente!", "success");

      } else {
        showSnackbar("Error al editar comunion!", "error");
      }

    } catch (error) {
      console.error("Error while editing comunion:", error);
      showSnackbar("Error de red al editar comunion!", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Editar Comunion de {comunion.nombre} {comunion.a_paterno} {comunion.a_materno}</h1>
      <form onSubmit={handleEdit} className="form-container">
        <FormGroup
          id="nombre"
          label="Nombre"
          value={comunion.nombre}
          onChange={handleChange}
          name="nombre"
        />
        <FormGroup
          id="a_paterno"
          label="Apellido Paterno"
          value={comunion.a_paterno}
          onChange={handleChange}
          name="a_paterno"
        />
        <FormGroup
          id="a_materno"
          label="Apellido Materno"
          value={comunion.a_materno}
          onChange={handleChange}
          name="a_materno"
        />
        <FormGroup
          id="nom_padre"
          label="Nombre del Padre"
          value={comunion.nom_padre}
          onChange={handleChange}
          name="nom_padre"
        />
        <FormGroup
          id="a_pat_padre"
          label="Apellido Paterno del Padre"
          value={comunion.a_pat_padre}
          onChange={handleChange}
          name="a_pat_padre"
        />
        <FormGroup
          id="a_mat_padre"
          label="Apellido Materno del Padre"
          value={comunion.a_mat_padre}
          onChange={handleChange}
          name="a_mat_padre"
        />
        <FormGroup
          id="nom_madre"
          label="Nombre de la Madre"
          value={comunion.nom_madre}
          onChange={handleChange}
          name="nom_madre"
        />
        <FormGroup
          id="a_pat_madre"
          label="Apellido Paterno de la Madre"
          value={comunion.a_pat_madre}
          onChange={handleChange}
          name="a_pat_madre"
        />
        <FormGroup
          id="a_mat_madre"
          label="Apellido Materno de la Madre"
          value={comunion.a_mat_madre}
          onChange={handleChange}
          name="a_mat_madre"
        />
        <FormGroup
          id="lugar_comunion"
          label="Lugar de Comunion"
          value={comunion.lugar_comunion}
          onChange={handleChange}
          name="lugar_comunion"
        />
        <FormGroup
          id="fecha_comunion"
          label="Fecha de Comunion"
          value={comunion.fecha_comunion}
          onChange={handleChange}
          name="fecha_comunion"
          type="date"
        />
        <button type="submit" className="submit-button">Editar</button>
      </form>


    </div>
  )
}