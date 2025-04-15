import { create } from "zustand";
import axios from "axios";
import { parseJwt } from "../functions/parseJwt";

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  login: async (n_usuario, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        n_usuario,
        password,
      });

      const { token } = res.data;
      const user = parseJwt(token);

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token });

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

  // Función para validar credenciales de administrador
  validateAdminPassword: async ({ n_usuario, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/validate-admin`, {
        n_usuario,
        password,
      });

      return response;
    } catch (error) {
      return error.response;
    }
  },
}));
