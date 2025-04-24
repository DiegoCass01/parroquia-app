import express from "express";
import pool from "../api/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Iniciar sesión
router.post("/login", (req, res) => {
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
        {
          id: user.id,
          nombre: `${user.nombre} ${user.a_paterno} ${user.a_materno}`,
          rol: user.rol,
          n_usuario: user.n_usuario,
        },
        process.env.JWT_SECRET
        // { expiresIn: "15s" }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token: token,
      });
    }
  );
});

// Cerrar sesión (logout)
router.post("/logout", (req, res) => {
  // En realidad, no se necesita hacer nada en el servidor con JWT
  res.json({ message: "Cierre de sesión exitoso" });
});

// Validar credenciales del admin
router.post("/validate-admin", (req, res) => {
  const { n_usuario, password } = req.body;

  pool.query(
    "SELECT * FROM usuario WHERE n_usuario = ? AND rol = 'admin'",
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

      res.status(200).json({
        message: "Validación Exitosa",
      });
    }
  );
});

export { router as loginRouter };
