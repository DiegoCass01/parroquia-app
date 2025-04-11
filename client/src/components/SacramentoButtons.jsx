import React from 'react';

const SacramentoButtons = ({ handleDelete, generarPDF, handleEdit, tipo }) => {
  return (
    <section className="sacramento-buttons">
      <button onClick={handleDelete} className="submit-button-delete">Eliminar</button>
      <button onClick={generarPDF} className="submit-button" >
        Generar Fe de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </button>
      <button onClick={handleEdit} className="submit-button-edit">
        Editar {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </button>
    </section>
  );
};

export default SacramentoButtons;