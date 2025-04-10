import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/validationToken.js";
import { routerBautizos } from "../routes/bautizos.routes.js";
import { routerComuniones } from "../routes/comuniones.routes.js";
import { routerConfirmaciones } from "../routes/confirmaciones.routes.js";
import { routerMatrimonios } from "../routes/matrimonios.routes.js";
import { usuariosRouter } from "../routes/usuarios.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

// Middleware
const corsOptions = {
  // origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas
// app.get("/", (req, res) => {
//   res.send("✅ Servidor corriendo correctamente!");
// });

app.use("/api/bautizos", routerBautizos);
app.use("/api/comuniones", routerComuniones);
app.use("/api/confirmaciones", routerConfirmaciones);
app.use("/api/matrimonios", routerMatrimonios);
app.use("/api/usuarios", usuariosRouter);

// // Login -------------------------------------------------------------------------------------------
// Iniciar sesión
app.post("/api/login", (req, res) => {
  const { n_usuario, password } = req.body;

  pool.query(
    "SELECT * FROM usuarios WHERE n_usuario = ?",
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
        { expiresIn: "7d" }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token: token,
      });
    }
  );
});

// Cerrar sesión (logout)
app.post("/api/logout", (req, res) => {
  // En realidad, no se necesita hacer nada en el servidor con JWT
  res.json({ message: "Cierre de sesión exitoso" });
});

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://${DB_HOST}:${PORT}`);
});
