import { useState } from "react";
import { descargarSQLDump } from "../functions/getAndDownloadDump.js";
import { FormGroup } from "../components/FormGroup.jsx";
import { useBautismoStore } from "../store/useBautismoStore.js";

const API_URL = import.meta.env.VITE_API_URL;

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

  // const addBautismo = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(`${API_URL}/bautismos`, {
  //       nombre,
  //       fecha_bautismo: fechaBautismo,
  //       lugar_bautismo: lugarBautismo,
  //       lugar_nacimiento: lugarNacimiento,
  //       fecha_nacimiento: fechaNacimiento,
  //       padre,
  //       madre,
  //       padrino,
  //       madrina,
  //       fecha_registro: new Date().toISOString().split("T")[0],
  //     });
  //     fetchBautismos();
  //     setNombre("");
  //     setFechaBautismo("");
  //     setLugarBautismo("");
  //     setLugarNacimiento("");
  //     setFechaNacimiento("");
  //     setPadre("");
  //     setMadre("");
  //     setPadrino("");
  //     setMadrina("");

  //     // Mostrar alerta de éxito
  //     setAlertMessage("Bautismo agregado correctamente!");
  //     setAlertSeverity("success");
  //     setOpenSnackbar(true);
  //   } catch (error) {
  //     console.error("Error al agregar bautismo", error);

  //     // Mostrar alerta de error
  //     setAlertMessage("Hubo un error al agregar el bautismo");
  //     setAlertSeverity("error");
  //     setOpenSnackbar(true);
  //   }
  // };

  return (
    <div >
      <h1 >Registro de Bautismos</h1>
      <button onClick={descargarSQLDump}>Exportar DB</button>
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