import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useMatrimonioStore } from "../../store/useMatrimonioStore.js";
import "../../styles/sacramentos/CreateSacramento.css";

export default function CreateMatrimonio({ showSnackbar }) {
  const { createMatrimonio } = useMatrimonioStore();

  const [matrimonio, setMatrimonio] = useState({
    nombre_novio: "",
    a_pat_novio: "",
    a_mat_novio: "",
    nombre_novia: "",
    a_pat_novia: "",
    a_mat_novia: "",
    fecha_matrimonio: "",
    libro: "",
    foja: "",
    acta: "",
  });

  const handleChange = (e) => {
    setMatrimonio((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createMatrimonio(matrimonio);

      if (response && response.status >= 200 && response.status < 300) {
        setMatrimonio({
          nombre_novio: "",
          a_pat_novio: "",
          a_mat_novio: "",
          nombre_novia: "",
          a_pat_novia: "",
          a_mat_novia: "",
          fecha_matrimonio: "",
          libro: "",
          foja: "",
          acta: "",
        });
        showSnackbar("Matrimonio registrado correctamente!", "success");
      } else {
        showSnackbar("Error al registrar el matrimonio", "error");
        console.error("Error al crear matrimonio:", response?.data || response);
      }
    } catch (error) {
      console.error("Error en la red:", error);
      showSnackbar("Error de red al crear matrimonio", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Registro de Matrimonios</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <fieldset>
          <legend>Datos del Novio</legend>
          <FormGroup id="nombre_novio" label="Nombre del Novio" value={matrimonio.nombre_novio} onChange={handleChange} required />
          <FormGroup id="a_pat_novio" label="Apellido Paterno del Novio" value={matrimonio.a_pat_novio} onChange={handleChange} required />
          <FormGroup id="a_mat_novio" label="Apellido Materno del Novio" value={matrimonio.a_mat_novio} onChange={handleChange} required />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de la Novia</legend>
          <FormGroup id="nombre_novia" label="Nombre de la Novia" value={matrimonio.nombre_novia} onChange={handleChange} required />
          <FormGroup id="a_pat_novia" label="Apellido Paterno de la Novia" value={matrimonio.a_pat_novia} onChange={handleChange} required />
          <FormGroup id="a_mat_novia" label="Apellido Materno de la Novia" value={matrimonio.a_mat_novia} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Matrimonio</legend>
          <FormGroup id="fecha_matrimonio" label="Fecha del Matrimonio" value={matrimonio.fecha_matrimonio} onChange={handleChange} type="date" required />
          <FormGroup id="libro" label="Libro" value={matrimonio.libro} onChange={handleChange} required />
          <FormGroup id="foja" label="Foja" value={matrimonio.foja} onChange={handleChange} required />
          <FormGroup id="acta" label="Acta" value={matrimonio.acta} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button">
          Agregar
        </button>
      </form>
    </div>
  );
}
