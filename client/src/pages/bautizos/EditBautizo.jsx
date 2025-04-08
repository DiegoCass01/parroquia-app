import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useBautizoStore } from "../../store/useBautizoStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/SearchSacramento.css";

export default function EditBautizo({ showSnackbar }) {
  const location = useLocation();
  const initialBautizo = location.state?.bautizo;
  const navigate = useNavigate();
  const { editBautizo } = useBautizoStore();

  // 📌 Estado del formulario
  const [bautizo, setBautizo] = useState(initialBautizo);

  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios en el form

  // 🔄 Sincronizar los inputs con los datos del bautizo cuando se cargue la página o cambie el bautizo seleccionado
  useEffect(() => {
    setBautizo((prev) => ({
      ...prev,
      fecha_bautizo: prev.fecha_bautizo?.substring(0, 10) || "",
      fecha_nac: prev.fecha_nac?.substring(0, 10) || "",
    }));

  }, []);

  // 📌 Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Detecta si el nuevo valor es diferente al inicial
    const isDifferent = initialBautizo?.[id] !== value;

    setBautizo((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  }

  // 📌 Función para manejar el envío del formulario
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editBautizo(bautizo);

      if (response?.status === 200) {
        navigate("/search/bautizo", { replace: true });
        showSnackbar("Bautizo editado correctamente!", "success");

      } else {
        showSnackbar("Error al editar bautizo!", "error");
      }

    } catch (error) {
      console.error("Error while editing bautizo:", error);
      showSnackbar("Error de red al editar bautizo!", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Editar Bautizo de {bautizo.nombre} {bautizo.a_paterno} {bautizo.a_materno}</h1>
      <form onSubmit={handleEdit} className="form-container">
        {/* DATOS DEL NIÑO/A */}
        <fieldset>
          <legend>Datos del Niño o Niña</legend>
          <FormGroup id="nombre" label="Nombre" value={bautizo.nombre} onChange={handleChange} required />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={bautizo.a_paterno} onChange={handleChange} required />
          <FormGroup id="a_materno" label="Apellido Materno" value={bautizo.a_materno} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Bautizo</legend>
          <FormGroup id="fecha_bautizo" label="Fecha de Bautizo" value={bautizo.fecha_bautizo} onChange={handleChange} type="date" required />
          <FormGroup id="lugar_bautizo" label="Lugar de Bautizo" value={bautizo.lugar_bautizo} onChange={handleChange} required />
          <FormGroup id="fecha_nac" label="Fecha de Nacimiento" value={bautizo.fecha_nac} onChange={handleChange} type="date" required />
          <FormGroup id="libro" label="Libro" value={bautizo.libro} onChange={handleChange} required />
          <FormGroup id="foja" label="Foja" value={bautizo.foja} onChange={handleChange} required />
          <FormGroup id="acta" label="Acta" value={bautizo.acta} onChange={handleChange} required />
        </fieldset>
        <button type="submit" className="submit-button">Editar</button>
      </form>


    </div>
  )
}