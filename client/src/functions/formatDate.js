const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatDateLong = (date) => {
  if (date === null || date === "") return "Fecha no disponible";

  if (!(date instanceof Date)) {
    date = new Date(date); // Convertir a Date si es una cadena
  }

  if (isNaN(date)) {
    return "Fecha inválida"; // Manejar fechas incorrectas
  }

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();

  return `${dia} de ${mes} de ${anio}`;
};

const formatoFechaLarga = (fechaStr) => {
  const fecha = new Date(fechaStr);
  const dia = fecha.getDate();
  const mes = fecha.toLocaleString("es-MX", { month: "long" });
  const anio = fecha.getFullYear();

  return { dia, mes, anio };
};

export { formatDate, formatDateLong, formatoFechaLarga };
