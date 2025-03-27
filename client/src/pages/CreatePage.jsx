import { useState } from "react";

import { FormGroup } from "../components/FormGroup.jsx";
import { useBautismoStore } from "../store/useBautismoStore.js";


export default function CreatePage({ showSnackbar }) {

  const { createBautismo } = useBautismoStore();

  const [nombre, setNombre] = useState("");
  const [fechaBautismo, setFechaBautismo] = useState("");
  const [lugarBautismo, setLugarBautismo] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [padre, setPadre] = useState("");
  const [madre, setMadre] = useState("");
  const [padrino, setPadrino] = useState("");
  const [madrina, setMadrina] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBautismo({
      nombre,
      fecha_bautismo: fechaBautismo,
      lugar_bautismo: lugarBautismo,
      lugar_nacimiento: lugarNacimiento,
      fecha_nacimiento: fechaNacimiento,
      padre,
      madre,
      padrino,
      madrina,
      fecha_registro: new Date().toISOString().split("T")[0],
    });

    setNombre("");
    setFechaBautismo("");
    setLugarBautismo("");
    setLugarNacimiento("");
    setFechaNacimiento("");
    setPadre("");
    setMadre("");
    setPadrino("");
    setMadrina("");
    showSnackbar("Bautismo agregado correctamente!", "success");
  };


  return (
    <div className="form-div">
      <h1 >Registro de Bautismos</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <FormGroup
          id="nombre"
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <FormGroup
          id="fechaBautismo"
          label="Fecha de Bautismo"
          value={fechaBautismo}
          onChange={(e) => setFechaBautismo(e.target.value)}
          type="date"
          required
        />
        <FormGroup
          id="lugarBautismo"
          label="Lugar de Bautismo"
          value={lugarBautismo}
          onChange={(e) => setLugarBautismo(e.target.value)}
          required
        />
        <FormGroup
          id="lugarNacimiento"
          label="Lugar de Nacimiento"
          value={lugarNacimiento}
          onChange={(e) => setLugarNacimiento(e.target.value)}
          required
        />
        <FormGroup
          id="fechaNacimiento"
          label="Fecha de Nacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          type="date"
          required
        />
        <FormGroup
          id="padre"
          label="Padre"
          value={padre}
          onChange={(e) => setPadre(e.target.value)}
          required
        />
        <FormGroup
          id="madre"
          label="Madre"
          value={madre}
          onChange={(e) => setMadre(e.target.value)}
          required
        />
        <FormGroup
          id="padrino"
          label="Padrino"
          value={padrino}
          onChange={(e) => setPadrino(e.target.value)}
          required
        />
        <FormGroup
          id="madrina"
          label="Madrina"
          value={madrina}
          onChange={(e) => setMadrina(e.target.value)}
          required
        />
        <button type="submit" className="submit-button" >Agregar</button>
      </form>


    </div>
  )
}