// src/components/AdminValidationModal.jsx
export default function AdminValidationModal({
  admin,
  setAdmin,
  onValidate,
  onCancel
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Validar Admin</h2>
        <input
          required
          id="adminName"
          type="text"
          placeholder="Nombre de Admin"
          value={admin.adminName}
          onChange={(e) =>
            setAdmin((prev) => ({ ...prev, adminName: e.target.value }))
          }
        />
        <input
          required
          id="adminPassword"
          type="password"
          placeholder="Contraseña de Admin"
          value={admin.adminPassword}
          onChange={(e) =>
            setAdmin((prev) => ({ ...prev, adminPassword: e.target.value }))
          }
        />
        <section className="buttons-modal">
          <button onClick={onValidate}>Validar</button>
          <button
            onClick={() => {
              onCancel();
              setAdmin({ adminName: "", adminPassword: "" });
            }}
          >
            Cancelar
          </button>
        </section>
      </div>
    </div>
  );
}
