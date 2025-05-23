import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useConfirmacionStore } from "../../store/useConfirmacionStore.js";
import "../../styles/sacramentos/CreateSacramento.css";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";

export default function CreateConfirmacion({ showSnackbar }) {
  const { user } = useAuthStore();
  const { createMovimiento } = useMovimientoStore();
  const { createConfirmacion } = useConfirmacionStore();

  const [confirmacion, setConfirmacion] = useState({
    nombre: "",
    a_paterno: "",
    a_materno: "",
    lugar_nac: "",
    fecha_nac: "",
    nom_padre: "",
    a_pat_padre: "",
    a_mat_padre: "",
    nom_madre: "",
    a_pat_madre: "",
    a_mat_madre: "",
    dir_confirmacion: "",
    lugar_confirmacion: "",
    fecha_confirmacion: "",
    parroco: "",
    pad_nom: "",
    pad_ap_pat: "",
    pad_ap_mat: "",
    mad_nom: "",
    mad_ap_pat: "",
    mad_ap_mat: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createConfirmacion(confirmacion);
      const confId = response.data.id;

      const nuevoMovimiento = {
        id_sacramento: confId,
        tipo_sacramento: "confirmacion",
        tipo_movimiento: "registro",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: "",
      };

      const res = await createMovimiento(nuevoMovimiento);

      if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
        setConfirmacion({
          nombre: "",
          a_paterno: "",
          a_materno: "",
          lugar_nac: "",
          fecha_nac: "",
          nom_padre: "",
          a_pat_padre: "",
          a_mat_padre: "",
          nom_madre: "",
          a_pat_madre: "",
          a_mat_madre: "",
          dir_confirmacion: "",
          lugar_confirmacion: "",
          fecha_confirmacion: "",
          parroco: "",
          pad_nom: "",
          pad_ap_pat: "",
          pad_ap_mat: "",
          mad_nom: "",
          mad_ap_pat: "",
          mad_ap_mat: "",
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
      <section className="form-container">
        <form onSubmit={handleSubmit}>
          {/* DATOS DEL CONFIRMADO */}
          <fieldset>
            <legend>Datos del Confirmado</legend>
            <FormGroup id="nombre" label="Nombre" value={confirmacion.nombre} onChange={handleChange} required />
            <FormGroup id="a_paterno" label="Apellido Paterno" value={confirmacion.a_paterno} onChange={handleChange} required />
            <FormGroup id="a_materno" label="Apellido Materno" value={confirmacion.a_materno} onChange={handleChange} required />
            <FormGroup id="lugar_nac" label="Lugar de Nacimiento" value={confirmacion.lugar_nac} onChange={handleChange} required />
            <FormGroup id="fecha_nac" label="Fecha de Nacimiento" value={confirmacion.fecha_nac} onChange={handleChange} type="date" required />

          </fieldset>
          <br />

          {/* DATOS DEL SACRAMENTO */}
          <fieldset>
            <legend>Datos de la Confirmación</legend>
            <FormGroup id="dir_confirmacion" label="Dirección de la Confirmación" value={confirmacion.dir_confirmacion} onChange={handleChange} required />
            <FormGroup id="lugar_confirmacion" label="Parroquia de la Confirmación" value={confirmacion.lugar_confirmacion} onChange={handleChange} required />
            <FormGroup id="fecha_confirmacion" label="Fecha de Confirmación" value={confirmacion.fecha_confirmacion} onChange={handleChange} type="date" required />
            <FormGroup id="parroco" label="Párroco" value={confirmacion.parroco} onChange={handleChange} required />
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

          {/* DATOS DE LOS PADRINOS */}
          <fieldset>
            <legend>Datos de los Padrinos</legend>
            <FormGroup id="pad_nom" label="Nombre del Padrino" value={confirmacion.pad_nom} onChange={handleChange} required />
            <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={confirmacion.pad_ap_pat} onChange={handleChange} required />
            <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={confirmacion.pad_ap_mat} onChange={handleChange} required />

            <FormGroup id="mad_nom" label="Nombre de la Madrina" value={confirmacion.mad_nom} onChange={handleChange} required />
            <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={confirmacion.mad_ap_pat} onChange={handleChange} required />
            <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={confirmacion.mad_ap_mat} onChange={handleChange} required />
          </fieldset>


          <button type="submit" className="submit-button">Agregar</button>
        </form>
      </section>
    </div>
  );
}
