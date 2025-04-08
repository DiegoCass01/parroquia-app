import { useEffect, useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useMatrimonioStore } from "../../store/useMatrimonioStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/sacramentos/SearchSacramento.css";

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
          <FormGroup id="nombre_novio" label="Nombre del Novio" value={matrimonio.nombre_novio} onChange={handleChange} required />
          <FormGroup id="a_pat_novio" label="Apellido Paterno del Novio" value={matrimonio.a_pat_novio} onChange={handleChange} required />
          <FormGroup id="a_mat_novio" label="Apellido Materno del Novio" value={matrimonio.a_mat_novio} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DE LA NOVIA */}
        <fieldset>
          <legend>Datos de la Novia</legend>
          <FormGroup id="nombre_novia" label="Nombre de la Novia" value={matrimonio.nombre_novia} onChange={handleChange} required />
          <FormGroup id="a_pat_novia" label="Apellido Paterno de la Novia" value={matrimonio.a_pat_novia} onChange={handleChange} required />
          <FormGroup id="a_mat_novia" label="Apellido Materno de la Novia" value={matrimonio.a_mat_novia} onChange={handleChange} required />
        </fieldset>
        <br />
        {/* DATOS DEL MATRIMONIO */}
        <fieldset>
          <legend>Datos del Matrimonio</legend>
          <FormGroup id="fecha_matrimonio" label="Fecha del Matrimonio" value={matrimonio.fecha_matrimonio} onChange={handleChange} type="date" required />
          <FormGroup id="libro" label="Libro" value={matrimonio.libro} onChange={handleChange} required />
          <FormGroup id="foja" label="Foja" value={matrimonio.foja} onChange={handleChange} required />
          <FormGroup id="acta" label="Acta" value={matrimonio.acta} onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submit-button">Editar</button>
      </form>
    </div>
  );
}
