import express from "express";
import pool from "../api/db.js";
import { verifyToken } from "../middleware/validationToken.js";

const router = express.Router();

// Verify database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application if the database connection fails
  }
});

// Obtener todos los bautizos
router.get("/", verifyToken, (req, res) => {
  pool.query(
    `SELECT 
      b.*, 
      p.pad_nom, p.pad_ap_pat, p.pad_ap_mat,
      p.mad_nom, p.mad_ap_pat, p.mad_ap_mat
    FROM bautizos b
    LEFT JOIN padrinos p ON b.id_bautizo = p.id_sacramento AND p.tipo_sacramento = 'bautizo';`,
    (err, results) => {
      if (err) {
        console.error("Error al obtener bautizos:", err);
        res.status(500).json({ error: "Error al obtener los datos" });
      } else {
        res.json(results);
      }
    }
  );
});

// Crear un nuevo bautizo
router.post("/", verifyToken, (req, res) => {
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
    dir_bautizo,
    lugar_bautizo,
    fecha_bautizo,
    lugar_nac,
    fecha_nac,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  } = req.body;

  const insertQuery = `INSERT INTO bautizos (
    nombre, a_paterno, a_materno,
    nom_padre, a_pat_padre, a_mat_padre,
    nom_madre, a_pat_madre, a_mat_madre,
    dir_bautizo, lugar_bautizo, fecha_bautizo,
    lugar_nac, fecha_nac, parroco,
    folio
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(
    insertQuery,
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
      dir_bautizo,
      lugar_bautizo,
      fecha_bautizo,
      lugar_nac,
      fecha_nac,
      parroco,
      "AB",
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el bautizo:", err);
        return res.status(500).json({ error: "Error al crear el bautizo" });
      }
      // Esto para insertar en los padrinos
      const baptismId = results.insertId;

      const insertGodparentsQuery = `INSERT INTO padrinos (id_sacramento, tipo_sacramento, pad_nom, pad_ap_pat, pad_ap_mat, mad_nom, mad_ap_pat, mad_ap_mat, tipo_pad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      pool.query(
        insertGodparentsQuery,
        [
          baptismId,
          "bautizo",
          pad_nom,
          pad_ap_pat,
          pad_ap_mat,
          mad_nom,
          mad_ap_pat,
          mad_ap_mat,
          "general",
        ],
        (err3, results3) => {
          if (err3) {
            console.error("Error al insertar padrinos:", err3);
          }
        }
      );

      res.status(201).json({
        message: "Bautizo creado correctamente",
        bautizo: results.insertId,
      });
    }
  );
});

// Actualizar un bautizo y padrinos
router.put("/:id_bautizo", verifyToken, (req, res) => {
  const { id_bautizo } = req.params;
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
    dir_bautizo,
    lugar_bautizo,
    fecha_bautizo,
    lugar_nac,
    fecha_nac,
    parroco,
    pad_nom,
    pad_ap_pat,
    pad_ap_mat,
    mad_nom,
    mad_ap_pat,
    mad_ap_mat,
  } = req.body;

  // Verificar si el bautizo existe
  const checkBautizoQuery = `SELECT * FROM bautizos WHERE id_bautizo = ?`;
  pool.query(checkBautizoQuery, [id_bautizo], (err, results) => {
    if (err) {
      console.error("Error al verificar bautizo:", err);
      return res.status(500).json({ error: "Error al verificar bautizo" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Bautizo no encontrado" });
    }

    // Actualizar el bautizo
    const updateBautizoQuery = `UPDATE bautizos SET 
      nombre = ?, 
      a_paterno = ?, 
      a_materno = ?, 
      nom_padre = ?,
      a_pat_padre = ?,
      a_mat_padre = ?,
      nom_madre = ?,
      a_pat_madre = ?,
      a_mat_madre = ?,
      dir_bautizo = ?, 
      lugar_bautizo = ?, 
      fecha_bautizo = ?, 
      lugar_nac = ?, 
      fecha_nac = ?, 
      parroco = ?
    WHERE id_bautizo = ?`;

    pool.query(
      updateBautizoQuery,
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
        dir_bautizo,
        lugar_bautizo,
        fecha_bautizo,
        lugar_nac,
        fecha_nac,
        parroco,
        id_bautizo,
      ],
      (err, results) => {
        if (err) {
          console.error("Error al actualizar el bautizo:", err);
          return res
            .status(500)
            .json({ error: "Error al actualizar el bautizo", details: err });
        }

        // Verificar si los padrinos existen
        const checkPadrinosQuery = `SELECT * FROM padrinos WHERE id_sacramento = ? AND tipo_sacramento = 'bautizo'`;
        pool.query(checkPadrinosQuery, [id_bautizo], (err2, results2) => {
          if (err2) {
            console.error("Error al verificar padrinos:", err2);
            return res
              .status(500)
              .json({ error: "Error al verificar padrinos" });
          }

          // Si los padrinos no existen, devolver un error
          if (results2.length === 0) {
            return res.status(404).json({ error: "Padrinos no encontrados" });
          }

          // Actualizar los padrinos
          const updatePadrinosQuery = `UPDATE padrinos SET 
            pad_nom = ?, 
            pad_ap_pat = ?, 
            pad_ap_mat = ?, 
            mad_nom = ?, 
            mad_ap_pat = ?, 
            mad_ap_mat = ?
          WHERE id_sacramento = ? AND tipo_sacramento = 'bautizo'`;

          pool.query(
            updatePadrinosQuery,
            [
              pad_nom,
              pad_ap_pat,
              pad_ap_mat,
              mad_nom,
              mad_ap_pat,
              mad_ap_mat,
              id_bautizo,
            ],
            (err3, results3) => {
              if (err3) {
                console.error("Error al actualizar los padrinos:", err3);
                return res
                  .status(500)
                  .json({ error: "Error al actualizar los padrinos" });
              }

              // Si todo se actualizó correctamente
              res.json({
                message: "Bautizo y padrinos actualizados correctamente",
              });
            }
          );
        });
      }
    );
  });
});

// Eliminar un bautizo, padres y padrinos
router.delete("/:id_bautizo", verifyToken, (req, res) => {
  const { id_bautizo } = req.params;

  // Primero, eliminar los padrinos relacionados
  const deletePadrinosQuery = `DELETE FROM padrinos WHERE id_sacramento = ? AND tipo_sacramento = 'bautizo'`;

  pool.query(deletePadrinosQuery, [id_bautizo], (err1, results1) => {
    if (err1) {
      console.error("Error al eliminar los padrinos:", err1);
      return res.status(500).json({ error: "Error al eliminar los padrinos" });
    }

    // Finalmente, eliminar el bautizo
    const deleteBautizoQuery = `DELETE FROM bautizos WHERE id_bautizo = ?`;

    pool.query(deleteBautizoQuery, [id_bautizo], (err3, results3) => {
      if (err3) {
        console.error("Error al eliminar el bautizo:", err3);
        return res.status(500).json({ error: "Error al eliminar el bautizo" });
      }

      // Si todo se eliminó correctamente
      if (results3.affectedRows > 0) {
        res.json({
          message: "Bautizo y padrinos eliminados correctamente",
        });
      } else {
        res.status(404).json({ error: "Bautizo no encontrado" });
      }
    });
  });
});

export { router as routerBautizos };
