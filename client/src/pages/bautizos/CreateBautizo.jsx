import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useBautizoStore } from "../../store/useBautizoStore.js";
import "../../styles/sacramentos/CreateSacramento.css";
export default function CreateBautizo({ showSnackbar }) {

  const { createBautizo } = useBautizoStore();

  const [bautizo, setBautizo] = useState({
    nombre: "",
    a_paterno: "",
    a_materno: "",
    lugar_bautizo: "Parroquia Nuestra Señora de Guadalupe Mante",
    fecha_bautizo: "",
    fecha_nac: "",
    libro: "",
    foja: "",
    acta: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createBautizo(bautizo);

      if (response && response.status >= 200 && response.status < 300) {
        setBautizo({
          nombre: "",
          a_paterno: "",
          a_materno: "",
          lugar_bautizo: "",
          fecha_bautizo: "",
          fecha_nac: "",
          libro: "",
          foja: "",
          acta: "",
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
  const options = [
    { value: "Parroquia Nuestra Señora de Guadalupe Mante", name: "Parroquia Nuestra Señora de Guadalupe Mante" }
  ]

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
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Bautizo</legend>
          <FormGroup id="fecha_bautizo" label="Fecha de Bautizo" value={bautizo.fecha_bautizo} onChange={handleChange} type="date" required />
          <FormGroup id="lugar_bautizo" label="Lugar de Bautizo" value={bautizo.lugar_bautizo} onChange={handleChange} type="select" options={options} required />
          <FormGroup id="fecha_nac" label="Fecha de Nacimiento" value={bautizo.fecha_nac} onChange={handleChange} type="date" required />
          <FormGroup id="libro" label="Libro" value={bautizo.libro} onChange={handleChange} required />
          <FormGroup id="foja" label="Foja" value={bautizo.foja} onChange={handleChange} required />
          <FormGroup id="acta" label="Acta" value={bautizo.acta} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button" >Agregar</button>
      </form>


    </div >
  )
}