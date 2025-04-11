import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useConfirmacionStore } from "../../store/useConfirmacionStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/CreateSacramento.css";


export default function EditConfirmacion({ showSnackbar }) {
  const location = useLocation();
  const initialConfirmacion = location.state?.confirmacion;
  const navigate = useNavigate();
  const { editConfirmacion } = useConfirmacionStore();

  const [confirmacion, setConfirmacion] = useState(initialConfirmacion);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setConfirmacion((prev) => ({
      ...prev,
      fecha_confirmacion: prev.fecha_confirmacion?.substring(0, 10) || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const isDifferent = initialConfirmacion?.[id] !== value;
    setConfirmacion((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editConfirmacion(confirmacion);

      if (response?.status === 200) {
        navigate("/search/confirmacion", { replace: true });
        showSnackbar("Confirmación editada correctamente!", "success");
      } else {
        showSnackbar("Error al editar confirmación!", "error");
      }
    } catch (error) {
      console.error("Error al editar confirmación:", error);
      showSnackbar("Error de red al editar confirmación!", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Editar Confirmación de {confirmacion.nombre} {confirmacion.a_paterno} {confirmacion.a_materno}</h1>
      <form onSubmit={handleEdit} className="form-container">
        {/* DATOS DEL CONFIRMADO */}
        <fieldset>
          <legend>Datos del Confirmado</legend>
          <FormGroup id="nombre" label="Nombre" value={confirmacion.nombre} onChange={handleChange} required />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={confirmacion.a_paterno} onChange={handleChange} required />
          <FormGroup id="a_materno" label="Apellido Materno" value={confirmacion.a_materno} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DEL PADRE */}
        <fieldset>
          <legend>Datos del Padre</legend>
          <FormGroup id="nom_padre" label="Nombre del Padre" value={confirmacion.nom_padre} onChange={handleChange} required />
          <FormGroup id="a_pat_padre" label="Apellido Paterno del Padre" value={confirmacion.a_pat_padre} onChange={handleChange} required />
          <FormGroup id="a_mat_padre" label="Apellido Materno del Padre" value={confirmacion.a_mat_padre} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DE LA MADRE */}
        <fieldset>
          <legend>Datos de la Madre</legend>
          <FormGroup id="nom_madre" label="Nombre de la Madre" value={confirmacion.nom_madre} onChange={handleChange} required />
          <FormGroup id="a_pat_madre" label="Apellido Paterno de la Madre" value={confirmacion.a_pat_madre} onChange={handleChange} required />
          <FormGroup id="a_mat_madre" label="Apellido Materno de la Madre" value={confirmacion.a_mat_madre} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos de la Confirmación</legend>
          <FormGroup id="fecha_confirmacion" label="Fecha de Confirmación" value={confirmacion.fecha_confirmacion} onChange={handleChange} type="date" required />
          <FormGroup id="libro" label="Libro" value={confirmacion.libro} onChange={handleChange} required />
          <FormGroup id="foja" label="Foja" value={confirmacion.foja} onChange={handleChange} required />
          <FormGroup id="acta" label="Acta" value={confirmacion.acta} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button">Editar</button>
      </form>
    </div>
  );
}
