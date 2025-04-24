import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todas las comuniones con padrinos
router.get("/", verifyToken, (req, res) => {
  const search = req.query.search || "";
  const year = req.query.year || ""; // filtro

  const query = `
    SELECT 
      c.*, 
      p.pad_nom, p.pad_ap_pat, p.pad_ap_mat,
      p.mad_nom, p.mad_ap_pat, p.mad_ap_mat
    FROM comunion c
    LEFT JOIN padrinos p ON c.id_comunion = p.id_sacramento AND p.tipo_sacramento = 'comunion'
      WHERE CONCAT_WS(' ',
      c.nombre, c.a_paterno, c.a_materno
    ) LIKE ?`;

  const values = [`%${search}%`];

  if (year !== "") {
    query += " AND YEAR(b.fecha_comunion) = ?";
    values.push(year);
  }

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Error al obtener comuniones:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear una nueva comunión con padrinos
router.post("/", verifyToken, (req, res) => {
  const {
    nombre,
    a_paterno,
    a_materno,
    fecha_nac,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    parroquia_bautizo,
    dir_comunion,
    lugar_comunion,
    fecha_comunion,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  } = req.body;

  const insertComunQuery = `
    INSERT INTO comunion (
      nombre, a_paterno, a_materno, nom_padre,
      nom_padre, a_pat_padre, a_mat_padre,
      nom_madre, a_pat_madre, a_mat_madre,
      parroquia_bautizo,
      dir_comunion, lugar_comunion, 
      fecha_comunion, parroco
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    insertComunQuery,
    [
      nombre,
      a_paterno,
      a_materno,
      fecha_nac,
      nom_padre,
      a_pat_padre,
      a_mat_padre,
      nom_madre,
      a_pat_madre,
      a_mat_madre,
      parroquia_bautizo,
      dir_comunion,
      lugar_comunion,
      fecha_comunion,
      parroco,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear la comunión:", err);
        return res.status(500).json({ error: "Error al crear la comunión" });
      }

      const comunionId = results.insertId;

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
          comunionId,
          "comunion",
          pad_nom,
          pad_ap_pat,
          pad_ap_mat,
          mad_nom,
          mad_ap_pat,
          mad_ap_mat,
          "general",
        ],
        (err2) => {
          if (err2) {
            console.error("Error al insertar padrinos:", err2);
            // No se hace rollback, solo se notifica
          }
        }
      );

      res.status(201).json({
        message: "Comunión creada correctamente",
        id: comunionId,
      });
    }
  );
});

// Actualizar una comunión y sus padrinos
router.put("/:id_comunion", verifyToken, (req, res) => {
  const { id_comunion } = req.params;
  const {
    nombre,
    a_paterno,
    a_materno,
    fecha_nac,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    parroquia_bautizo,
    dir_comunion,
    lugar_comunion,
    fecha_comunion,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  } = req.body;

  const updateComunQuery = `
    UPDATE comunion SET
      nombre = ?, a_paterno = ?, a_materno = ?, fecha_nac = ?,
      nom_padre = ?, a_pat_padre = ?, a_mat_padre = ?,
      nom_madre = ?, a_pat_madre = ?, a_mat_madre = ?,
      parroquia_bautizo = ?,
      dir_comunion = ?, lugar_comunion = ?,
      fecha_comunion = ?, parroco = ?
    WHERE id_comunion = ?
  `;

  pool.query(
    updateComunQuery,
    [
      nombre,
      a_paterno,
      a_materno,
      fecha_nac,
      nom_padre,
      a_pat_padre,
      a_mat_padre,
      nom_madre,
      a_pat_madre,
      a_mat_madre,
      parroquia_bautizo,
      dir_comunion,
      lugar_comunion,
      fecha_comunion,
      parroco,
      id_comunion,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar la comunión:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar la comunión" });
      }

      const updatePadrinosQuery = `
        UPDATE padrinos SET
          pad_nom = ?, pad_ap_pat = ?, pad_ap_mat = ?,
          mad_nom = ?, mad_ap_pat = ?, mad_ap_mat = ?
        WHERE id_sacramento = ? AND tipo_sacramento = 'comunion'
      `;

      pool.query(
        updatePadrinosQuery,
        [
          pad_nom,
          pad_ap_pat,
          pad_ap_mat,
          mad_nom,
          mad_ap_pat,
          mad_ap_mat,
          id_comunion,
        ],
        (err2, results2) => {
          if (err2) {
            console.error("Error al actualizar los padrinos:", err2);
            return res
              .status(500)
              .json({ error: "Error al actualizar los padrinos" });
          }

          res.json({
            message: "Comunión y padrinos actualizados correctamente",
          });
        }
      );
    }
  );
});

// Eliminar una comunión y sus padrinos
router.delete("/:id_comunion", verifyToken, (req, res) => {
  const { id_comunion } = req.params;

  const deletePadrinosQuery = `
    DELETE FROM padrinos 
    WHERE id_sacramento = ? AND tipo_sacramento = 'comunion'
  `;

  pool.query(deletePadrinosQuery, [id_comunion], (err1) => {
    if (err1) {
      console.error("Error al eliminar padrinos:", err1);
      return res.status(500).json({ error: "Error al eliminar los padrinos" });
    }

    const deleteComunQuery = `
      DELETE FROM comunion WHERE id_comunion = ?
    `;

    pool.query(deleteComunQuery, [id_comunion], (err2, results2) => {
      if (err2) {
        console.error("Error al eliminar la comunión:", err2);
        return res.status(500).json({ error: "Error al eliminar la comunión" });
      }

      if (results2.affectedRows > 0) {
        res.json({ message: "Comunión y padrinos eliminados correctamente" });
      } else {
        res.status(404).json({ error: "Comunión no encontrada" });
      }
    });
  });
});

export { router as routerComuniones };
