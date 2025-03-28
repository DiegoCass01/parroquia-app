import { useEffect, useState } from "react";

import { FormGroup } from "../components/FormGroup.jsx";
import { useBautismoStore } from "../store/useBautismoStore.js";
import { useLocation } from "react-router-dom";


export default function EditPage({ showSnackbar }) {
  const location = useLocation();
  const bautismo = location.state?.bautismo;

  const { editBautismo } = useBautismoStore();


  const [nombre, setNombre] = useState(bautismo?.nombre || "");
  const [lugarBautismo, setLugarBautismo] = useState(bautismo?.lugar_bautismo || "");
  const [lugarNacimiento, setLugarNacimiento] = useState(bautismo?.lugar_nacimiento || "");
  const [fechaBautismo, setFechaBautismo] = useState(bautismo?.fecha_bautismo.substring(0, 10) || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(bautismo?.fecha_nacimiento.substring(0, 10) || "");
  const [padre, setPadre] = useState(bautismo?.padre || "");
  const [madre, setMadre] = useState(bautismo?.madre || "");
  const [padrino, setPadrino] = useState(bautismo?.padrino || "");
  const [madrina, setMadrina] = useState(bautismo?.madrina || "");

  // 🔄 Sincronizar los inputs con los datos del bautismo cuando se cargue la página o cambie el bautismo seleccionado
  useEffect(() => {
    if (bautismo) {
      setNombre(bautismo.nombre || "");
      setFechaBautismo(bautismo.fecha_bautismo.substring(0, 10) || "");
      setLugarBautismo(bautismo.lugar_bautismo || "");
      setLugarNacimiento(bautismo.lugar_nacimiento || "");
      setFechaNacimiento(bautismo.fecha_nacimiento.substring(0, 10) || "");
      setPadre(bautismo.padre || "");
      setMadre(bautismo.madre || "");
      setPadrino(bautismo.padrino || "");
      setMadrina(bautismo.madrina || "");
    }
  }, [bautismo]);

  const handleEdit = async (e) => {
    try {
      e.preventDefault();
      await editBautismo({
        id: bautismo.id,
        nombre,
        fecha_bautismo: fechaBautismo,
        lugar_bautismo: lugarBautismo,
        lugar_nacimiento: lugarNacimiento,
        fecha_nacimiento: fechaNacimiento,
        padre,
        madre,
        padrino,
        madrina,
      });

      showSnackbar("Bautismo editado correctamente!", "success");
    } catch (e) {
      console.error(e);
      showSnackbar("Error al editar bautismo!", "error");
    }
  };


  return (
    <div className="form-div">
      <h1 >Registro de {bautismo.nombre} </h1>
      <form onSubmit={handleEdit} className="form-container">
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
        <button type="submit" className="submit-button" >Editar</button>
      </form>


    </div>
  )
}