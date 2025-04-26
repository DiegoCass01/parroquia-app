import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const SacramentoButtons = ({ handleDelete, handleEdit, tipo, pdfComponent }) => {
  const { user } = useAuthStore();
  return (
    <section className="sacramento-buttons">
      {handleEdit && (<button onClick={handleEdit} className="submit-button-edit">
        Editar {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </button>)}
      {pdfComponent && ({ pdfComponent })}
      {handleDelete && (user.rol === "admin" || user.rol === "moderador") && (<button onClick={handleDelete} className="submit-button-delete">Eliminar</button>)}
    </section>
  );
};

export default SacramentoButtons;