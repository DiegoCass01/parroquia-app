import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useBautizoStore } from "../../store/useBautizoStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/CreateSacramento.css";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function EditBautizo({ showSnackbar }) {
  const { user } = useAuthStore();
  const { createMovimiento } = useMovimientoStore();
  const location = useLocation();
  const initialBautizo = location.state?.bautizo;
  const navigate = useNavigate();
  const { editBautizo } = useBautizoStore();
  const dirBautizo = [
    { value: "Cd. Mante", name: "Cd. Mante" }
  ]

  const lugarBautizo = [
    { value: "Parroquia Nuestra Señora de Guadalupe Mante", name: "Parroquia Nuestra Señora de Guadalupe Mante" }
  ]

  // 📌 Estado del formulario
  const [bautizo, setBautizo] = useState(initialBautizo);

  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios en el form

  // 🔄 Sincronizar los inputs con los datos del bautizo cuando se cargue la página o cambie el bautizo seleccionado
  useEffect(() => {
    setBautizo((prev) => ({
      ...prev,
      fecha_bautizo: prev.fecha_bautizo?.substring(0, 10) || "",
      fecha_nac: prev.fecha_nac?.substring(0, 10) || "",
    }));

  }, []);

  // 📌 Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Detecta si el nuevo valor es diferente al inicial
    const isDifferent = initialBautizo?.[id] !== value;

    setBautizo((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  }

  // 📌 Función para manejar el envío del formulario
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editBautizo(bautizo);

      const nuevoMovimiento = {
        id_sacramento: bautizo.id_bautizo,
        tipo_sacramento: "bautizo",
        tipo_movimiento: "edicion",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: bautizo.folio,
      };

      const res = await createMovimiento(nuevoMovimiento);

      if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
        navigate("/search/bautizo", { replace: true });
        showSnackbar("Bautizo editado correctamente!", "success");

      } else {
        showSnackbar("Error al editar bautizo!", "error");
      }

    } catch (error) {
      console.error("Error while editing bautizo:", error);
      showSnackbar("Error de red al editar bautizo!", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Editar Bautizo de {bautizo.nombre} {bautizo.a_paterno} {bautizo.a_materno}</h1>
      <form onSubmit={handleEdit} className="form-container">
        {/* DATOS DEL NIÑO/A */}
        <fieldset>
          <legend>Datos del Niño o Niña</legend>
          <FormGroup id="nombre" label="Nombre" value={bautizo.nombre} onChange={handleChange} />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={bautizo.a_paterno} onChange={handleChange} />
          <FormGroup id="a_materno" label="Apellido Materno" value={bautizo.a_materno} onChange={handleChange} />
          <FormGroup id="lugar_nac" label="Lugar de Nacimiento" value={bautizo.lugar_nac} onChange={handleChange} />
          <FormGroup id="fecha_nac" label="Fecha de Nacimiento" value={bautizo.fecha_nac} onChange={handleChange} type="date" />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Bautizo</legend>
          <FormGroup id="fecha_bautizo" label="Fecha de Bautizo" value={bautizo.fecha_bautizo} onChange={handleChange} type="date" />
          <FormGroup id="dir_batuizo" label="Dirección de Bautizo" value={bautizo.dir_batuizo} onChange={handleChange} type="select" options={dirBautizo} />
          <FormGroup id="lugar_bautizo" label="Lugar de Bautizo" value={bautizo.lugar_bautizo} onChange={handleChange} type="select" options={lugarBautizo} />
          <FormGroup id="parroco" label="Parroco" value={bautizo.parroco} onChange={handleChange} />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de los Padres</legend>
          <FormGroup id="nom_padre" label="Nombre del Padre" value={bautizo.nom_padre} onChange={handleChange} />
          <FormGroup id="a_pat_padre" label="Apellido Paterno del Padre" value={bautizo.a_pat_padre} onChange={handleChange} />
          <FormGroup id="a_mat_padre" label="Apellido Materno del Padre" value={bautizo.a_mat_padre} onChange={handleChange} />
          <FormGroup id="nom_madre" label="Nombre de la Madre" value={bautizo.nom_madre} onChange={handleChange} />
          <FormGroup id="a_pat_madre" label="Apellido Paterno de la Madre" value={bautizo.a_pat_madre} onChange={handleChange} />
          <FormGroup id="a_mat_madre" label="Apellido Materno de la Madre" value={bautizo.a_mat_madre} onChange={handleChange} />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de los Padrinos</legend>
          <FormGroup id="pad_nom" label="Nombre del Padrino" value={bautizo.pad_nom} onChange={handleChange} />
          <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={bautizo.pad_ap_pat} onChange={handleChange} />
          <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={bautizo.pad_ap_mat} onChange={handleChange} />
          <FormGroup id="mad_nom" label="Nombre de la Madrina" value={bautizo.mad_nom} onChange={handleChange} />
          <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={bautizo.mad_ap_pat} onChange={handleChange} />
          <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={bautizo.mad_ap_mat} onChange={handleChange} />
        </fieldset>

        <button type="submit" className="submit-button">Editar</button>
      </form>


    </div>
  )
}