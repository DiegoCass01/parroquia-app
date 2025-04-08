import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useConfirmacionStore } from "../../store/useConfirmacionStore.js";
import "../../styles/sacramentos/CreateSacramento.css";

export default function CreateConfirmacion({ showSnackbar }) {

  const { createConfirmacion } = useConfirmacionStore();

  const [confirmacion, setConfirmacion] = useState({
    nombre: "",
    a_paterno: "",
    a_materno: "",
    nom_padre: "",
    a_pat_padre: "",
    a_mat_padre: "",
    nom_madre: "",
    a_pat_madre: "",
    a_mat_madre: "",
    fecha_confirmacion: "",
    libro: "",
    foja: "",
    acta: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createConfirmacion(confirmacion);

      if (response && response.status >= 200 && response.status < 300) {
        setConfirmacion({
          nombre: "",
          a_paterno: "",
          a_materno: "",
          nom_padre: "",
          a_pat_padre: "",
          a_mat_padre: "",
          nom_madre: "",
          a_pat_madre: "",
          a_mat_madre: "",
          fecha_confirmacion: "",
          libro: "",
          foja: "",
          acta: "",
        });
        showSnackbar("Confirmación creada correctamente!", "success");
      } else {
        console.error("Error creando confirmación:", response?.data || response);
        showSnackbar("Error al crear confirmación!", "error");
      }

    } catch (error) {
      console.error("Error al crear confirmación:", error);
      showSnackbar("Error de red al crear confirmación!", "error");
    }
  };

  const handleChange = (e) => {
    setConfirmacion(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="form-div">
      <h1>Registro de Confirmaciones</h1>
      <form onSubmit={handleSubmit} className="form-container">
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

        <button type="submit" className="submit-button">Agregar</button>
      </form>
    </div>
  );
}
