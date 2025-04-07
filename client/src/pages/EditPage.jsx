import { useEffect, useState } from "react";
import { FormGroup } from "../components/FormGroup.jsx";
import { useBautizoStore } from "../store/useBautizoStore.js";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditPage({ showSnackbar }) {
  const location = useLocation();
  const initialBautizo = location.state?.bautismo;
  const navigate = useNavigate();
  const { editBautizo } = useBautizoStore();

  // 📌 Estado del formulario
  const [bautismo, setBautizo] = useState({
    id: initialBautizo?.id || "",
    nombre: initialBautizo?.nombre || "",
    fecha_bautismo: typeof initialBautizo?.fecha_bautismo === "string" ? initialBautizo.fecha_bautismo.substring(0, 10) : "",
    lugar_bautismo: initialBautizo?.lugar_bautismo || "",
    lugar_nacimiento: initialBautizo?.lugar_nacimiento || "",
    fecha_nacimiento: typeof initialBautizo?.fecha_nacimiento === "string" ? initialBautizo.fecha_nacimiento.substring(0, 10) : "",
    padre: initialBautizo?.padre || "",
    madre: initialBautizo?.madre || "",
    padrino: initialBautizo?.padrino || "",
    madrina: initialBautizo?.madrina || "",
  });

  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios en el form

  // 🔄 Sincronizar los inputs con los datos del bautismo cuando se cargue la página o cambie el bautismo seleccionado
  useEffect(() => {
    setBautizo((prev) => ({
      ...prev,
      fecha_bautismo: prev.fecha_bautismo?.substring(0, 10) || "",
      fecha_nacimiento: prev.fecha_nacimiento?.substring(0, 10) || "",
    }));

  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Detecta si el nuevo valor es diferente al inicial
    const isDifferent = initialBautizo?.[id] !== value;

    setBautizo((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  }

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editBautizo({
        id: bautismo.id,
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
        navigate("/", { replace: true });
        showSnackbar("Bautizo editado correctamente!", "success");

      } else {
        showSnackbar("Error al editar bautismo!", "error");
      }

    } catch (error) {
      console.error("Error while editing bautismo:", error);
      showSnackbar("Error de red al editar bautismo!", "error");
    }
  };

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
          label="Fecha de Bautizo"
          value={bautismo.fecha_bautismo}
          onChange={(e) => handleChange(e)}
          type="date"
          name="lugar_bautismo"
        />
        <FormGroup
          id="lugar_bautismo"
          label="Lugar de Bautizo"
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
        <button type="submit" className="submit-button">Editar</button>
      </form>


    </div>
  )
}