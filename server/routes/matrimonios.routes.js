import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Obtener todos los matrimonios
router.get("/", verifyToken, (req, res) => {
  const query = `
    SELECT 
      m.*, 
      p.pad_nom, p.pad_ap_pat, p.pad_ap_mat,
      p.mad_nom, p.mad_ap_pat, p.mad_ap_mat
    FROM matrimonio m
    LEFT JOIN padrinos p 
      ON m.id_matrimonio = p.id_sacramento 
      AND p.tipo_sacramento = 'matrimonio'
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener matrimonios:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo matrimonio
router.post("/", verifyToken, (req, res) => {
  const {
    nombre_novio,
    a_pat_novio,
    a_mat_novio,
    nombre_novia,
    a_pat_novia,
    a_mat_novia,
    nom_padre_novio,
    a_pat_padre_novio,
    a_mat_padre_novio,
    nom_madre_novio,
    a_pat_madre_novio,
    a_mat_madre_novio,
    nom_padre_novia,
    a_pat_padre_novia,
    a_mat_padre_novia,
    nom_madre_novia,
    a_pat_madre_novia,
    a_mat_madre_novia,
    dir_matrimonio,
    lugar_matrimonio,
    fecha_matrimonio,
    libro,
    foja,
    acta,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
    testigo_nom,
    testigo_ap_pat,
    testigo_ap_mat,
    testigo2_nom,
    testigo2_ap_pat,
    testigo2_ap_mat,
  } = req.body;

  const queryMatrimonio = `
    INSERT INTO matrimonio (
  nombre_novio,
  a_pat_novio,
  a_mat_novio,
  nombre_novia,
  a_pat_novia,
  a_mat_novia,
  nom_padre_novio,
  a_pat_padre_novio,
  a_mat_padre_novio,
  nom_madre_novio,
  a_pat_madre_novio,
  a_mat_madre_novio,
  nom_padre_novia,
  a_pat_padre_novia,
  a_mat_padre_novia,
  nom_madre_novia,
  a_pat_madre_novia,
  a_mat_madre_novia,
  dir_matrimonio,
  lugar_matrimonio,
  fecha_matrimonio
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

  `;

  pool.query(
    queryMatrimonio,
    [
      nombre_novio,
      a_pat_novio,
      a_mat_novio,
      nombre_novia,
      a_pat_novia,
      a_mat_novia,
      nom_padre_novio,
      a_pat_padre_novio,
      a_mat_padre_novio,
      nom_madre_novio,
      a_pat_madre_novio,
      a_mat_madre_novio,
      nom_padre_novia,
      a_pat_padre_novia,
      a_mat_padre_novia,
      nom_madre_novia,
      a_pat_madre_novia,
      a_mat_madre_novia,
      dir_matrimonio,
      lugar_matrimonio,
      fecha_matrimonio,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el matrimonio:", err);
        res.status(500).json({ error: "Error al crear el matrimonio" });
      }

      const matrimonioId = results.insertId;

      const insertPadrinosQuery = `
        INSERT INTO padrinos (
          id_sacramento, tipo_sacramento,
          pad_nom, pad_ap_pat, pad_ap_mat,
          mad_nom, mad_ap_pat, mad_ap_mat,
          tipo_pad
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      pool.query(
        insertPadrinosQuery,
        [
          matrimonioId,
          "matrimonio",
          pad_nom,
          pad_ap_pat,
          pad_ap_mat,
          mad_nom,
          mad_ap_pat,
          mad_ap_mat,
          "padrinos",
        ],
        (err2) => {
          if (err2) {
            console.error("Error al insertar padrinos:", err2);
            // No se hace rollback, solo se notifica
          }

          pool.query(
            insertPadrinosQuery,
            [
              matrimonioId,
              "matrimonio",
              testigo_nom,
              testigo_ap_pat,
              testigo_ap_mat,
              testigo2_nom,
              testigo2_ap_pat,
              testigo2_ap_mat,
              "testigos",
            ],
            (err3) => {
              if (err3) {
                console.error("Error al insertar testigos:", err2);
                // No se hace rollback, solo se notifica
              }
            }
          );

          res.status(201).json({
            message: "Matrimonio creado correctamente",
            id: matrimonioId,
          });
        }
      );
    }
  );
});

// Actualizar un matrimonio
router.put("/:id_matrimonio", verifyToken, (req, res) => {
  const { id_matrimonio } = req.params;
  const {
    nombre_novio,
    a_pat_novio,
    a_mat_novio,
    nombre_novia,
    a_pat_novia,
    a_mat_novia,
    fecha_matrimonio,
    libro,
    foja,
    acta,
  } = req.body;

  const query = `
    UPDATE matrimonio SET
      nombre_novio = ?, a_pat_novio = ?, a_mat_novio = ?,
      nombre_novia = ?, a_pat_novia = ?, a_mat_novia = ?,
      fecha_matrimonio = ?, libro = ?, foja = ?, acta = ?
    WHERE id_matrimonio = ?
  `;

  pool.query(
    query,
    [
      nombre_novio,
      a_pat_novio,
      a_mat_novio,
      nombre_novia,
      a_pat_novia,
      a_mat_novia,
      fecha_matrimonio,
      libro,
      foja,
      acta,
      id_matrimonio,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el matrimonio:", err);
        res.status(500).json({ error: "Error al actualizar el matrimonio" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Matrimonio actualizado correctamente" });
        } else {
          res.status(404).json({ error: "Matrimonio no encontrado" });
        }
      }
    }
  );
});

// Eliminar un matrimonio
router.delete("/:id_matrimonio", verifyToken, (req, res) => {
  const { id_matrimonio } = req.params;

  pool.query(
    "DELETE FROM matrimonio WHERE id_matrimonio = ?",
    [id_matrimonio],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el matrimonio:", err);
        res.status(500).json({ error: "Error al eliminar el matrimonio" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: "Matrimonio eliminado correctamente" });
        } else {
          res.status(404).json({ error: "Matrimonio no encontrado" });
        }
      }
    }
  );
});

export { router as routerMatrimonios };
