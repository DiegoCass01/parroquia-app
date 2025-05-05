import { useState } from "react";
import { FormGroup } from "../../components/FormGroup.jsx";
import { useMatrimonioStore } from "../../store/useMatrimonioStore.js";
import "../../styles/sacramentos/CreateSacramento.css";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useMovimientoStore } from "../../store/useMovimientoStore.js";

export default function CreateMatrimonio({ showSnackbar }) {
  const { user } = useAuthStore();
  const { createMovimiento } = useMovimientoStore();
  const { createMatrimonio } = useMatrimonioStore();

  const [matrimonio, setMatrimonio] = useState({
    nombre_novio: "",
    a_pat_novio: "",
    a_mat_novio: "",
    nombre_novia: "",
    a_pat_novia: "",
    a_mat_novia: "",
    nom_padre_novio: "",
    a_pat_padre_novio: "",
    a_mat_padre_novio: "",
    nom_madre_novio: "",
    a_pat_madre_novio: "",
    a_mat_madre_novio: "",
    nom_padre_novia: "",
    a_pat_padre_novia: "",
    a_mat_padre_novia: "",
    nom_madre_novia: "",
    a_pat_madre_novia: "",
    a_mat_madre_novia: "",
    dir_matrimonio: "",
    lugar_matrimonio: "",
    fecha_matrimonio: "",
    parroco: "",
    asistente: "",
    testigo_nom: "",
    testigo_ap_pat: "",
    testigo_ap_mat: "",
    testigo2_nom: "",
    testigo2_ap_pat: "",
    testigo2_ap_mat: "",
  });

  const handleChange = (e) => {
    setMatrimonio((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createMatrimonio(matrimonio);

      const matrimonioId = response.data.id;

      const nuevoMovimiento = {
        id_sacramento: matrimonioId,
        tipo_sacramento: "matrimonio",
        tipo_movimiento: "registro",
        id_usuario: user.id,
        usuario: user.n_usuario,
        nombre_completo: user.nombre,
        folio: "",
      };

      const res = await createMovimiento(nuevoMovimiento);

      if (response && response.status >= 200 && response.status < 300 && res && res.status >= 200 && res.status < 300) {
        setMatrimonio({
          nombre_novio: "",
          a_pat_novio: "",
          a_mat_novio: "",
          nombre_novia: "",
          a_pat_novia: "",
          a_mat_novia: "",
          nom_padre_novio: "",
          a_pat_padre_novio: "",
          a_mat_padre_novio: "",
          nom_madre_novio: "",
          a_pat_madre_novio: "",
          a_mat_madre_novio: "",
          nom_padre_novia: "",
          a_pat_padre_novia: "",
          a_mat_padre_novia: "",
          nom_madre_novia: "",
          a_pat_madre_novia: "",
          a_mat_madre_novia: "",
          dir_matrimonio: "",
          lugar_matrimonio: "",
          fecha_matrimonio: "",
          parroco: "",
          asistente: "",
          testigo_nom: "",
          testigo_ap_pat: "",
          testigo_ap_mat: "",
          testigo2_nom: "",
          testigo2_ap_pat: "",
          testigo2_ap_mat: "",
        });
        showSnackbar("Matrimonio registrado correctamente!", "success");
      } else {
        showSnackbar("Error al registrar el matrimonio", "error");
        console.error("Error al crear matrimonio:", response?.data || response);
      }
    } catch (error) {
      console.error("Error en la red:", error);
      showSnackbar("Error de red al crear matrimonio", "error");
    }
  };

  return (
    <div className="form-div">
      <h1>Registro de Matrimonios</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {/* DATOS DEL NOVIO */}
        <fieldset>
          <legend>Datos del Novio</legend>
          <FormGroup id="nombre_novio" label="Nombre del Novio" value={matrimonio.nombre_novio} onChange={handleChange} required />
          <FormGroup id="a_pat_novio" label="Apellido Paterno del Novio" value={matrimonio.a_pat_novio} onChange={handleChange} required />
          <FormGroup id="a_mat_novio" label="Apellido Materno del Novio" value={matrimonio.a_mat_novio} onChange={handleChange} required />
          <FormGroup id="nom_padre_novio" label="Nombre del Padre del Novio" value={matrimonio.nom_padre_novio} onChange={handleChange} required />
          <FormGroup id="a_pat_padre_novio" label="Apellido Paterno del Padre del Novio" value={matrimonio.a_pat_padre_novio} onChange={handleChange} required />
          <FormGroup id="a_mat_padre_novio" label="Apellido Materno del Padre del Novio" value={matrimonio.a_mat_padre_novio} onChange={handleChange} required />
          <FormGroup id="nom_madre_novio" label="Nombre de la Madre del Novio" value={matrimonio.nom_madre_novio} onChange={handleChange} required />
          <FormGroup id="a_pat_madre_novio" label="Apellido Paterno de la Madre del Novio" value={matrimonio.a_pat_madre_novio} onChange={handleChange} required />
          <FormGroup id="a_mat_madre_novio" label="Apellido Materno de la Madre del Novio" value={matrimonio.a_mat_madre_novio} onChange={handleChange} required />
        </fieldset>

        <br />

        {/* DATOS DE LA NOVIA */}
        <fieldset>
          <legend>Datos de la Novia</legend>
          <FormGroup id="nombre_novia" label="Nombre de la Novia" value={matrimonio.nombre_novia} onChange={handleChange} required />
          <FormGroup id="a_pat_novia" label="Apellido Paterno de la Novia" value={matrimonio.a_pat_novia} onChange={handleChange} required />
          <FormGroup id="a_mat_novia" label="Apellido Materno de la Novia" value={matrimonio.a_mat_novia} onChange={handleChange} required />
          <FormGroup id="nom_padre_novia" label="Nombre del Padre de la Novia" value={matrimonio.nom_padre_novia} onChange={handleChange} required />
          <FormGroup id="a_pat_padre_novia" label="Apellido Paterno del Padre de la Novia" value={matrimonio.a_pat_padre_novia} onChange={handleChange} required />
          <FormGroup id="a_mat_padre_novia" label="Apellido Materno del Padre de la Novia" value={matrimonio.a_mat_padre_novia} onChange={handleChange} required />
          <FormGroup id="nom_madre_novia" label="Nombre de la Madre de la Novia" value={matrimonio.nom_madre_novia} onChange={handleChange} required />
          <FormGroup id="a_pat_madre_novia" label="Apellido Paterno de la Madre de la Novia" value={matrimonio.a_pat_madre_novia} onChange={handleChange} required />
          <FormGroup id="a_mat_madre_novia" label="Apellido Materno de la Madre de la Novia" value={matrimonio.a_mat_madre_novia} onChange={handleChange} required />
        </fieldset>

        <br />

        {/* DATOS DEL SACRAMENTO */}
        <fieldset>
          <legend>Datos del Matrimonio</legend>
          <FormGroup id="dir_matrimonio" label="Dirección del Matrimonio" value={matrimonio.dir_matrimonio} onChange={handleChange} required />
          <FormGroup id="lugar_matrimonio" label="Lugar del Matrimonio" value={matrimonio.lugar_matrimonio} onChange={handleChange} required />
          <FormGroup id="fecha_matrimonio" label="Fecha del Matrimonio" type="date" value={matrimonio.fecha_matrimonio} onChange={handleChange} required />
          <FormGroup id="parroco" label="Parroco" value={matrimonio.parroco} onChange={handleChange} required />
          <FormGroup id="asistente" label="Asistente" value={matrimonio.asistente} onChange={handleChange} required />
        </fieldset>

        <br />

        {/* DATOS DE LOS TESTIGOS */}
        <fieldset>
          <legend>Datos de los Testigos</legend>
          <FormGroup id="testigo_nom" label="Nombre del Testigo" value={matrimonio.testigo_nom} onChange={handleChange} required />
          <FormGroup id="testigo_ap_pat" label="Apellido Paterno del Testigo" value={matrimonio.testigo_ap_pat} onChange={handleChange} required />
          <FormGroup id="testigo_ap_mat" label="Apellido Materno del Testigo" value={matrimonio.testigo_ap_mat} onChange={handleChange} required />
          <FormGroup id="testigo2_nom" label="Nombre de la Testigo" value={matrimonio.testigo2_nom} onChange={handleChange} required />
          <FormGroup id="testigo2_ap_pat" label="Apellido Paterno de la Testigo" value={matrimonio.testigo2_ap_pat} onChange={handleChange} required />
          <FormGroup id="testigo2_ap_mat" label="Apellido Materno de la Testigo" value={matrimonio.testigo2_ap_mat} onChange={handleChange} required />
        </fieldset>


        <button type="submit" className="submit-button">
          Agregar
        </button>
      </form>
    </div>
  );
}
