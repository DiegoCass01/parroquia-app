import axios from "axios";
import { generarMySQLDump } from "./makeDump";

const API_URL = import.meta.env.VITE_API_URL;

const obtenerYGenerarDump = async (apiUrl) => {
  try {
    // 1. Obtener los datos de la API
    const response = await axios.get(apiUrl);
    const datos = response.data;

    // Verificar que la respuesta sea un array
    if (!Array.isArray(datos)) {
      throw new Error("La respuesta de la API no es un array");
    }

    // 2. Generar el MySQL dump con los datos obtenidos
    const dump = generarMySQLDump(datos);

    // 3. Devolver el dump generado
    return dump;
  } catch (error) {
    console.error("Error al obtener los datos de la API:", error);
  }
};

const descargarSQLDump = () => {
  obtenerYGenerarDump(`${API_URL}/bautismos`)
    .then((dump) => {
      if (!dump) {
        console.error("No se pudo generar el dump");
        return;
      }

      // Crear un Blob con el contenido del dump
      const blob = new Blob([dump], { type: "application/sql" });

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const fecha = Date.now();
      const hoy = new Date(fecha);
      link.download = `bautismos_dump_${hoy.toLocaleDateString()}.sql`; // Nombre del archivo
      link.click(); // Simular el clic para descargar el archivo
    })
    .catch((error) => {
      console.error("Error al obtener los datos de la API:", error);
    });
};

export { descargarSQLDump };
