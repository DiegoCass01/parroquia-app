import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  login: async (correo, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        correo,
        password,
      });

      const { token } = res.data;
      const user = parseJwt(token);

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token });

      console.log("✅ Usuario logueado:", user.nombre);
      return { success: true };
    } catch (err) {
      console.error(
        "❌ Error de login:",
        err.response?.data?.error || err.message
      );
      return {
        success: false,
        error: err.response?.data?.error || err.message,
      };
    }
  },

  logout: () => {
    // Eliminar datos de localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
    console.log("👋 Sesión cerrada");
  },
}));
