import { createPool } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  } else {
    console.log("✅ Conectado a MySQL correctamente!");
    connection.release();
  }
});

export default pool;
