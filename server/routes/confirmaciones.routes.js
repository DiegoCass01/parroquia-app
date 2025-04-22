import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todas las confirmaciones con padrinos
router.get("/", verifyToken, (req, res) => {
  const query = `
    SELECT c.*, 
      p.pad_nom, p.pad_ap_pat, p.pad_ap_mat,
      p.mad_nom, p.mad_ap_pat, p.mad_ap_mat
    FROM confirmacion c
    LEFT JOIN padrinos p ON c.id_confirmacion = p.id_sacramento
    AND p.tipo_sacramento = 'confirmacion'
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener confirmaciones:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear una nueva confirmación con padrinos
router.post("/", verifyToken, (req, res) => {
  const {
    nombre,
    a_paterno,
    a_materno,
    lugar_nac,
    fecha_nac,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    dir_confirmacion,
    lugar_confirmacion,
    fecha_confirmacion,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  } = req.body;

  const insertConfirmacion = `
    INSERT INTO confirmacion (
      nombre, a_paterno, a_materno,
      lugar_nac, fecha_nac,
      nom_padre, a_pat_padre, a_mat_padre,
      nom_madre, a_pat_madre, a_mat_madre,
      dir_confirmacion, lugar_confirmacion, fecha_confirmacion, parroco
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombre,
    a_paterno,
    a_materno,
    lugar_nac,
    fecha_nac,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    dir_confirmacion,
    lugar_confirmacion,
    fecha_confirmacion,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  ];

  pool.query(insertConfirmacion, values, (err, result) => {
    if (err) {
      console.error("Error al insertar confirmación:", err);
      return res.status(500).json({ error: "Error al insertar confirmación" });
    }

    const confId = result.insertId;

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
        confId,
        "confirmacion",
        pad_nom,
        pad_ap_pat,
        pad_ap_mat,
        mad_nom,
        mad_ap_pat,
        mad_ap_mat,
        "general",
      ],
      (err) => {
        if (err) {
          console.error("Error al insertar padrinos:", err);
          return res.status(500).json({ error: "Error al insertar padrinos" });
        }

        res.status(201).json({
          message: "Confirmación y padrinos creados correctamente",
          id: confId,
        });
      }
    );
  });
});

// Actualizar confirmación (padrinos pueden manejarse aparte si se desea)
router.put("/:id_confirmacion", verifyToken, (req, res) => {
  const { id_confirmacion } = req.params;
  const {
    nombre,
    a_paterno,
    a_materno,
    lugar_nac,
    fecha_nac,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    dir_confirmacion,
    lugar_confirmacion,
    fecha_confirmacion,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  } = req.body;

  const updateQuery = `
    UPDATE confirmacion SET
      nombre = ?, a_paterno = ?, a_materno = ?,
      lugar_nac = ?, fecha_nac = ?,
      nom_padre = ?, a_pat_padre = ?, a_mat_padre = ?,
      nom_madre = ?, a_pat_madre = ?, a_mat_madre = ?,
      dir_confirmacion = ?, lugar_confirmacion = ?, fecha_confirmacion = ?, parroco = ?
    WHERE id_confirmacion = ?
  `;

  const values = [
    nombre,
    a_paterno,
    a_materno,
    lugar_nac,
    fecha_nac,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    dir_confirmacion,
    lugar_confirmacion,
    fecha_confirmacion,
    parroco,
    id_confirmacion,
  ];

  pool.query(updateQuery, values, (err, results) => {
    if (err) {
      console.error("Error al actualizar la confirmación:", err);
      return res
        .status(500)
        .json({ error: "Error al actualizar la confirmación" });
    }

    const updatePadrinosQuery = `
        UPDATE padrinos SET
          pad_nom = ?, pad_ap_pat = ?, pad_ap_mat = ?,
          mad_nom = ?, mad_ap_pat = ?, mad_ap_mat = ?
        WHERE id_sacramento = ? AND tipo_sacramento = 'confirmacion'
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
        id_confirmacion,
      ],
      (err2, results2) => {
        if (err2) {
          console.error("Error al actualizar los padrinos:", err2);
          return res
            .status(500)
            .json({ error: "Error al actualizar los padrinos" });
        }

        res.json({
          message: "Confirmacion y padrinos actualizados correctamente",
        });
      }
    );
  });
});

// Eliminar una comunión y sus padrinos
router.delete("/:id_confirmacion", verifyToken, (req, res) => {
  const { id_confirmacion } = req.params;

  const deletePadrinosQuery = `
    DELETE FROM padrinos 
    WHERE id_sacramento = ? AND tipo_sacramento = 'confirmacion'
  `;

  pool.query(deletePadrinosQuery, [id_confirmacion], (err1) => {
    if (err1) {
      console.error("Error al eliminar padrinos:", err1);
      return res.status(500).json({ error: "Error al eliminar los padrinos" });
    }

    const deleteComunQuery = `
      DELETE FROM confirmacion WHERE id_confirmacion = ?
    `;

    pool.query(deleteComunQuery, [id_confirmacion], (err2, results2) => {
      if (err2) {
        console.error("Error al eliminar la confirmacion:", err2);
        return res
          .status(500)
          .json({ error: "Error al eliminar la confirmacion" });
      }

      if (results2.affectedRows > 0) {
        res.json({
          message: "Confirmacion y padrinos eliminados correctamente",
        });
      } else {
        res.status(404).json({ error: "Confirmacion no encontrada" });
      }
    });
  });
});

export { router as routerConfirmaciones };
