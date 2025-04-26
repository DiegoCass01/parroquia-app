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
    fontSize: 14,
    fontFamily: "Times-Roman",
    textAlign: "justify",
    color: '#0706a0'
  },
  headerImage: {
    width: 400,
    height: "auto",
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    family: "Open Sans",
  },
  section: {
    marginBottom: 15,
    paddingHorizontal: 10,
    lineHeight: 1.8,
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
  signatureLine: {
    marginTop: 60,
    textAlign: "center",
  },
  signatureText: {
    marginTop: 5,
    textAlign: "center",
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
        <Text style={styles.title}>DIÓCESIS DE TAMPICO, A.R.</Text>

        <Image src="/assets/membrete.png" style={styles.headerImage} />


        <View style={styles.section}>
          <Text style={styles.paragraph}>
            <Text style={styles.firstLineIndent}>El día{" "}</Text><Text style={styles.boldText}>{"   "}{fechaBautizo.dia}{"   "}</Text>{" "}de{" "}
            <Text style={styles.boldText}>{"            "}{fechaBautizo.mes}{"            "}</Text>{" "}del año{" "}
            <Text style={styles.boldText}>{"    "}{fechaBautizo.anio}{"     "}</Text>{" "}fue bautizado(a){"\n"}
            en esta Parroquia por el{" "}<Text style={styles.boldText}>{"     "}{datos.parroco}{"     "}</Text>{"\n"}
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
            <Text style={styles.boldText}>{"            "}{"   "}{fechaNac.mes}{"            "}{"   "}</Text>{" "}del año{" "}
            <Text style={styles.boldText}>{"    "}{fechaNac.anio}{"    "}.</Text>{"\n"}
            hijo(a) de{" "}<Text style={styles.boldText}>&nbsp;{"                   "}{datos.nom_padre} {datos.a_pat_padre} {datos.a_mat_padre}{"                   "}&nbsp;</Text>{" "}
            y de{" "}<Text style={styles.boldText}>&nbsp;{"                     "}{datos.nom_madre} {datos.a_pat_madre} {datos.a_mat_madre}{"                     "}&nbsp;</Text>.
            {"\n"}fueron Padrinos <Text style={styles.boldText}>&nbsp;{"                     "}{datos.pad_nom} {datos.pad_ap_pat} {datos.pad_ap_mat}{"                     "}&nbsp;</Text>
            {" "}y{" "}<Text style={styles.boldText}>&nbsp;{"                     "}{datos.mad_nom} {datos.mad_ap_pat} {datos.mad_ap_mat}{"                     "}&nbsp;</Text>.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.boldText.fontFamily}>Nº {datos.folio || "_____"}</Text>
        </View>

        <View style={styles.signatureLine}>
          <Text>_____________________________</Text>
          <Text style={styles.signatureText}>El Párroco</Text>
        </View>
      </Page>
    </Document >
  );
};

export { FeBautizoPDF };

