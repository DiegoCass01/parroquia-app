import jsPDF from "jspdf";
import { formatDate } from "./formatDate.js";

const generarPDF = ({ datos }) => {
  const doc = new jsPDF();

  // Crear un objeto de imagen y cargarla
  var img = new Image();
  img.src = "/assets/iglesiaLogo.png"; // Asegúrate de que esta ruta sea correcta

  img.onload = () => {
    // Cuando la imagen se haya cargado, agregarla al PDF

    // Agregar logo
    doc.addImage(img, "PNG", 10, 10, 50, 50);

    // Título principal
    doc.setFontSize(24);
    doc.text("FE DE BAUTIZO", 105, 70, { align: "center" });

    // Subtítulo
    doc.setFontSize(16);
    doc.text(`Parroquia Nuestra Señora de Guadalupe`, 105, 90, {
      align: "center",
    });

    // Detalles del bautizo
    doc.setFontSize(12);
    doc.text(`Nombre del Niño: ${datos.nombre}`, 20, 120);
    // Usar esta función en los textos donde se necesita la fecha
    doc.text(`Fecha del Bautizo: ${formatDate(datos.fecha_bautizo)}`, 20, 150);

    // Firmas
    doc.text("Firma del Padre:", 20, 170);
    doc.text("Firma del Sacerdote:", 20, 180);

    // Línea para firmas
    doc.line(20, 172, 180, 172);
    doc.line(20, 182, 180, 182);

    // Agregar el texto final
    doc.setFontSize(10);
    doc.text(
      "Este es un documento oficial que certifica el bautizo de este niño en la iglesia mencionada.",
      20,
      200,
      { maxWidth: 180 }
    );

    // Para mostrar en lugar de descargar:
    // doc.open('fe_de_bautizo.pdf');

    // Descargar el PDF
    doc.save(`fe_de_bautizo_${datos.nombre}.pdf`);
  };
  img.onerror = (err) => {
    console.error("Error al cargar la imagen:", err);
    alert("No se pudo cargar la imagen, por favor verifica la ruta.");
  };
};

export { generarPDF };
