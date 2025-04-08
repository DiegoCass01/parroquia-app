import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useComunionStore } from "../../store/useComunionStore.js";
import "../../styles/sacramentos/CreateSacramento.css";
export default function CreateComunion({ showSnackbar }) {

  const { createComunion } = useComunionStore();

  const [bautizo, setComunion] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createComunion({
        nombre: bautizo.nombre,
        a_paterno: bautizo.a_paterno,
        a_materno: bautizo.a_materno,
        lugar_bautizo: bautizo.lugar_bautizo,
        fecha_bautizo: bautizo.fecha_bautizo,
        fecha_nac: bautizo.fecha_nac,
        libro: bautizo.libro,
        foja: bautizo.foja,
        acta: bautizo.acta,
      });

      if (response && response.status >= 200 && response.status < 300) {
        setComunion({
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
        showSnackbar("Comunion creado correctamente!", "success");
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
    setComunion(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="form-div">
      <h1 >Registro de Comuniones</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <FormGroup
          id="nombre"
          label="Nombre"
          value={bautizo.nombre}
          onChange={handleChange}
          required
        />
        <FormGroup
          id="a_paterno"
          label="Apellido Paterno"
          value={bautizo.a_paterno}
          onChange={handleChange}
          required
        />
        <FormGroup
          id="a_materno"
          label="Apellido Materno"
          value={bautizo.a_materno}
          onChange={handleChange}
          required
        />
        <FormGroup
          id="fecha_bautizo"
          label="Fecha de Comunion"
          value={bautizo.fecha_bautizo}
          onChange={handleChange}
          type="date"
          required
        />
        <FormGroup
          id="lugar_bautizo"
          label="Lugar de Comunion"
          value={bautizo.lugar_bautizo}
          onChange={handleChange}
          required
        />
        <FormGroup
          id="fecha_nac"
          label="Fecha de Nacimiento"
          value={bautizo.fecha_nac}
          onChange={handleChange}
          type="date"
          required
        />
        <FormGroup
          id="libro"
          label="Libro"
          value={bautizo.libro}
          onChange={handleChange}
          required
        />
        <FormGroup
          id="foja"
          label="Foja"
          value={bautizo.foja}
          onChange={handleChange}
          required
        />
        <FormGroup
          id="acta"
          label="Acta"
          value={bautizo.acta}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-button" >Agregar</button>
      </form>


    </div>
  )
}