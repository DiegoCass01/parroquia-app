import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // engranaje
import { useAuthStore } from "../store/useAuthStore";


const SacramentoButtons = ({ handleDelete, handleEdit, tipo, pdfComponent }) => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-sacramento" ref={menuRef}>


      <button className="menu-icon" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      {open && (

        <div className="dropdown-content">

          {handleEdit && (
            <a className="dropdown-item" onClick={handleEdit}>
              Editar {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </a>

          )}

          {pdfComponent && pdfComponent}

          {handleDelete && (user.rol === "admin" || user.rol === "moderador") && (
            <a className="dropdown-item delete" onClick={handleDelete}>
              Eliminar

            </a>

          )}
        </div>


      )
      }
    </div >
  );
};

export default SacramentoButtons;
