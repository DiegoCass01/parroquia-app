import { useEffect, useState } from "react";
import { FormGroup } from "../components/FormGroup.jsx";
import { useBautismoStore } from "../store/useBautismoStore.js";
import { useLocation } from "react-router-dom";


export default function EditPage({ showSnackbar }) {
  const location = useLocation();
  const initialBautismo = location.state?.bautismo;

  const { editBautismo } = useBautismoStore();

  // 📌 Estado del formulario
  const [bautismo, setBautismo] = useState({
    nombre: initialBautismo?.nombre || "",
    fecha_bautismo: typeof initialBautismo?.fecha_bautismo === "string" ? initialBautismo.fecha_bautismo.substring(0, 10) : "",
    lugar_bautismo: initialBautismo?.lugar_bautismo || "",
    lugar_nacimiento: initialBautismo?.lugar_nacimiento || "",
    fecha_nacimiento: typeof initialBautismo?.fecha_nacimiento === "string" ? initialBautismo.fecha_nacimiento.substring(0, 10) : "",
    padre: initialBautismo?.padre || "",
    madre: initialBautismo?.madre || "",
    padrino: initialBautismo?.padrino || "",
    madrina: initialBautismo?.madrina || "",
  });

  // 🔄 Sincronizar los inputs con los datos del bautismo cuando se cargue la página o cambie el bautismo seleccionado
  useEffect(() => {
    setBautismo((prev) => ({
      ...prev,
      fecha_bautismo: prev.fecha_bautismo?.substring(0, 10) || "",
      fecha_nacimiento: prev.fecha_nacimiento?.substring(0, 10) || "",
    }));
  }, []);

  const handleEdit = async (e) => {
    try {
      e.preventDefault();
      const response = await editBautismo({
        id: initialBautismo.id,
        nombre: bautismo.nombre,
        fecha_bautismo: bautismo.fecha_bautismo,
        lugar_bautismo: bautismo.lugar_bautismo,
        lugar_nacimiento: bautismo.lugar_nacimiento,
        fecha_nacimiento: bautismo.fecha_nacimiento,
        padre: bautismo.padre,
        madre: bautismo.madre,
        padrino: bautismo.padrino,
        madrina: bautismo.madrina
      });
      if (response?.status === 200) {
        showSnackbar("Bautismo editado correctamente!", "success");

      } else {
        showSnackbar("Error al editar bautismo!", "error");
      }
    } catch (error) {
      console.error("Error while editing bautismo:", error);
      showSnackbar("Error de red al editar bautismo!", "error");
    }
  };

  const handleChange = (e) => {
    setBautismo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="form-div">
      <form onSubmit={handleEdit} className="form-container">
        <FormGroup
          id="nombre"
          label="Nombre"
          value={bautismo.nombre}
          onChange={handleChange}
          name="fecha_bautismo"
        />
        <FormGroup
          id="fecha_bautismo"
          label="Fecha de Bautismo"
          value={bautismo.fecha_bautismo}
          onChange={(e) => handleChange(e)}
          type="date"
          name="lugar_bautismo"
        />
        <FormGroup
          id="lugar_bautismo"
          label="Lugar de Bautismo"
          value={bautismo.lugar_bautismo}
          onChange={(e) => handleChange(e)}
          name="lugar_nacimiento"
        />
        <FormGroup
          id="lugar_nacimiento"
          label="Lugar de Nacimiento"
          value={bautismo.lugar_nacimiento}
          onChange={(e) => handleChange(e)}
          name="fecha_nacimiento"
        />
        <FormGroup
          id="fecha_nacimiento"
          label="Fecha de Nacimiento"
          value={bautismo.fecha_nacimiento}
          onChange={(e) => handleChange(e)}
          type="date"
          name="padre"
        />
        <FormGroup
          id="padre"
          label="Padre"
          value={bautismo.padre}
          onChange={(e) => handleChange(e)}
          name="madre"
        />
        <FormGroup
          id="madre"
          label="Madre"
          value={bautismo.madre}
          onChange={(e) => handleChange(e)}
          name="padrino"
        />
        <FormGroup
          id="padrino"
          label="Padrino"
          value={bautismo.padrino}
          onChange={(e) => handleChange(e)}
          name="madrina"
        />
        <FormGroup
          id="madrina"
          label="Madrina"
          value={bautismo.madrina}
          onChange={(e) => handleChange(e)}
          required
        />
        <button type="submit" className="submit-button" >Editar</button>
      </form>


    </div>
  )
}