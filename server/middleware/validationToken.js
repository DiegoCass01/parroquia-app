import jwt from "jsonwebtoken";

// Middleware to verify the JWT token
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
    req.user = decoded; // Añadir la información del usuario a la solicitud
    next();
  });
};

// Middleware para verificar el rol de usuario
const verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== role) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
};

export { verifyToken, verifyRole };
