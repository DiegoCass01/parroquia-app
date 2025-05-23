import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todos los matrimonios
router.get("/", verifyToken, (req, res) => {
  const search = req.query.search || "";
  const year = req.query.year || "";

  let query = `
    SELECT 
      m.*,
      t.pad_nom AS testigo_nom, t.pad_ap_pat AS testigo_ap_pat, t.pad_ap_mat AS testigo_ap_mat,
      t.mad_nom AS testigo2_nom, t.mad_ap_pat AS testigo2_ap_pat, t.mad_ap_mat AS testigo2_ap_mat
    FROM matrimonio m
    LEFT JOIN padrinos t
      ON m.id_matrimonio = t.id_sacramento 
      AND t.tipo_sacramento = 'matrimonio'
      AND t.tipo_pad = 'testigos'
   WHERE CONCAT_WS(' ',
      m.nombre_novio, m.a_pat_novio, m.a_mat_novio,
      m.nombre_novia, m.a_pat_novia, m.a_mat_novia
    ) LIKE ?`;

  const values = [`%${search}%`];

  if (year !== "") {
    query += " AND YEAR(m.fecha_matrimonio) = ?";
    values.push(year);
  }

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Error al obtener matrimonios:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo matrimonio
router.post("/", verifyToken, (req, res) => {
  const {
    nombre_novio,
    a_pat_novio,
    a_mat_novio,
    nombre_novia,
    a_pat_novia,
    a_mat_novia,
    nom_padre_novio,
    a_pat_padre_novio,
    a_mat_padre_novio,
    nom_madre_novio,
    a_pat_madre_novio,
    a_mat_madre_novio,
    nom_padre_novia,
    a_pat_padre_novia,
    a_mat_padre_novia,
    nom_madre_novia,
    a_pat_madre_novia,
    a_mat_madre_novia,
    dir_matrimonio,
    lugar_matrimonio,
    fecha_matrimonio,
    parroco,
    asistente,
    testigo_nom,
    testigo_ap_pat,
    testigo_ap_mat,
    testigo2_nom,
    testigo2_ap_pat,
    testigo2_ap_mat,
  } = req.body;

  const queryMatrimonio = `
    INSERT INTO matrimonio (
  nombre_novio,
  a_pat_novio,
  a_mat_novio,
  nombre_novia,
  a_pat_novia,
  a_mat_novia,
  nom_padre_novio,
  a_pat_padre_novio,
  a_mat_padre_novio,
  nom_madre_novio,
  a_pat_madre_novio,
  a_mat_madre_novio,
  nom_padre_novia,
  a_pat_padre_novia,
  a_mat_padre_novia,
  nom_madre_novia,
  a_pat_madre_novia,
  a_mat_madre_novia,
  dir_matrimonio,
  lugar_matrimonio,
  fecha_matrimonio,
  parroco,
  asistente
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    queryMatrimonio,
    [
      nombre_novio,
      a_pat_novio,
      a_mat_novio,
      nombre_novia,
      a_pat_novia,
      a_mat_novia,
      nom_padre_novio,
      a_pat_padre_novio,
      a_mat_padre_novio,
      nom_madre_novio,
      a_pat_madre_novio,
      a_mat_madre_novio,
      nom_padre_novia,
      a_pat_padre_novia,
      a_mat_padre_novia,
      nom_madre_novia,
      a_pat_madre_novia,
      a_mat_madre_novia,
      dir_matrimonio,
      lugar_matrimonio,
      fecha_matrimonio,
      parroco,
      asistente,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el matrimonio:", err);
        res.status(500).json({ error: "Error al crear el matrimonio" });
      }

      const matrimonioId = results.insertId;

      const insertPadrinosQuery = `
        INSERT INTO padrinos (
          id_sacramento, tipo_sacramento,
          pad_nom, pad_ap_pat, pad_ap_mat,
          mad_nom, mad_ap_pat, mad_ap_mat,
          tipo_pad
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      pool.query(
        insertPadrinosQuery,
        [
          matrimonioId,
          "matrimonio",
          testigo_nom,
          testigo_ap_pat,
          testigo_ap_mat,
          testigo2_nom,
          testigo2_ap_pat,
          testigo2_ap_mat,
          "testigos",
        ],
        (err3) => {
          if (err3) {
            console.error("Error al insertar testigos:", err2);
            // No se hace rollback, solo se notifica
          }
        }
      );

      res.status(201).json({
        message: "Matrimonio creado correctamente",
        id: matrimonioId,
      });
    }
  );
});

// Actualizar un matrimonio
router.put("/:id_matrimonio", verifyToken, (req, res) => {
  const { id_matrimonio } = req.params;
  const {
    nombre_novio,
    a_pat_novio,
    a_mat_novio,
    nombre_novia,
    a_pat_novia,
    a_mat_novia,
    nom_padre_novio,
    a_pat_padre_novio,
    a_mat_padre_novio,
    nom_madre_novio,
    a_pat_madre_novio,
    a_mat_madre_novio,
    nom_padre_novia,
    a_pat_padre_novia,
    a_mat_padre_novia,
    nom_madre_novia,
    a_pat_madre_novia,
    a_mat_madre_novia,
    dir_matrimonio,
    lugar_matrimonio,
    fecha_matrimonio,
    parroco,
    asistente,
    testigo_nom,
    testigo_ap_pat,
    testigo_ap_mat,
    testigo2_nom,
    testigo2_ap_pat,
    testigo2_ap_mat,
  } = req.body;

  const updateMatrimonioQuery = `
    UPDATE matrimonio SET
      nombre_novio = ?, a_pat_novio = ?, a_mat_novio = ?,
      nombre_novia = ?, a_pat_novia = ?, a_mat_novia = ?,
      nom_padre_novio = ?, a_pat_padre_novio = ?, a_mat_padre_novio = ?,
      nom_madre_novio = ?, a_pat_madre_novio = ?, a_mat_madre_novio = ?,
      nom_padre_novia = ?, a_pat_padre_novia = ?, a_mat_padre_novia = ?,
      nom_madre_novia = ?, a_pat_madre_novia = ?, a_mat_madre_novia = ?,
      dir_matrimonio = ?, lugar_matrimonio = ?, fecha_matrimonio = ?,
      parroco = ?, asistente = ?
    WHERE id_matrimonio = ?
  `;

  pool.query(
    updateMatrimonioQuery,
    [
      nombre_novio,
      a_pat_novio,
      a_mat_novio,
      nombre_novia,
      a_pat_novia,
      a_mat_novia,
      nom_padre_novio,
      a_pat_padre_novio,
      a_mat_padre_novio,
      nom_madre_novio,
      a_pat_madre_novio,
      a_mat_madre_novio,
      nom_padre_novia,
      a_pat_padre_novia,
      a_mat_padre_novia,
      nom_madre_novia,
      a_pat_madre_novia,
      a_mat_madre_novia,
      dir_matrimonio,
      lugar_matrimonio,
      fecha_matrimonio,
      parroco,
      asistente,
      id_matrimonio,
    ],
    (err) => {
      if (err) {
        console.error("Error al actualizar el matrimonio:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar el matrimonio" });
      }

      // Actualizar padrinos
      const updatePadrinosQuery = `
        UPDATE padrinos SET
          pad_nom = ?, pad_ap_pat = ?, pad_ap_mat = ?,
          mad_nom = ?, mad_ap_pat = ?, mad_ap_mat = ?
        WHERE id_sacramento = ? AND tipo_sacramento = 'matrimonio' AND tipo_pad = 'padrinos'
      `;

      // Actualizar testigos
      const updateTestigosQuery = `
            UPDATE padrinos SET
              pad_nom = ?, pad_ap_pat = ?, pad_ap_mat = ?,
              mad_nom = ?, mad_ap_pat = ?, mad_ap_mat = ?
            WHERE id_sacramento = ? AND tipo_sacramento = 'matrimonio' AND tipo_pad = 'testigos'
          `;

      pool.query(
        updateTestigosQuery,
        [
          testigo_nom,
          testigo_ap_pat,
          testigo_ap_mat,
          testigo2_nom,
          testigo2_ap_pat,
          testigo2_ap_mat,
          id_matrimonio,
        ],
        (err3) => {
          if (err3) {
            console.error("Error al actualizar testigos:", err3);
            return res
              .status(500)
              .json({ error: "Error al actualizar los testigos" });
          }

          res.status(200).json({
            message:
              "Matrimonio, padrinos y testigos actualizados correctamente",
          });
        }
      );
    }
  );
});

// Eliminar un matrimonio
router.delete("/:id_matrimonio", verifyToken, (req, res) => {
  const { id_matrimonio } = req.params;

  // Primero eliminamos los padrinos (tipo_pad = 'padrinos' o 'testigos') relacionados
  const deletePadrinosQuery = `
    DELETE FROM padrinos WHERE id_sacramento = ? AND tipo_sacramento = 'matrimonio'
  `;

  pool.query(deletePadrinosQuery, [id_matrimonio], (err1, results1) => {
    if (err1) {
      console.error("Error al eliminar padrinos/testigos:", err1);
      return res
        .status(500)
        .json({ error: "Error al eliminar los padrinos o testigos" });
    }

    // Luego eliminamos el matrimonio
    const deleteMatrimonioQuery = `
      DELETE FROM matrimonio WHERE id_matrimonio = ?
    `;

    pool.query(deleteMatrimonioQuery, [id_matrimonio], (err2, results2) => {
      if (err2) {
        console.error("Error al eliminar el matrimonio:", err2);
        return res
          .status(500)
          .json({ error: "Error al eliminar el matrimonio" });
      }

      if (results2.affectedRows > 0) {
        res.json({
          message: "Matrimonio y padrinos/testigos eliminados correctamente",
        });
      } else {
        res.status(404).json({ error: "Matrimonio no encontrado" });
      }
    });
  });
});

export { router as routerMatrimonios };
