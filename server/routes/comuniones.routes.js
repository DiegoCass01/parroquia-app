import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todos las comuniones
router.get("/", verifyToken, (req, res) => {
  pool.query("SELECT * FROM comunion", (err, results) => {
    if (err) {
      console.error("Error al obtener comuniones:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear una nueva comunion
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
    lugar_comunion,
    fecha_comunion,
    libro,
    foja,
    acta,
  } = req.body;
  const query = `INSERT INTO comunion (nombre, a_paterno, a_materno, nom_padre, a_pat_padre, a_mat_padre, nom_madre, a_pat_madre, a_mat_madre, lugar_comunion, fecha_comunion, libro, foja, acta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
      lugar_comunion,
      fecha_comunion,
      libro,
      foja,
      acta,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear la comunion:", err);
        return res.status(500).json({ error: "Error al crear la comunion" });
      }
      res.status(201).json({
        message: "Comunion creado correctamente",
        id: results.insertId,
      });
    }
  );
});

// Actualizar una comunion
router.put("/:id_comunion", verifyToken, (req, res) => {
  const { id_comunion } = req.params;
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
    lugar_comunion,
    fecha_comunion,
    libro,
    foja,
    acta,
  } = req.body;
  const query = `UPDATE comunion SET nombre = ?, a_paterno = ?, a_materno = ?, nom_padre = ?, a_pat_padre = ?, a_mat_padre = ?, nom_madre = ?, a_pat_madre = ?, a_mat_madre = ?, lugar_comunion = ?, fecha_comunion = ?, libro = ?, foja = ?, acta = ? WHERE id_comunion = ?`;
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
      lugar_comunion,
      fecha_comunion,
      libro,
      foja,
      acta,
      id_comunion,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el comunion:", err);
        res.status(500).json({ error: "Error al actualizar el comunion" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Comunion actualizado correctamente",
          });
        } else {
          res.status(404).json({ error: "Comunion no encontrado" });
        }
      }
    }
  );
});

// Eliminar una comunion
router.delete("/:id_comunion", verifyToken, (req, res) => {
  const { id_comunion } = req.params;
  pool.query(
    "DELETE FROM comunion WHERE id_comunion = ?",
    [id_comunion],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el comunion:", err);
        res.status(500).json({ error: "Error al eliminar el comunion" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Comunion eliminado correctamente",
          });
        } else {
          res.status(404).json({ error: "Comunion no encontrado" });
        }
      }
    }
  );
});

export { router as routerComuniones };
