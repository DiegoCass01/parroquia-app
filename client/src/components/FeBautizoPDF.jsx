import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { formatoFechaLarga } from "../functions/formatDate"; // usa tu función de formato

// Registrar una fuente similar a Arial (Open Sans)
Font.register({
  family: "Open Sans",
  src: "https://fonts.gstatic.com/s/opensans/v28/mem8YaGs126MiZpBA-U1UpcaXcl0Aw.ttf",
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 70,
    fontSize: 15,
    fontFamily: "Times-Roman",
    textAlign: "justify",
    color: '#0706a0',
    position: "relative",
  },
  watermarkContainer: {
    position: "absolute",
    top: 150, // Ajusta esta propiedad con un valor en px o em
    left: 160, // Ajusta el valor según lo necesites
    opacity: 0.1, // Marca de agua sutil
    zIndex: 0,
  },
  watermark: {
    width: 300, // Tamaño ajustable en px
    height: "auto", // Mantiene la relación de aspecto de la imagen
  },
  headerImage: {
    width: 420,
    height: "auto",
    marginBottom: 15,
    alignSelf: "center",
  },
  sideTexts: {
    marginBottom: 30,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 1.5,
    fontFamily: "Times-Roman",
    fontStyle: "italic",
    color: "#0706a0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnText: {
    width: "33%", // Cada frase ocupa un tercio de la hoja
    textAlign: "center",
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    family: "Open Sans",
  },
  section: {
    marginBottom: 15,
    paddingHorizontal: 10,
    lineHeight: 2,
  },
  paragraph: {
    marginVertical: 10,
  },
  boldText: {
    fontFamily: "Times-Bold",
    textDecoration: "underline",
  },
  footer: {
    marginTop: 5,
    textAlign: "left",
    fontFamily: 'Helvetica'
  },
  signatureContainer: {
    marginTop: 100,
    alignItems: "flex-end", // Empuja todo a la derecha
  },
  signatureLine: {
    width: "50%", // O el ancho que quieras de la firma
    borderTop: "1px solid #0706a0", // Línea en lugar de puro texto
    marginBottom: 5,
  },
  signatureText: {
    textAlign: "center",
    width: "50%", // Igual que la línea para que estén alineados
  },
  firstLineIndent: {
    textIndent: 40, // Sangría solo para la primera línea
  },


});

const FeBautizoPDF = ({ datos }) => {
  const fechaBautizo = formatoFechaLarga(datos.fecha_bautizo);
  const fechaNac = formatoFechaLarga(datos.fecha_nac);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Marca de agua */}
        <View fixed style={styles.watermarkContainer}>
          <Image src="/assets/marca-agua.png" style={styles.watermark} />
        </View>

        <View style={{ zIndex: 1 }}>
          <Text style={styles.title}>DIÓCESIS DE TAMPICO, A.R.</Text>
          <Image src="/assets/membrete.png" style={styles.headerImage} />

          {/* Frases del lado derecho */}
          <View style={styles.sideTexts}>
            <Text style={styles.columnText}>
              El Bautismo nos hace{"\n"}Hijos de Dios
            </Text>
            <Text style={styles.columnText}>
              El Bautismo nos hace{"\n"}miembros de la Iglesia
            </Text>
            <Text style={styles.columnText}>
              El Bautismo nos da{"\n"}derecho a la vida eterna
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              <Text style={styles.firstLineIndent}>El día{" "}</Text><Text style={styles.boldText}>{"   "}{fechaBautizo.dia}{"   "}</Text>{" "}de{" "}
              <Text style={styles.boldText}>{"            "}{fechaBautizo.mes}{"            "}</Text>{" "}del año{" "}
              <Text style={styles.boldText}>{"    "}{fechaBautizo.anio}{"     "}</Text>{" "}fue bautizado(a){" "}
              en esta Parroquia por el{" "}<Text style={styles.boldText}>{"     "}{datos.parroco}{"     "}</Text>{" "}
              un(a) niño(a) que recibió el nombre de:
            </Text>
            <Text style={{ ...styles.paragraph, textAlign: "center", fontSize: 14 }}>
              <Text style={styles.boldText}>&nbsp;{"     "}{datos.nombre} {datos.a_paterno} {datos.a_materno}{"     "}&nbsp;</Text>
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              <Text style={styles.firstLineIndent}>Nació en{" "}</Text><Text style={styles.boldText}>{"             "}{datos.lugar_nac}{"             "}</Text>{" "}
              el día{" "}<Text style={styles.boldText}>&nbsp;{"   "}{fechaNac.dia}{"   "}&nbsp;</Text>{" "}de{" "}
              <Text style={styles.boldText}>&nbsp;{"          "}{fechaNac.mes}{"          "}&nbsp;</Text>{" "}del año{" "}
              <Text style={styles.boldText}>{"    "}{fechaNac.anio}{"    "}</Text>{" "}
              hijo(a) de{" "}<Text style={styles.boldText}>&nbsp;{"          "}{datos.nom_padre} {datos.a_pat_padre} {datos.a_mat_padre}{"          "}&nbsp;</Text>{" "}
              y de{" "}<Text style={styles.boldText}>&nbsp;{"          "}{datos.nom_madre} {datos.a_pat_madre} {datos.a_mat_madre}{"          "}&nbsp;</Text>
              {" "}fueron Padrinos <Text style={styles.boldText}>&nbsp;{"          "}{datos.pad_nom} {datos.pad_ap_pat} {datos.pad_ap_mat}{"          "}&nbsp;</Text>
              {" "}y{" "}<Text style={styles.boldText}>&nbsp;{"          "}{datos.mad_nom} {datos.mad_ap_pat} {datos.mad_ap_mat}{"          "}&nbsp;</Text>.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.boldText.fontFamily}>Nº {datos.folio || "_____"}</Text>
          </View>

          <View style={styles.signatureContainer}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>{"El Párroco"}</Text>
          </View>

        </View>
      </Page>
    </Document >
  );
};

export { FeBautizoPDF };

