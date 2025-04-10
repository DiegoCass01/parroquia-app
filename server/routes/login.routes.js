import express from "express";
import pool from "../api/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Iniciar sesión
router.post("/api/login", (req, res) => {
  const { n_usuario, password } = req.body;

  pool.query(
    "SELECT * FROM usuario WHERE n_usuario = ?",
    [n_usuario],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: user.id, nombre: user.nombre, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "30s" }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token: token,
      });
    }
  );
});

// Cerrar sesión (logout)
router.post("/api/logout", (req, res) => {
  // En realidad, no se necesita hacer nada en el servidor con JWT
  res.json({ message: "Cierre de sesión exitoso" });
});

export { router as loginRouter };
