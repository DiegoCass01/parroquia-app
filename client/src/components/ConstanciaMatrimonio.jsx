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
import { formatoFechaLarga } from "../functions/formatDate";

Font.register({
  family: "Great Vibes",
  src: "/assets/fonts/GreatVibes-Regular.ttf",
});


const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 60,
    fontSize: 15,
    fontFamily: "Times-Roman",
    textAlign: "justify",
    color: "#000",
    position: "relative",
  },
  logo: {
    width: 450,
    height: "auto",
    marginBottom: 30,
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "Great Vibes",
    textAlign: "center",
    color: "#0706a0",
  },
  text: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    marginBottom: 20,
    textAlign: "justify",
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 1.8,
    textAlign: "justify",
  },
  boldText: {
    fontFamily: "Times-Bold",
    textDecoration: "underline",
  },
  firmaContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firmaBox: {
    width: "30%",
    alignItems: "center",
  },
  firmaLine: {
    borderTop: "1px solid #000",
    width: "100%",
    marginBottom: 5,
  },
  centeredTextBlock: {
    paddingHorizontal: 40, // Ajusta según el espacio deseado
  },

});

const ConstanciaMatrimonio = ({ matrimonio }) => {
  const fecha = formatoFechaLarga(matrimonio.fecha_matrimonio);
  const fullName = (n, p, m) => `${n} ${p} ${m}`.trim();

  const novio = fullName(matrimonio.nombre_novio, matrimonio.a_pat_novio, matrimonio.a_mat_novio);
  const novia = fullName(matrimonio.nombre_novia, matrimonio.a_pat_novia, matrimonio.a_mat_novia);

  // const padre_novio = fullName(matrimonio.nom_padre_novio, matrimonio.a_pat_padre_novio, matrimonio.a_mat_padre_novio);
  // const madre_novio = fullName(matrimonio.nom_madre_novio, matrimonio.a_pat_madre_novio, matrimonio.a_mat_madre_novio);

  // const padre_novia = fullName(matrimonio.nom_padre_novia, matrimonio.a_pat_padre_novia, matrimonio.a_mat_padre_novia);
  // const madre_novia = fullName(matrimonio.nom_madre_novia, matrimonio.a_pat_madre_novia, matrimonio.a_mat_madre_novia);

  // const padrino = fullName(matrimonio.pad_nom, matrimonio.pad_ap_pat, matrimonio.pad_ap_mat);
  // const madrina = fullName(matrimonio.mad_nom, matrimonio.mad_ap_pat, matrimonio.mad_ap_mat);

  // const testigo1 = fullName(matrimonio.testigo_nom, matrimonio.testigo_ap_pat, matrimonio.testigo_ap_mat);
  // const testigo2 = fullName(matrimonio.testigo2_nom, matrimonio.testigo2_ap_pat, matrimonio.testigo2_ap_mat);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        <Image src="/assets/membrete.png" style={styles.logo} />

        <View style={styles.titleContainer}>

          <Text style={styles.title}>Constancia de Matrimonio</Text>

        </View>


        <View style={styles.text}>
          <Text style={{ ...styles.paragraph, ...styles.centeredTextBlock }}>
            Hoy <Text style={styles.boldText}>{"        "}{fecha.dia}{"       "}</Text> de <Text style={styles.boldText}>{"           "}{fecha.mes}{"            "}</Text> de <Text style={styles.boldText}>{"        "}{fecha.anio}{"       "}</Text>{"\n"}

          </Text>
          <Text style={{ ...styles.paragraph, ...styles.centeredTextBlock }}>
            Contrajeron matrimonio canónico:
          </Text>
          <Text style={{ ...styles.paragraph, ...styles.centeredTextBlock }}>
            <Text style={styles.boldText}>&nbsp;{"        "}{novio}{"        "}&nbsp;</Text>{" "}y{" "}
            <Text style={styles.boldText}>&nbsp;{"        "}{novia}{"        "}&nbsp;</Text>
          </Text>

          <Text style={styles.paragraph}>
            Asistió al matrimonio <Text style={styles.boldText}>{matrimonio.parroco || "párroco correspondiente"}</Text>, en la Parroquia de Nuestra Señora de Guadalupe, de Ciudad Mante, Tamaulipas.
          </Text>
        </View>

        <View style={styles.firmaContainer}>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLine} />
            <Text>ESPOSO</Text>
          </View>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLine} />
            <Text>ESPOSA</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 30, marginBottom: 5 }}>
          <Text>TESTIGOS</Text>
        </View>


        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 40 }}>
          <View style={{ width: "30%", borderTop: "1px solid #000" }} />
          <View style={{ width: "30%", borderTop: "1px solid #000" }} />
        </View>

        <View style={styles.firmaContainer}>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLine} />
            <Text>ASISTENTE</Text>
          </View>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLine} />
            <Text>PÁRROCO</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export { ConstanciaMatrimonio };
