import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom"; // Para redirigir después del login
import "../styles/LoginPage.css";

export default function LoginPage({ showSnackbar }) {
  const { user } = useAuthStore();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    n_usuario: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Intentar hacer login
    const response = await login(formData.n_usuario, formData.password);

    if (response.success) {
      showSnackbar(`¡Inicio de sesión exitoso! Bienvenido ${formData.n_usuario}`, "success");
    } else {
      showSnackbar(response.error, "error");
    }

    setLoading(false);
  };

  // handles the change of page to login
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  return (
    <div className="login-container">
      <section className="login-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group-login">
            <input
              type="n_usuario"
              name="n_usuario"
              placeholder="Nombre de usuario"
              value={formData.n_usuario}
              onChange={handleChange}
              required
              className="login-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="submit-button-login" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </div>
  );
}
