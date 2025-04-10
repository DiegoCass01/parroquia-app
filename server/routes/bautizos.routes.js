import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Verify database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application if the database connection fails
  }
});

// Obtener todos los bautizos
router.get("/", (req, res) => {
  pool.query("SELECT * FROM bautizos", (err, results) => {
    if (err) {
      console.error("Error al obtener bautizos:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo bautizo
router.post("/", verifyToken, (req, res) => {
  const {
    nombre,
    a_paterno,
    a_materno,
    lugar_bautizo,
    fecha_bautizo,
    fecha_nac,
    libro,
    foja,
    acta,
  } = req.body;
  const query = `INSERT INTO bautizos (nombre, a_paterno, a_materno, lugar_bautizo, fecha_bautizo, fecha_nac, libro, foja, acta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  pool.query(
    query,
    [
      nombre,
      a_paterno,
      a_materno,
      lugar_bautizo,
      fecha_bautizo,
      fecha_nac,
      libro,
      foja,
      acta,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el bautizo:", err);
        return res.status(500).json({ error: "Error al crear el bautizo" });
      }
      res.status(201).json({
        message: "Bautizo creado correctamente",
        id: results.insertId,
      });
    }
  );
});

// Actualizar un bautizo
router.put("/:id_bautizo", verifyToken, (req, res) => {
  const { id_bautizo } = req.params;
  const {
    nombre,
    a_paterno,
    a_materno,
    lugar_bautizo,
    fecha_bautizo,
    fecha_nac,
    libro,
    foja,
    acta,
  } = req.body;
  const query = `UPDATE bautizos SET nombre = ?, a_paterno = ?, a_materno = ?, lugar_bautizo = ?, fecha_bautizo = ?, fecha_nac = ?, libro = ?, foja = ?, acta = ? WHERE id_bautizo = ?`;
  pool.query(
    query,
    [
      nombre,
      a_paterno,
      a_materno,
      lugar_bautizo,
      fecha_bautizo,
      fecha_nac,
      libro,
      foja,
      acta,
      id_bautizo,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el bautizo:", err);
        res.status(500).json({ error: "Error al actualizar el bautizo" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Bautizo actualizado correctamente",
          });
        } else {
          res.status(404).json({ error: "Bautizo no encontrado" });
        }
      }
    }
  );
});

// Eliminar un bautizo
router.delete("/:id_bautizo", verifyToken, (req, res) => {
  const { id_bautizo } = req.params;
  pool.query(
    "DELETE FROM bautizos WHERE id_bautizo = ?",
    [id_bautizo],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el bautizo:", err);
        res.status(500).json({ error: "Error al eliminar el bautizo" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Bautizo eliminado correctamente",
          });
        } else {
          res.status(404).json({ error: "Bautizo no encontrado" });
        }
      }
    }
  );
});

export { router as routerBautizos };
