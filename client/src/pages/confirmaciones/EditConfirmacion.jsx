import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useConfirmacionStore } from "../../store/useConfirmacionStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/CreateSacramento.css";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";


export default function EditConfirmacion({ showSnackbar }) {
  const { user } = useAuthStore();
  const { createMovimiento } = useMovimientoStore();
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
      fecha_nac: prev.fecha_nac?.substring(0, 10) || "",
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

      const nuevoMovimiento = {
        id_sacramento: confirmacion.id_confirmacion,
        tipo_sacramento: "confirmacion",
        tipo_movimiento: "edicion",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: "",
      };

      const res = await createMovimiento(nuevoMovimiento);

      if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
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
          <FormGroup id="nombre" label="Nombre" value={confirmacion.nombre} onChange={handleChange} />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={confirmacion.a_paterno} onChange={handleChange} />
          <FormGroup id="a_materno" label="Apellido Materno" value={confirmacion.a_materno} onChange={handleChange} />
          <FormGroup id="lugar_nac" label="Lugar de Nacimiento" value={confirmacion.lugar_nac} onChange={handleChange} />
          <FormGroup id="fecha_nac" label="Fecha de Nacimiento" value={confirmacion.fecha_nac} onChange={handleChange} type="date" />

        </fieldset>
        <br />

        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos de la Confirmación</legend>
          <FormGroup id="dir_confirmacion" label="Dirección de la Confirmación" value={confirmacion.dir_confirmacion} onChange={handleChange} />
          <FormGroup id="lugar_confirmacion" label="Parroquia de la Confirmación" value={confirmacion.lugar_confirmacion} onChange={handleChange} />
          <FormGroup id="fecha_confirmacion" label="Fecha de Confirmación" value={confirmacion.fecha_confirmacion} onChange={handleChange} type="date" />
          <FormGroup id="parroco" label="Párroco" value={confirmacion.parroco} onChange={handleChange} />
        </fieldset>
        <br />

        {/* DATOS DEL PADRE */}
        <fieldset>
          <legend>Datos del Padre</legend>
          <FormGroup id="nom_padre" label="Nombre del Padre" value={confirmacion.nom_padre} onChange={handleChange} />
          <FormGroup id="a_pat_padre" label="Apellido Paterno del Padre" value={confirmacion.a_pat_padre} onChange={handleChange} />
          <FormGroup id="a_mat_padre" label="Apellido Materno del Padre" value={confirmacion.a_mat_padre} onChange={handleChange} />
        </fieldset>
        <br />

        {/* DATOS DE LA MADRE */}
        <fieldset>
          <legend>Datos de la Madre</legend>
          <FormGroup id="nom_madre" label="Nombre de la Madre" value={confirmacion.nom_madre} onChange={handleChange} />
          <FormGroup id="a_pat_madre" label="Apellido Paterno de la Madre" value={confirmacion.a_pat_madre} onChange={handleChange} />
          <FormGroup id="a_mat_madre" label="Apellido Materno de la Madre" value={confirmacion.a_mat_madre} onChange={handleChange} />
        </fieldset>
        <br />

        {/* DATOS DE LOS PADRINOS */}
        <fieldset>
          <legend>Datos de los Padrinos</legend>
          <FormGroup id="pad_nom" label="Nombre del Padrino" value={confirmacion.pad_nom} onChange={handleChange} />
          <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={confirmacion.pad_ap_pat} onChange={handleChange} />
          <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={confirmacion.pad_ap_mat} onChange={handleChange} />

          <FormGroup id="mad_nom" label="Nombre de la Madrina" value={confirmacion.mad_nom} onChange={handleChange} />
          <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={confirmacion.mad_ap_pat} onChange={handleChange} />
          <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={confirmacion.mad_ap_mat} onChange={handleChange} />
        </fieldset>

        <button type="submit" className="submit-button">Editar</button>
      </form>
    </div>
  );
}
