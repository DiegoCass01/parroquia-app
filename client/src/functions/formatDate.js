const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatDateLong = (date) => {
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

export { formatDate, formatDateLong };
