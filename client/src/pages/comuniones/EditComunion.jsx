import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useComunionStore } from "../../store/useComunionStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/CreateSacramento.css";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";

export default function EditComunion({ showSnackbar }) {
  const { user } = useAuthStore();
  const { createMovimiento } = useMovimientoStore();
  const location = useLocation();
  const initialComunion = location.state?.comunion;
  const navigate = useNavigate();
  const { editComunion } = useComunionStore();

  // 📌 Estado del formulario
  const [comunion, setComunion] = useState(initialComunion);

  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios en el form

  // 🔄 Sincronizar los inputs con los datos del comunion cuando se cargue la página o cambie el comunion seleccionado
  useEffect(() => {
    setComunion((prev) => ({
      ...prev,
      fecha_comunion: prev.fecha_comunion?.substring(0, 10) || "",
    }));

  }, []);

  // 📌 Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Detecta si el nuevo valor es diferente al inicial
    const isDifferent = initialComunion?.[id] !== value;

    setComunion((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  }

  // 📌 Función para manejar el envío del formulario
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editComunion(comunion);

      const nuevoMovimiento = {
        id_sacramento: comunion.id_comunion,
        tipo_sacramento: "comunion",
        tipo_movimiento: "edicion",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: "",
      };

      const res = await createMovimiento(nuevoMovimiento);

      if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
        navigate("/search/comunion", { replace: true });
        showSnackbar("Comunion editado correctamente!", "success");

      } else {
        showSnackbar("Error al editar comunion!", "error");
      }

    } catch (error) {
      console.error("Error while editing comunion:", error);
      showSnackbar("Error de red al editar comunion!", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Editar Comunion de {comunion.nombre} {comunion.a_paterno} {comunion.a_materno}</h1>
      <form onSubmit={handleEdit} className="form-container">
        {/* DATOS DEL NIÑO/A */}
        <fieldset>
          <legend>Datos del Niño o Niña</legend>
          <FormGroup id="nombre" label="Nombre" value={comunion.nombre} onChange={handleChange} name="nombre" />
          <FormGroup id="a_paterno" label="Apellido Paterno" value={comunion.a_paterno} onChange={handleChange} name="a_paterno" />
          <FormGroup id="a_materno" label="Apellido Materno" value={comunion.a_materno} onChange={handleChange} name="a_materno" />
        </fieldset>
        <br />
        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos de la Comunión</legend>
          <FormGroup id="parroquia_bautizo" label="Bautizado(a) en" value={comunion.parroquia_bautizo} onChange={handleChange} />
          <FormGroup id="fecha_comunion" label="Fecha de Comunion" value={comunion.fecha_comunion} onChange={handleChange} type="date" />
          <FormGroup id="dir_comunion" label="Dirección de la Comunion" value={comunion.dir_comunion} onChange={handleChange} />
          <FormGroup id="lugar_comunion" label="Lugar de la Comunión" value={comunion.lugar_comunion} onChange={handleChange} />
          <FormGroup id="parroco" label="Parroco" value={comunion.parroco} onChange={handleChange} />
        </fieldset>
        <br />
        {/* DATOS DEL PADRE */}
        <fieldset>
          <legend>Datos de los Padres</legend>
          <FormGroup id="nom_padre" label="Nombre del Padre" value={comunion.nom_padre} onChange={handleChange} name="nom_padre" />
          <FormGroup id="a_pat_padre" label="Apellido Paterno del Padre" value={comunion.a_pat_padre} onChange={handleChange} name="a_pat_padre" />
          <FormGroup id="a_mat_padre" label="Apellido Materno del Padre" value={comunion.a_mat_padre} onChange={handleChange} name="a_mat_padre" />

          <FormGroup id="nom_madre" label="Nombre de la Madre" value={comunion.nom_madre} onChange={handleChange} name="nom_madre" />
          <FormGroup id="a_pat_madre" label="Apellido Paterno de la Madre" value={comunion.a_pat_madre} onChange={handleChange} name="a_pat_madre" />
          <FormGroup id="a_mat_madre" label="Apellido Materno de la Madre" value={comunion.a_mat_madre} onChange={handleChange} name="a_mat_madre" />
        </fieldset>
        <br />
        <fieldset>
          <legend>Datos de los Padrinos</legend>
          <FormGroup id="pad_nom" label="Nombre del Padrino" value={comunion.pad_nom} onChange={handleChange} />
          <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={comunion.pad_ap_pat} onChange={handleChange} />
          <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={comunion.pad_ap_mat} onChange={handleChange} />
          <FormGroup id="mad_nom" label="Nombre de la Madrina" value={comunion.mad_nom} onChange={handleChange} />
          <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={comunion.mad_ap_pat} onChange={handleChange} />
          <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={comunion.mad_ap_mat} onChange={handleChange} />
        </fieldset>

        <button type="submit" className="submit-button">Editar</button>
      </form>

    </div>
  )
}