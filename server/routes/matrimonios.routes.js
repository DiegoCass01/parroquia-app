import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todos los matrimonios
router.get("/", verifyToken, (req, res) => {
  pool.query("SELECT * FROM matrimonio", (err, results) => {
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
    fecha_matrimonio,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    INSERT INTO matrimonio (
      nombre_novio, a_pat_novio, a_mat_novio,
      nombre_novia, a_pat_novia, a_mat_novia,
      fecha_matrimonio, libro, foja, acta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [
      nombre_novio,
      a_pat_novio,
      a_mat_novio,
      nombre_novia,
      a_pat_novia,
      a_mat_novia,
      fecha_matrimonio,
      libro,
      foja,
      acta,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el matrimonio:", err);
        res.status(500).json({ error: "Error al crear el matrimonio" });
      } else {
        res.status(201).json({
          message: "Matrimonio creado correctamente",
          id: results.insertId,
        });
      }
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
    fecha_matrimonio,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    UPDATE matrimonio SET
      nombre_novio = ?, a_pat_novio = ?, a_mat_novio = ?,
      nombre_novia = ?, a_pat_novia = ?, a_mat_novia = ?,
      fecha_matrimonio = ?, libro = ?, foja = ?, acta = ?
    WHERE id_matrimonio = ?
  `;

  pool.query(
    query,
    [
      nombre_novio,
      a_pat_novio,
      a_mat_novio,
      nombre_novia,
      a_pat_novia,
      a_mat_novia,
      fecha_matrimonio,
      libro,
      foja,
      acta,
      id_matrimonio,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el matrimonio:", err);
        res.status(500).json({ error: "Error al actualizar el matrimonio" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Matrimonio actualizado correctamente" });
        } else {
          res.status(404).json({ error: "Matrimonio no encontrado" });
        }
      }
    }
  );
});

// Eliminar un matrimonio
router.delete("/:id_matrimonio", verifyToken, (req, res) => {
  const { id_matrimonio } = req.params;

  pool.query(
    "DELETE FROM matrimonio WHERE id_matrimonio = ?",
    [id_matrimonio],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el matrimonio:", err);
        res.status(500).json({ error: "Error al eliminar el matrimonio" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Matrimonio eliminado correctamente" });
        } else {
          res.status(404).json({ error: "Matrimonio no encontrado" });
        }
      }
    }
  );
});

export { router as routerMatrimonios };
