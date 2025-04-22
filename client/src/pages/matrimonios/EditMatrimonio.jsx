import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useMatrimonioStore } from "../../store/useMatrimonioStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/CreateSacramento.css";

export default function EditMatrimonio({ showSnackbar }) {
  const location = useLocation();
  const initialMatrimonio = location.state?.matrimonio;
  const navigate = useNavigate();
  const { editMatrimonio } = useMatrimonioStore();

  const [matrimonio, setMatrimonio] = useState(initialMatrimonio);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMatrimonio((prev) => ({
      ...prev,
      fecha_matrimonio: prev.fecha_matrimonio?.substring(0, 10) || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const isDifferent = initialMatrimonio?.[id] !== value;
    setMatrimonio((prev) => ({ ...prev, [id]: value }));
    setHasChanges(isDifferent);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      return showSnackbar("No se han realizado cambios!", "warning");
    }

    try {
      const response = await editMatrimonio(matrimonio);

      if (response?.status === 200) {
        navigate("/search/matrimonio", { replace: true });
        showSnackbar("Matrimonio editado correctamente!", "success");
      } else {
        showSnackbar("Error al editar matrimonio!", "error");
      }
    } catch (error) {
      console.error("Error al editar matrimonio:", error);
      showSnackbar("Error de red al editar matrimonio!", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>
        Editar Matrimonio de {matrimonio.nombre_novio} {matrimonio.a_pat_novio} y {matrimonio.nombre_novia} {matrimonio.a_pat_novia}
      </h1>
      <form onSubmit={handleEdit} className="form-container">
        {/* DATOS DEL NOVIO */}
        <fieldset>
          <legend>Datos del Novio</legend>
          <FormGroup id="nombre_novio" label="Nombre del Novio" value={matrimonio.nombre_novio} onChange={handleChange} />
          <FormGroup id="a_pat_novio" label="Apellido Paterno del Novio" value={matrimonio.a_pat_novio} onChange={handleChange} />
          <FormGroup id="a_mat_novio" label="Apellido Materno del Novio" value={matrimonio.a_mat_novio} onChange={handleChange} />
          <FormGroup id="nom_padre_novio" label="Nombre del Padre del Novio" value={matrimonio.nom_padre_novio} onChange={handleChange} />
          <FormGroup id="a_pat_padre_novio" label="Apellido Paterno del Padre del Novio" value={matrimonio.a_pat_padre_novio} onChange={handleChange} />
          <FormGroup id="a_mat_padre_novio" label="Apellido Materno del Padre del Novio" value={matrimonio.a_mat_padre_novio} onChange={handleChange} />
          <FormGroup id="nom_madre_novio" label="Nombre de la Madre del Novio" value={matrimonio.nom_madre_novio} onChange={handleChange} />
          <FormGroup id="a_pat_madre_novio" label="Apellido Paterno de la Madre del Novio" value={matrimonio.a_pat_madre_novio} onChange={handleChange} />
          <FormGroup id="a_mat_madre_novio" label="Apellido Materno de la Madre del Novio" value={matrimonio.a_mat_madre_novio} onChange={handleChange} />
        </fieldset>

        <br />

        {/* DATOS DE LA NOVIA */}
        <fieldset>
          <legend>Datos de la Novia</legend>
          <FormGroup id="nombre_novia" label="Nombre de la Novia" value={matrimonio.nombre_novia} onChange={handleChange} />
          <FormGroup id="a_pat_novia" label="Apellido Paterno de la Novia" value={matrimonio.a_pat_novia} onChange={handleChange} />
          <FormGroup id="a_mat_novia" label="Apellido Materno de la Novia" value={matrimonio.a_mat_novia} onChange={handleChange} />
          <FormGroup id="nom_padre_novia" label="Nombre del Padre de la Novia" value={matrimonio.nom_padre_novia} onChange={handleChange} />
          <FormGroup id="a_pat_padre_novia" label="Apellido Paterno del Padre de la Novia" value={matrimonio.a_pat_padre_novia} onChange={handleChange} />
          <FormGroup id="a_mat_padre_novia" label="Apellido Materno del Padre de la Novia" value={matrimonio.a_mat_padre_novia} onChange={handleChange} />
          <FormGroup id="nom_madre_novia" label="Nombre de la Madre de la Novia" value={matrimonio.nom_madre_novia} onChange={handleChange} />
          <FormGroup id="a_pat_madre_novia" label="Apellido Paterno de la Madre de la Novia" value={matrimonio.a_pat_madre_novia} onChange={handleChange} />
          <FormGroup id="a_mat_madre_novia" label="Apellido Materno de la Madre de la Novia" value={matrimonio.a_mat_madre_novia} onChange={handleChange} />
        </fieldset>

        <br />

        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Matrimonio</legend>
          <FormGroup id="dir_matrimonio" label="Dirección del Matrimonio" value={matrimonio.dir_matrimonio} onChange={handleChange} />
          <FormGroup id="lugar_matrimonio" label="Lugar del Matrimonio" value={matrimonio.lugar_matrimonio} onChange={handleChange} />
          <FormGroup id="fecha_matrimonio" label="Fecha del Matrimonio" type="date" value={matrimonio.fecha_matrimonio} onChange={handleChange} />
        </fieldset>

        <br />

        {/* DATOS DE LOS PADRINOS */}
        <fieldset>
          <legend>Datos de los Padrinos</legend>
          <FormGroup id="pad_nom" label="Nombre del Padrino" value={matrimonio.pad_nom} onChange={handleChange} />
          <FormGroup id="pad_ap_pat" label="Apellido Paterno del Padrino" value={matrimonio.pad_ap_pat} onChange={handleChange} />
          <FormGroup id="pad_ap_mat" label="Apellido Materno del Padrino" value={matrimonio.pad_ap_mat} onChange={handleChange} />
          <FormGroup id="mad_nom" label="Nombre de la Madrina" value={matrimonio.mad_nom} onChange={handleChange} />
          <FormGroup id="mad_ap_pat" label="Apellido Paterno de la Madrina" value={matrimonio.mad_ap_pat} onChange={handleChange} />
          <FormGroup id="mad_ap_mat" label="Apellido Materno de la Madrina" value={matrimonio.mad_ap_mat} onChange={handleChange} />
        </fieldset>
        <br />

        {/* DATOS DE LOS PADRINOS */}
        <fieldset>
          <legend>Datos de los Testigos</legend>
          <FormGroup id="testigo_nom" label="Nombre del Testigo" value={matrimonio.testigo_nom} onChange={handleChange} />
          <FormGroup id="testigo_ap_pat" label="Apellido Paterno del Testigo" value={matrimonio.testigo_ap_pat} onChange={handleChange} />
          <FormGroup id="testigo_ap_mat" label="Apellido Materno del Testigo" value={matrimonio.testigo_ap_mat} onChange={handleChange} />
          <FormGroup id="testigo2_nom" label="Nombre de la Testigo" value={matrimonio.testigo2_nom} onChange={handleChange} />
          <FormGroup id="testigo2_ap_pat" label="Apellido Paterno de la Testigo" value={matrimonio.testigo2_ap_pat} onChange={handleChange} />
          <FormGroup id="testigo2_ap_mat" label="Apellido Materno de la Testigo" value={matrimonio.testigo2_ap_mat} onChange={handleChange} />
        </fieldset>

        <button type="submit" className="submit-button">Editar</button>
      </form>
    </div>
  );
}
