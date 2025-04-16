import "../styles/AdminValidationModal.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminValidationModal({
  admin,
  setAdmin,
  onValidate,
  onCancel
}) {

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onCancel();
      setAdmin({ adminName: "", adminPassword: "" });
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">

        {/* Botón X */}
        <button className="close-button" onClick={() => {
          onCancel();
          setAdmin({ adminName: "", adminPassword: "" });
        }}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h2>Credenciales Admin</h2>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={admin.adminName}
          onChange={(e) =>
            setAdmin((prev) => ({ ...prev, adminName: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={admin.adminPassword}
          onChange={(e) =>
            setAdmin((prev) => ({ ...prev, adminPassword: e.target.value }))
          }
        />

        <section className="buttons-modal">
          <button onClick={onValidate} className="validate" >Validar</button>
          <button
            onClick={() => {
              onCancel();
              setAdmin({ adminName: "", adminPassword: "" });
            }} className="close"
          >
            Cancelar
          </button>
        </section>
      </div>
    </div>
  );
}
