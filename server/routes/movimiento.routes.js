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

// Obtener todos los movimientos
router.get("/", verifyToken, (req, res) => {
  pool.query("SELECT * FROM movimiento", (err, results) => {
    if (err) {
      console.error("Error al obtener los movimientos:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo movimiento
router.post("/", verifyToken, (req, res) => {
  const {
    id_sacramento,
    tipo_sacramento,
    tipo_movimiento,
    fecha_mov,
    id_usuario,
    usuario,
    folio,
  } = req.body;

  const query = `
    INSERT INTO movimiento 
    (id_sacramento, tipo_sacramento, tipo_movimiento, fecha_mov, id_usuario, usuario, folio) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  pool.query(
    query,
    [
      id_sacramento,
      tipo_sacramento,
      tipo_movimiento,
      fecha_mov,
      id_usuario,
      usuario,
      folio,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el movimiento:", err);
        return res.status(500).json({ error: "Error al crear el movimiento" });
      }
      res.status(201).json({
        message: "Movimiento creado correctamente",
        id: results.insertId,
      });
    }
  );
});

// Actualizar un movimiento
router.put("/:id_movimiento", verifyToken, (req, res) => {
  const { id_movimiento } = req.params;
  const {
    id_sacramento,
    tipo_sacramento,
    tipo_movimiento,
    fecha_mov,
    id_usuario,
    usuario,
    folio,
  } = req.body;

  const query = `
    UPDATE movimiento 
    SET id_sacramento = ?, tipo_sacramento = ?, tipo_movimiento = ?, fecha_mov = ?, id_usuario = ?, usuario = ?, folio = ?
    WHERE id_movimiento = ?`;

  pool.query(
    query,
    [
      id_sacramento,
      tipo_sacramento,
      tipo_movimiento,
      fecha_mov,
      id_usuario,
      usuario,
      folio,
      id_movimiento,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el movimiento:", err);
        res.status(500).json({ error: "Error al actualizar el movimiento" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Movimiento actualizado correctamente",
          });
        } else {
          res.status(404).json({ error: "Movimiento no encontrado" });
        }
      }
    }
  );
});

// Eliminar un movimiento
router.delete("/:id_movimiento", verifyToken, (req, res) => {
  const { id_movimiento } = req.params;
  pool.query(
    "DELETE FROM movimiento WHERE id_movimiento = ?",
    [id_movimiento],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el movimiento:", err);
        res.status(500).json({ error: "Error al eliminar el movimiento" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Movimiento eliminado correctamente",
          });
        } else {
          res.status(404).json({ error: "Movimiento no encontrado" });
        }
      }
    }
  );
});

export { router as routerMovimiento };
