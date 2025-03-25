// App.js
import { useEffect, useState } from "react";
import axios from "axios";
import FormGroup from "./components/FormGroup.jsx"; // Importamos el nuevo componente
import "./App.css";
import { Alert, Snackbar } from "@mui/material";
import { generarPDF } from "./components/FeBautismoPdf.jsx";


const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [bautismos, setBautismos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [fechaBautismo, setFechaBautismo] = useState("");
  const [lugarBautismo, setLugarBautismo] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [padre, setPadre] = useState("");
  const [madre, setMadre] = useState("");
  const [padrino, setPadrino] = useState("");
  const [madrina, setMadrina] = useState("");

  // Estado para manejar la alerta
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // "success" | "error"

  useEffect(() => {
    fetchBautismos();
  }, []);

  const fetchBautismos = async () => {
    try {
      const res = await axios.get(`${API_URL}/bautismos`);
      setBautismos(res.data);
    } catch (error) {
      console.error("Error al obtener bautismos", error);
    }
  };

  // const descargarBD = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/bautismos`, {
  //       responseType: 'blob', // Asegúrate de indicar que es un archivo binario
  //     });

  //     // Crear un enlace temporal para descargar el archivo
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'bautismos.sql'); // Nombre del archivo
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.error('Error al descargar la base de datos:', error);
  //   }
  // };


  const addBautismo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/bautismos`, {
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
      fetchBautismos();
      setNombre("");
      setFechaBautismo("");
      setLugarBautismo("");
      setLugarNacimiento("");
      setFechaNacimiento("");
      setPadre("");
      setMadre("");
      setPadrino("");
      setMadrina("");

      // Mostrar alerta de éxito
      setAlertMessage("Bautismo agregado correctamente!");
      setAlertSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al agregar bautismo", error);

      // Mostrar alerta de error
      setAlertMessage("Hubo un error al agregar el bautismo");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const deleteBautismo = async (id) => {
    try {
      await axios.delete(`${API_URL}/bautismos/${id}`);
      fetchBautismos();

      // Mostrar alerta de éxito
      setAlertMessage("Bautismo eliminado correctamente!");
      setAlertSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al eliminar bautismo", error);

      // Mostrar alerta de error
      setAlertMessage("Hubo un error al eliminar el bautismo");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <div >
      <h1 >Registro de Bautismos</h1>
      <form onSubmit={addBautismo} className="form-container">
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
        <button type="submit" className="submit-button">Agregar</button>
      </form>
      <ul>
        {bautismos.map((bautismo) => (
          <li key={bautismo.id} >
            <span><strong>{bautismo.nombre}</strong></span>
            <span>Fecha Bautismo: {bautismo.fecha_bautismo}</span>
            <span>Lugar Bautismo: {bautismo.lugar_bautismo}</span>
            <span>Lugar Nacimiento: {bautismo.lugar_nacimiento}</span>
            <span>Fecha Nacimiento: {bautismo.fecha_nacimiento}</span>
            <span>Padre: {bautismo.padre}</span>
            <span>Madre: {bautismo.madre}</span>
            <span>Padrino: {bautismo.padrino}</span>
            <span>Madrina: {bautismo.madrina}</span>
            <button onClick={() => deleteBautismo(bautismo.id)} >Eliminar</button>
            <button onClick={() => generarPDF({ datos: bautismo })} className="submit-button">
              Generar Fe de Bautismo
            </button>
          </li>
        ))}
      </ul>


      {/* Snackbar para alertas */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
