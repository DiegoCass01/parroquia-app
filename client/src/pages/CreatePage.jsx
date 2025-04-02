import { useState } from "react";
import { FormGroup } from "../components/FormGroup.jsx";
import { useBautismoStore } from "../store/useBautismoStore.js";


export default function CreatePage({ showSnackbar }) {

  const { createBautismo } = useBautismoStore();

  const [bautismo, setBautismo] = useState({
    nombre: "",
    fecha_bautismo: "",
    lugar_bautismo: "",
    lugar_nacimiento: "",
    fecha_nacimiento: "",
    padre: "",
    madre: "",
    padrino: "",
    madrina: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await createBautismo({
        nombre: bautismo.nombre,
        fecha_bautismo: bautismo.fecha_bautismo,
        lugar_bautismo: bautismo.lugar_bautismo,
        lugar_nacimiento: bautismo.lugar_nacimiento,
        fecha_nacimiento: bautismo.fecha_nacimiento,
        padre: bautismo.padre,
        madre: bautismo.madre,
        padrino: bautismo.padrino,
        madrina: bautismo.madrina,
        fecha_registro: new Date().toISOString().split("T")[0],
      });

      if (response?.status === 200) {
        setBautismo({
          nombre: "",
          fecha_bautismo: "",
          lugar_bautismo: "",
          lugar_nacimiento: "",
          fecha_nacimiento: "",
          padre: "",
          madre: "",
          padrino: "",
          madrina: "",
        });
        showSnackbar("Bautismo creado correctamente!", "success");
      } else {
        showSnackbar("Error al crear bautismo!", "error");
      }
    } catch (error) {
      console.error("Error while creating bautismo:", error);
      showSnackbar("Error de red al crear bautismo!", "error");
    }
  };

  const handleChange = (e) => {
    setBautismo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="form-div">
      <h1 >Registro de Bautismos</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <FormGroup
          id="nombre"
          label="Nombre"
          value={bautismo.nombre}
          onChange={(e) => handleChange(e)}
          required
        />
        <FormGroup
          id="fecha_bautismo"
          label="Fecha de Bautismo"
          value={bautismo.fecha_bautismo}
          onChange={(e) => handleChange(e)}
          type="date"
          required
        />
        <FormGroup
          id="lugar_bautismo"
          label="Lugar de Bautismo"
          value={bautismo.lugar_bautismo}
          onChange={(e) => handleChange(e)}
          required
        />
        <FormGroup
          id="lugar_nacimiento"
          label="Lugar de Nacimiento"
          value={bautismo.lugar_nacimiento}
          onChange={(e) => handleChange(e)}
          required
        />
        <FormGroup
          id="fecha_nacimiento"
          label="Fecha de Nacimiento"
          value={bautismo.fecha_nacimiento}
          onChange={(e) => handleChange(e)}
          type="date"
          required
        />
        <FormGroup
          id="padre"
          label="Padre"
          value={bautismo.padre}
          onChange={(e) => handleChange(e)}
          required
        />
        <FormGroup
          id="madre"
          label="Madre"
          value={bautismo.madre}
          onChange={(e) => handleChange(e)}
          required
        />
        <FormGroup
          id="padrino"
          label="Padrino"
          value={bautismo.padrino}
          onChange={(e) => handleChange(e)}
          required
        />
        <FormGroup
          id="madrina"
          label="Madrina"
          value={bautismo.madrina}
          onChange={(e) => handleChange(e)}
          required
        />
        <button type="submit" className="submit-button" >Agregar</button>
      </form>


    </div>
  )
}