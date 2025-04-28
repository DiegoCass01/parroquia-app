import express from "express";
import pool from "../api/db.js";
import { verifyRole, verifyToken } from "../middleware/validationToken.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Obtener todos los usuarios que tengan el rol de usuario
router.get("/", verifyToken, verifyRole(["admin", "moderador"]), (req, res) => {
  const query = `SELECT * FROM usuario WHERE rol != 'admin'`;
  pool.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});

// Crear un nuevo usuario
router.post("/", (req, res) => {
  const { nombre, a_paterno, a_materno, n_usuario, password, rol } = req.body;

  const checkQuery = "SELECT * FROM usuario WHERE n_usuario = ?";
  pool.query(checkQuery, [n_usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res
        .status(409)
        .json({ message: "El nombre de usuario ya existe" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertQuery = `
      INSERT INTO usuario (nombre, a_paterno, a_materno, n_usuario, password, rol)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    pool.query(
      insertQuery,
      [nombre, a_paterno, a_materno, n_usuario, hashedPassword, rol],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res
          .status(201)
          .json({ message: "Usuario registrado", id: results.insertId });
      }
    );
  });
});

// Editar un usuario
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "moderador"]),
  (req, res) => {
    const { id } = req.params;
    const { nombre, a_paterno, a_materno, n_usuario, password, rol } = req.body;

    // Primero, buscamos el usuario para obtener su contraseña actual
    pool.query(
      "SELECT password FROM usuario WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error al buscar usuario:", err);
          return res.status(500).json({ error: "Error al buscar el usuario" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const currentHashedPassword = results[0].password;

        let fields = [
          "nombre = ?",
          "a_paterno = ?",
          "a_materno = ?",
          "n_usuario = ?",
          "rol = ?",
        ];
        const values = [nombre, a_paterno, a_materno, n_usuario, rol];

        // Solo si viene contraseña nueva y es distinta a la actual, la actualizamos
        if (password && !bcrypt.compareSync(password, currentHashedPassword)) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          fields.push("password = ?");
          values.push(hashedPassword);
        }

        values.push(id); // Siempre va al final

        const query = `
        UPDATE usuario 
        SET ${fields.join(", ")} 
        WHERE id = ?`;

        pool.query(query, values, (err) => {
          if (err) {
            console.error("Error al actualizar usuario:", err);
            return res
              .status(500)
              .json({ error: "Error al actualizar usuario" });
          }

          res
            .status(200)
            .json({ message: "Usuario actualizado correctamente" });
        });
      }
    );
  }
);

// Eliminar un usuario
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "moderador"]),
  (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM usuario WHERE id = ?`;
    pool.query(query, [id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: "Usuario eliminado" });
    });
  }
);

export { router as usuariosRouter };
