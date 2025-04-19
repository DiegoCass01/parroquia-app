import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { routerBautizos } from "../routes/bautizos.routes.js";
import { routerComuniones } from "../routes/comuniones.routes.js";
import { routerConfirmaciones } from "../routes/confirmaciones.routes.js";
import { routerMatrimonios } from "../routes/matrimonios.routes.js";
import { usuariosRouter } from "../routes/usuarios.routes.js";
import { loginRouter } from "../routes/login.routes.js";
import { routerMovimiento } from "../routes/movimiento.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

// Middleware
const corsOptions = {
  origin: "*", // Permitir todas las solicitudes de origen
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("✅ Servidor corriendo correctamente!");
});

app.use("/api/bautizos", routerBautizos);
app.use("/api/comuniones", routerComuniones);
app.use("/api/confirmaciones", routerConfirmaciones);
app.use("/api/matrimonios", routerMatrimonios);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/auth", loginRouter);
app.use("/api/movimiento", routerMovimiento);

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://${DB_HOST}:${PORT}`);
});
