import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useBautizoStore } from "../../store/useBautizoStore.js";
import "../../styles/sacramentos/CreateSacramento.css";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function CreateBautizo({ showSnackbar }) {
  const { user } = useAuthStore();
  const { createMovimiento } = useMovimientoStore();
  const { createBautizo } = useBautizoStore();
  const dirBautizo = [
    { value: "Cd. Mante", name: "Cd. Mante" }
  ]

  const lugarBautizo = [
    { value: "Parroquia Nuestra Señora de Guadalupe Mante", name: "Parroquia Nuestra Señora de Guadalupe Mante" }
  ]

  const [bautizo, setBautizo] = useState({
    nombre: "",
    a_paterno: "",
    a_materno: "",
    nom_padre: "",
    a_pat_padre: "",
    a_mat_padre: "",
    nom_madre: "",
    a_pat_madre: "",
    a_mat_madre: "",
    dir_bautizo: dirBautizo[0].value,
    lugar_bautizo: lugarBautizo[0].value,
    fecha_bautizo: "",
    lugar_nac: "",
    fecha_nac: "",
    parroco: "",
    pad_nom: "",
    pad_ap_pat: "",
    pad_ap_mat: "",
    mad_nom: "",
    mad_ap_pat: "",
    mad_ap_mat: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createBautizo(bautizo);

      const { baptismId, folio } = response.data.bautizo;

      const nuevoMovimiento = {
        id_sacramento: baptismId,
        tipo_sacramento: "bautizo",
        tipo_movimiento: "registro",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: folio,
      };

      const res = await createMovimiento(nuevoMovimiento);

      if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {

        setBautizo({
          nombre: "",
          a_paterno: "",
          a_materno: "",
          nom_padre: "",
          a_pat_padre: "",
          a_mat_padre: "",
          nom_madre: "",
          a_pat_madre: "",
          a_mat_madre: "",
          dir_bautizo: dirBautizo[0].value,
          lugar_bautizo: lugarBautizo[0].value,
          fecha_bautizo: "",
          lugar_nac: "",
          fecha_nac: "",
          parroco: "",
          pad_nom: "",
          pad_ap_pat: "",
          pad_ap_mat: "",
          mad_nom: "",
          mad_ap_pat: "",
          mad_ap_mat: "",
        });

        showSnackbar("Bautizo creado correctamente!", "success");

      } else {
        console.error("Error creating bautizo:", response?.data || response);
        showSnackbar("Error al crear bautizo!", "error");
      }

    } catch (error) {
      console.error("Error while creating bautizo:", error);
      showSnackbar("Error de red al crear bautizo!", "error");
    }
  };

  const handleChange = (e) => {
    setBautizo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }


  return (
    <div className="form-div">
      <h1 >Registro de Bautizos</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {/* DATOS DEL NIÑO/A */}
        <fieldset>
          <legend>Datos del Niño o Niña</legend>
          <FormGroup id="nombre" label="Nombre" value={bautizo.nombre} onChange={handleChange} required />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={bautizo.a_paterno} onChange={handleChange} required />
          <FormGroup id="a_materno" label="Apellido Materno" value={bautizo.a_materno} onChange={handleChange} required />
          <FormGroup id="lugar_nac" label="Lugar de Nacimiento" value={bautizo.lugar_nac} onChange={handleChange} required />
          <FormGroup id="fecha_nac" label="Fecha de Nacimiento" value={bautizo.fecha_nac} onChange={handleChange} type="date" required />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Bautizo</legend>
          <FormGroup id="fecha_bautizo" label="Fecha de Bautizo" value={bautizo.fecha_bautizo} onChange={handleChange} type="date" required />
          <FormGroup id="dir_bautizo" label="Dirección de Bautizo" value={bautizo.dir_bautizo} onChange={handleChange} type="select" options={dirBautizo} required />
          <FormGroup id="lugar_bautizo" label="Lugar de Bautizo" value={bautizo.lugar_bautizo} onChange={handleChange} type="select" options={lugarBautizo} required />
          <FormGroup id="parroco" label="Parroco" value={bautizo.parroco} onChange={handleChange} required />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de los Padres</legend>
          <FormGroup id="nom_padre" label="Nombre del Padre" value={bautizo.nom_padre} onChange={handleChange} required />
          <FormGroup id="a_pat_padre" label="Apellido Paterno del Padre" value={bautizo.a_pat_padre} onChange={handleChange} required />
          <FormGroup id="a_mat_padre" label="Apellido Materno del Padre" value={bautizo.a_mat_padre} onChange={handleChange} required />

          <FormGroup id="nom_madre" label="Nombre de la Madre" value={bautizo.nom_madre} onChange={handleChange} required />
          <FormGroup id="a_pat_madre" label="Apellido Paterno de la Madre" value={bautizo.a_pat_madre} onChange={handleChange} required />
          <FormGroup id="a_mat_madre" label="Apellido Materno de la Madre" value={bautizo.a_mat_madre} onChange={handleChange} required />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de los Padrinos</legend>
          <FormGroup id="pad_nom" label="Nombre del Padrino" value={bautizo.pad_nom} onChange={handleChange} required />
          <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={bautizo.pad_ap_pat} onChange={handleChange} required />
          <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={bautizo.pad_ap_mat} onChange={handleChange} required />
          <FormGroup id="mad_nom" label="Nombre de la Madrina" value={bautizo.mad_nom} onChange={handleChange} required />
          <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={bautizo.mad_ap_pat} onChange={handleChange} required />
          <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={bautizo.mad_ap_mat} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button" >Agregar</button>
      </form>

    </div >
  )
}