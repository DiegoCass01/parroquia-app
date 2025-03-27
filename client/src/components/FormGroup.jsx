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
      />
    </div>
  );
};

export { FormGroup };
