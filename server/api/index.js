import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Aquí va la URL de tu frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .json({ error: "No se proporcionó un token de autorización" });
  }

  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7, token.length)
    : token;

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token no válido o expirado" });
    }
    req.user = decoded; // Decodificamos la información del usuario y la añadimos a la solicitud
    next();
  });
};

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
    registrado_por,
  } = req.body;

  const query = `
    INSERT INTO bautismos 
    (nombre, fecha_bautismo, lugar_bautismo, fecha_registro, lugar_nacimiento, fecha_nacimiento, padre, madre, padrino, madrina, registrado_por) 
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)
  `;

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
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el bautismo:", err);
        return res.status(500).json({ error: "Error al crear el bautismo" });
      }
      res.status(201).json({
        message: "Bautismo creado correctamente",
        id: results.insertId,
      });
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

// Obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
  pool.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo usuario
app.post("/api/usuarios", (req, res) => {
  const { nombre, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
  pool.query(query, [nombre, email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ error: "Error al registrar" });
    res.status(201).json({ message: "Usuario registrado" });
  });
});

// Iniciar sesión
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
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
        { id: user.id, nombre: user.nombre },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
