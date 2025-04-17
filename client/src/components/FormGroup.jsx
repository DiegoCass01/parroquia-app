import React from "react";
import "../styles/FormGroup.css"; // Asegúrate de que la ruta sea correcta

const FormGroup = ({ id, label, value, onChange, type = "text", required = false, placeholder, options = [] }) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="label">{label}</label>
      {type !== "select" &&
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="input"
          required={required}
          min={type === "date" ? "1900-01-01" : undefined} // Solo para tipo fecha
          max={type === "date" ? new Date().toISOString().split("T")[0] : undefined} // Solo para tipo fecha
          placeholder={placeholder}
        />
      }
      {type === "select" &&
        <select id={id} value={value} onChange={onChange} required className="input">
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
      }
    </div >
  );
};

export { FormGroup };
