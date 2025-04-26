// FeBautizoPDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatoFechaLarga } from "./formatDate"; // usa tu función de formato

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Times-Roman",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    color: "#0706a0",
  },
  section: {
    marginBottom: 10,
  },
  firma: {
    marginTop: 40,
    textAlign: "right",
    marginRight: 20,
  },
  imagen: {
    width: 150,
    margin: "0 auto",
  },
});

const FeBautizoPDF = ({ datos }) => {
  const fechaBautizo = formatoFechaLarga(datos.fecha_bautizo);
  const fechaNac = formatoFechaLarga(datos.fecha_nac);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Image src="/assets/membrete_mejorado.png" style={styles.imagen} />

        <Text style={styles.title}>FE DE BAUTIZO</Text>

        <View style={styles.section}>
          <Text>
            El día {fechaBautizo.dia} de {fechaBautizo.mes} del año{" "}
            {fechaBautizo.anio} fue bautizado(a) en esta Parroquia por el{" "}
            {datos.parroco}, un(a) niño(a) a quien se le puso por nombre:
          </Text>
          <Text>
            {datos.nombre} {datos.a_paterno} {datos.a_materno}
          </Text>
        </View>

        <View style={styles.section}>
          <Text>Nació en {datos.lugar_nac}</Text>
          <Text>
            El día {fechaNac.dia} de {fechaNac.mes} del año {fechaNac.anio}
          </Text>
          <Text>
            Hijo(a) de {datos.nom_padre} {datos.a_pat_padre} {datos.a_mat_padre}
          </Text>
          <Text>
            y de {datos.nom_madre} {datos.a_pat_madre} {datos.a_mat_madre}
          </Text>
          <Text>
            Fueron padrinos {datos.pad_nom} {datos.pad_ap_pat}{" "}
            {datos.pad_ap_mat} y {datos.mad_nom} {datos.mad_ap_pat}{" "}
            {datos.mad_ap_mat}
          </Text>
        </View>

        <View style={styles.firma}>
          <Text>No {datos.folio || "_____"}</Text>
          <Text>_________________________</Text>
          <Text>El Párroco</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FeBautizoPDF;
