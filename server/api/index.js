import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("✅ Servidor corriendo correctamente!");
});

// Obtener todos los bautismos
app.get("/api/bautismos", (req, res) => {
  pool.query("SELECT * FROM bautismos", (err, results) => {
    if (err) {
      console.error("Error al obtener bautismos:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Obtener un bautismo por ID
app.get("/api/bautismos/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM bautismos WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error al obtener bautismo:", err);
      res.status(500).json({ error: "Error al obtener el bautismo" });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: "Bautismo no encontrado" });
      }
    }
  });
});

// Crear un nuevo bautismo
app.post("/api/bautismos", (req, res) => {
  const {
    nombre,
    fecha_bautismo,
    lugar_bautismo,
    lugar_nacimiento,
    fecha_nacimiento,
    padre,
    madre,
    padrino,
    madrina,
  } = req.body;
  const query =
    "INSERT INTO bautismos (nombre, fecha_bautismo, lugar_bautismo, fecha_registro, lugar_nacimiento , fecha_nacimiento, padre, madre, padrino, madrina) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)"; // Usamos NOW() para establecer la fecha actual
  pool.query(
    query,
    [
      nombre,
      fecha_bautismo,
      lugar_bautismo,
      lugar_nacimiento,
      fecha_nacimiento,
      padre,
      madre,
      padrino,
      madrina,
    ], // No es necesario pasar fecha_registro, lo maneja el servidor
    (err, results) => {
      if (err) {
        console.error("Error al crear el bautismo:", err);
        res.status(500).json({ error: "Error al crear el bautismo" });
      } else {
        res.status(201).json({
          message: "Bautismo creado correctamente",
          id: results.insertId,
        });
      }
    }
  );
});

// Actualizar un bautismo
app.put("/api/bautismos/:id", (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    fecha_bautismo,
    lugar_bautismo,
    lugar_nacimiento,
    fecha_nacimiento,
    padre,
    madre,
    padrino,
    madrina,
  } = req.body;
  const query = `
    UPDATE bautismos 
    SET nombre = ?, fecha_bautismo = ?, lugar_bautismo = ?, 
        lugar_nacimiento = ?, fecha_nacimiento = ?, 
        padre = ?, madre = ?, padrino = ?, madrina = ? 
    WHERE id = ?`;
  pool.query(
    query,
    [
      nombre,
      fecha_bautismo,
      lugar_bautismo,
      lugar_nacimiento,
      fecha_nacimiento,
      padre,
      madre,
      padrino,
      madrina,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el bautismo:", err);
        res.status(500).json({ error: "Error al actualizar el bautismo" });
      } else {
        if (results.affectedRows > 0) {
          res.json({
            message: "Bautismo actualizado correctamente",
          });
        } else {
          res.status(404).json({ error: "Bautismo no encontrado" });
        }
      }
    }
  );
});

// Eliminar un bautismo
app.delete("/api/bautismos/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM bautismos WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar el bautismo:", err);
      res.status(500).json({ error: "Error al eliminar el bautismo" });
    } else {
      if (results.affectedRows > 0) {
        res.json({
          message: "Bautismo eliminado correctamente",
        });
      } else {
        res.status(404).json({ error: "Bautismo no encontrado" });
      }
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
