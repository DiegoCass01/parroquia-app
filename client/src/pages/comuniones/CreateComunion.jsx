import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useComunionStore } from "../../store/useComunionStore.js";
import "../../styles/sacramentos/CreateSacramento.css";
export default function CreateComunion({ showSnackbar }) {

  const { createComunion } = useComunionStore();

  const [comunion, setComunion] = useState({
    nombre: "",
    a_paterno: "",
    a_materno: "",
    nom_padre: "",
    a_pat_padre: "",
    a_mat_padre: "",
    nom_madre: "",
    a_pat_madre: "",
    a_mat_madre: "",
    parroquia_bautizo: "",
    dir_comunion: "",
    lugar_comunion: "",
    fecha_comunion: "",
    libro: "",
    foja: "",
    acta: "",
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
      const response = await createComunion(comunion);

      if (response && response.status >= 200 && response.status < 300) {
        setComunion({
          nombre: "",
          a_paterno: "",
          a_materno: "",
          nom_padre: "",
          a_pat_padre: "",
          a_mat_padre: "",
          nom_madre: "",
          a_pat_madre: "",
          a_mat_madre: "",
          parroquia_bautizo: "",
          dir_comunion: "",
          lugar_comunion: "",
          fecha_comunion: "",
          libro: "",
          foja: "",
          acta: "",
          pad_nom: "",
          pad_ap_pat: "",
          pad_ap_mat: "",
          mad_nom: "",
          mad_ap_pat: "",
          mad_ap_mat: ""
        });
        showSnackbar("Comunion creado correctamente!", "success");
      } else {
        console.error("Error creating comunion:", response?.data || response);
        showSnackbar("Error al crear comunion!", "error");
      }

    } catch (error) {
      console.error("Error while creating comunion:", error);
      showSnackbar("Error de red al crear comunion!", "error");
    }
  };

  const handleChange = (e) => {
    setComunion(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="form-div">
      <h1 >Registro de Comuniones</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {/* DATOS DEL NIÑO/A */}
        <fieldset>
          <legend>Datos del Niño o Niña</legend>
          <FormGroup id="nombre" label="Nombre" value={comunion.nombre} onChange={handleChange} name="nombre" required />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={comunion.a_paterno} onChange={handleChange} name="a_paterno" required />
          <FormGroup id="a_materno" label="Apellido Materno" value={comunion.a_materno} onChange={handleChange} name="a_materno" required />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos de la Comunión</legend>
          <FormGroup id="parroquia_bautizo" label="Bautizado(a) en" value={comunion.parroquia_bautizo} onChange={handleChange} required />
          <FormGroup id="fecha_comunion" label="Fecha de Comunion" value={comunion.fecha_comunion} onChange={handleChange} type="date" required />
          <FormGroup id="dir_comunion" label="Dirección de la comunión" value={comunion.dir_comunion} onChange={handleChange} required />
          <FormGroup id="lugar_comunion" label="Lugar Comunión" value={comunion.lugar_comunion} onChange={handleChange} required />
          <FormGroup id="parroco" label="Parroco" value={comunion.parroco} onChange={handleChange} required />
          <FormGroup id="libro" label="Libro" value={comunion.libro} onChange={handleChange} required />
          <FormGroup id="foja" label="Foja" value={comunion.foja} onChange={handleChange} required />
          <FormGroup id="acta" label="Acta" value={comunion.acta} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DEL PADRE */}
        <fieldset>
          <legend>Datos de los Padres</legend>
          <FormGroup id="nom_padre" label="Nombre del Padre" value={comunion.nom_padre} onChange={handleChange} name="nom_padre" required />
          <FormGroup id="a_pat_padre" label="Apellido Paterno del Padre" value={comunion.a_pat_padre} onChange={handleChange} name="a_pat_padre" required />
          <FormGroup id="a_mat_padre" label="Apellido Materno del Padre" value={comunion.a_mat_padre} onChange={handleChange} name="a_mat_padre" required />

          <FormGroup id="nom_madre" label="Nombre de la Madre" value={comunion.nom_madre} onChange={handleChange} name="nom_madre" required />
          <FormGroup id="a_pat_madre" label="Apellido Paterno de la Madre" value={comunion.a_pat_madre} onChange={handleChange} name="a_pat_madre" required />
          <FormGroup id="a_mat_madre" label="Apellido Materno de la Madre" value={comunion.a_mat_madre} onChange={handleChange} name="a_mat_madre" required />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de los Padrinos</legend>
          <FormGroup id="pad_nom" label="Nombre del Padrino" value={comunion.pad_nom} onChange={handleChange} required />
          <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={comunion.pad_ap_pat} onChange={handleChange} required />
          <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={comunion.pad_ap_mat} onChange={handleChange} required />
          <FormGroup id="mad_nom" label="Nombre de la Madrina" value={comunion.mad_nom} onChange={handleChange} required />
          <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={comunion.mad_ap_pat} onChange={handleChange} required />
          <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={comunion.mad_ap_mat} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button" >Agregar</button>
      </form>
    </div>
  )
}