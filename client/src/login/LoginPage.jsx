import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom"; // Para redirigir después del login

export default function LoginPage({ showSnackbar }) {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Intentar hacer login
    const response = await login(email, password);

    if (response.success) {
      showSnackbar("¡Inicio de sesión exitoso!", "success");
      navigate("/"); // Redirige al home o a la página que desees después de loguearte
    } else {
      showSnackbar(response.error, "error");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
