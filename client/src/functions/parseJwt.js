function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Error al parsear el JWT:", e);
    return null;
  }
}

function isTokenExpired(token) {
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  return decodedToken.exp < currentTime; // Verifica si el token ha expirado
}

// Función para verificar si el rol es el adecuado
function hasRequiredRole(token, requiredRole) {
  const decodedToken = parseJwt(token);
  if (!decodedToken || !decodedToken.rol) return false;
  return decodedToken.rol === requiredRole; // Compara el rol del token con el rol requerido
}

export { parseJwt, isTokenExpired, hasRequiredRole };
