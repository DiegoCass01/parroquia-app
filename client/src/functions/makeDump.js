const generarMySQLDump = (datos) => {
  const dump = [];

  // Encabezado del MySQL dump
  dump.push("-- MySQL dump");
  dump.push("-- ------------------------------------------------------");
  dump.push("DROP TABLE IF EXISTS `bautismos`;");
  dump.push("CREATE TABLE `bautismos` (");
  dump.push("  `id` int NOT NULL AUTO_INCREMENT,");
  dump.push("  `nombre` varchar(255) NOT NULL,");
  dump.push("  `fecha_bautismo` date NOT NULL,");
  dump.push("  `lugar_bautismo` varchar(255) NOT NULL,");
  dump.push("  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,");
  dump.push("  `lugar_nacimiento` varchar(255) NOT NULL,");
  dump.push("  `fecha_nacimiento` date NOT NULL,");
  dump.push("  `padre` varchar(255) NOT NULL,");
  dump.push("  `madre` varchar(255) NOT NULL,");
  dump.push("  `padrino` varchar(255) NOT NULL,");
  dump.push("  `madrina` varchar(255) NOT NULL,");
  dump.push("  PRIMARY KEY (`id`)");
  dump.push(
    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  );
  dump.push("");
  dump.push("-- Dumping data for table `bautismos`");
  dump.push("INSERT INTO `bautismos` VALUES");

  // Generar los valores de inserción para cada registro
  datos.forEach((bautismo, index) => {
    const fecha_bautismo = new Date(bautismo.fecha_bautismo)
      .toISOString()
      .split("T")[0];
    const fecha_registro =
      new Date(bautismo.fecha_registro).toISOString().split("T")[0] +
      " " +
      new Date(bautismo.fecha_registro).toISOString().split("T")[1].slice(0, 8); // Mantener hora, minuto y segundo
    const fecha_nacimiento = new Date(bautismo.fecha_nacimiento)
      .toISOString()
      .split("T")[0];

    dump.push(
      `(${bautismo.id},'${bautismo.nombre}','${fecha_bautismo}','${
        bautismo.lugar_bautismo
      }','${fecha_registro}','${
        bautismo.lugar_nacimiento
      }','${fecha_nacimiento}','${bautismo.padre}','${bautismo.madre}','${
        bautismo.padrino
      }','${bautismo.madrina}')${index < datos.length - 1 ? "," : ";"}`
    );
  });

  return dump.join("\n");
};

export { generarMySQLDump };
