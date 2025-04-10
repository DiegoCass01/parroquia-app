import express from "express";
import pool from "../api/db.js";
import { verifyRole, verifyToken } from "../middleware/validationToken.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", verifyToken, verifyRole("admin"), (req, res) => {
  pool.query("SELECT * FROM usuario", (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo usuario
router.post("/", verifyToken, verifyRole("admin"), (req, res) => {
  const { nombre, a_paterno, a_materno, n_usuario, password, rol } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO usuario ( nombre, a_paterno, a_materno,n_usuario, password, rol) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  pool.query(
    query,
    [nombre, a_paterno, a_materno, n_usuario, hashedPassword, rol],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Usuario registrado" });
    }
  );
});

export { router as usuariosRouter };
