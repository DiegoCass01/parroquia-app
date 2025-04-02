import React from "react";
import "../App.css"

const FormGroup = ({ id, label, value, onChange, type = "text", required = false }) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="input"
        required={required}
        min={type === "date" ? "1900-01-01" : undefined} // Solo para tipo fecha
        max={type === "date" ? new Date().toISOString().split("T")[0] : undefined} // Solo para tipo fecha
      />
    </div>
  );
};

export { FormGroup };
