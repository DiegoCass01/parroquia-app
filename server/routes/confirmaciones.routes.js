import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todas las confirmaciones
router.get("/", verifyToken, (req, res) => {
  pool.query("SELECT * FROM confirmacion", (err, results) => {
    if (err) {
      console.error("Error al obtener confirmaciones:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear una nueva confirmación
router.post("/", verifyToken, (req, res) => {
  const {
    nombre,
    a_paterno,
    a_materno,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    fecha_confirmacion,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    INSERT INTO confirmacion (
      nombre, a_paterno, a_materno,
      nom_padre, a_pat_padre, a_mat_padre,
      nom_madre, a_pat_madre, a_mat_madre,
      fecha_confirmacion, libro, foja, acta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [
      nombre,
      a_paterno,
      a_materno,
      nom_padre,
      a_pat_padre,
      a_mat_padre,
      nom_madre,
      a_pat_madre,
      a_mat_madre,
      fecha_confirmacion,
      libro,
      foja,
      acta,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear la confirmación:", err);
        return res
          .status(500)
          .json({ error: "Error al crear la confirmación" });
      }
      res.status(201).json({
        message: "Confirmación creada correctamente",
        id: results.insertId,
      });
    }
  );
});

// Actualizar una confirmación
router.put("/:id_confirmacion", verifyToken, (req, res) => {
  const { id_confirmacion } = req.params;
  const {
    nombre,
    a_paterno,
    a_materno,
    nom_padre,
    a_pat_padre,
    a_mat_padre,
    nom_madre,
    a_pat_madre,
    a_mat_madre,
    fecha_confirmacion,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    UPDATE confirmacion SET
      nombre = ?, a_paterno = ?, a_materno = ?,
      nom_padre = ?, a_pat_padre = ?, a_mat_padre = ?,
      nom_madre = ?, a_pat_madre = ?, a_mat_madre = ?,
      fecha_confirmacion = ?, libro = ?, foja = ?, acta = ?
    WHERE id_confirmacion = ?
  `;

  pool.query(
    query,
    [
      nombre,
      a_paterno,
      a_materno,
      nom_padre,
      a_pat_padre,
      a_mat_padre,
      nom_madre,
      a_pat_madre,
      a_mat_madre,
      fecha_confirmacion,
      libro,
      foja,
      acta,
      id_confirmacion,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar la confirmación:", err);
        res.status(500).json({ error: "Error al actualizar la confirmación" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Confirmación actualizada correctamente" });
        } else {
          res.status(404).json({ error: "Confirmación no encontrada" });
        }
      }
    }
  );
});

// Eliminar una confirmación
router.delete("/:id_confirmacion", verifyToken, (req, res) => {
  const { id_confirmacion } = req.params;

  pool.query(
    "DELETE FROM confirmacion WHERE id_confirmacion = ?",
    [id_confirmacion],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar la confirmación:", err);
        res.status(500).json({ error: "Error al eliminar la confirmación" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Confirmación eliminada correctamente" });
        } else {
          res.status(404).json({ error: "Confirmación no encontrada" });
        }
      }
    }
  );
});

export { router as routerConfirmaciones };
