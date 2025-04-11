import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useUsuarioStore = create((set) => ({
  usuarios: [],

  fetchUsuarios: async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token dentro de la función cada vez que la llames
      const res = await axios.get(`${API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ usuarios: res.data });

      return res;
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      return null; // Retorna null en caso de error
    }
  },

  createUsuario: async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/usuarios`, nuevoUsuario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        usuarios: [...state.usuarios, res.data],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear usuario", error);
      return null; // Retorna null en caso de error
    }
  },

  editUsuario: async (usuario) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/usuarios/${usuario.id}`,
        usuario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        usuarios: state.usuarios.map((u) =>
          u.id === usuario.id ? res.data : u
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar usuario", error);
      return null; // Retorna null en caso de error
    }
  },

  deleteUsuario: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        usuarios: state.usuarios.filter((usuario) => usuario.id !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      return null; // Retorna null en caso de error
    }
  },
}));
