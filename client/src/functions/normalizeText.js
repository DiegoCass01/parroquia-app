// functions/normalizeText.js

export const normalizeText = (text) =>
  text
    .normalize("NFD") // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .toLowerCase();
