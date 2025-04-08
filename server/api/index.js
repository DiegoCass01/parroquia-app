import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

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

// Bautizos -------------------------------------------------------------------------------------------

// Obtener todos los bautizos
app.get("/api/bautizos", (req, res) => {
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
app.post("/api/bautizos", (req, res) => {
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
app.put("/api/bautizos/:id_bautizo", (req, res) => {
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
app.delete("/api/bautizos/:id_bautizo", (req, res) => {
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

// Comuniones -------------------------------------------------------------------------------------------

// Obtener todos las comuniones
app.get("/api/comuniones", (req, res) => {
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
app.post("/api/comuniones", (req, res) => {
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
app.put("/api/comuniones/:id_comunion", (req, res) => {
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
app.delete("/api/comuniones/:id_comunion", (req, res) => {
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

// Confirmaciones -------------------------------------------------------------------------------------------

// Obtener todas las confirmaciones
app.get("/api/confirmaciones", (req, res) => {
  pool.query("SELECT * FROM confirmacion", (err, results) => {
    if (err) {
      console.error("Error al obtener confirmaciones:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear una nueva confirmación
app.post("/api/confirmaciones", (req, res) => {
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
    fecha_confirmacion,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    INSERT INTO confirmacion (
      nombre, a_paterno, a_materno,
      nom_padre, a_pat_padre, a_mat_padre,
      nom_madre, a_pat_madre, a_mat_madre,
      fecha_confirmacion, libro, foja, acta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

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
      fecha_confirmacion,
      libro,
      foja,
      acta,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear la confirmación:", err);
        return res
          .status(500)
          .json({ error: "Error al crear la confirmación" });
      }
      res.status(201).json({
        message: "Confirmación creada correctamente",
        id: results.insertId,
      });
    }
  );
});

// Actualizar una confirmación
app.put("/api/confirmaciones/:id_confirmacion", (req, res) => {
  const { id_confirmacion } = req.params;
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
    fecha_confirmacion,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    UPDATE confirmacion SET
      nombre = ?, a_paterno = ?, a_materno = ?,
      nom_padre = ?, a_pat_padre = ?, a_mat_padre = ?,
      nom_madre = ?, a_pat_madre = ?, a_mat_madre = ?,
      fecha_confirmacion = ?, libro = ?, foja = ?, acta = ?
    WHERE id_confirmacion = ?
  `;

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
      fecha_confirmacion,
      libro,
      foja,
      acta,
      id_confirmacion,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar la confirmación:", err);
        res.status(500).json({ error: "Error al actualizar la confirmación" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Confirmación actualizada correctamente" });
        } else {
          res.status(404).json({ error: "Confirmación no encontrada" });
        }
      }
    }
  );
});

// Eliminar una confirmación
app.delete("/api/confirmaciones/:id_confirmacion", (req, res) => {
  const { id_confirmacion } = req.params;

  pool.query(
    "DELETE FROM confirmacion WHERE id_confirmacion = ?",
    [id_confirmacion],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar la confirmación:", err);
        res.status(500).json({ error: "Error al eliminar la confirmación" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Confirmación eliminada correctamente" });
        } else {
          res.status(404).json({ error: "Confirmación no encontrada" });
        }
      }
    }
  );
});

// Usuarios -------------------------------------------------------------------------------------------

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
  const { nombre, a_paterno, a_materno, n_usuario, correo, password, rol } =
    req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO usuarios ( nombre, a_paterno, a_materno,n_usuario, correo, password, rol) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  pool.query(
    query,
    [nombre, a_paterno, a_materno, n_usuario, correo, hashedPassword, rol],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Usuario registrado" });
    }
  );
});

// Login -------------------------------------------------------------------------------------------

// Iniciar sesión
app.post("/api/login", (req, res) => {
  const { correo, password } = req.body;

  pool.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo],
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://${DB_HOST}:${PORT}`);
});
