import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useComunionStore = create((set) => ({
  comuniones: [],

  fetchComuniones: async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.get(`${API_URL}/comuniones`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });

      set({ comuniones: res.data });

      return res;
    } catch (error) {
      console.error("Error al obtener comuniones", error);
      return null; // Retorna null en caso de error
    }
  },

  createComunion: async (nuevaComunion) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.post(`${API_URL}/comuniones`, nuevaComunion, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });

      set((state) => ({
        comuniones: [...state.comuniones, res.data],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear comunion", error);
      return null; // Retorna null en caso de error
    }
  },

  editComunion: async (comunion) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.put(
        `${API_URL}/comuniones/${comunion.id_comunion}`,
        comunion,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
          },
        }
      );

      set((state) => ({
        comuniones: state.comuniones.map(
          (c) =>
            c.id_comunion === comunion.id_comunion ? { ...c, ...comunion } : c // Asegura que los cambios se reflejen en el estado
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar comunion", error);
      return null; // Retorna null en caso de error
    }
  },

  deleteComunion: async (id) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.delete(`${API_URL}/comuniones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });

      set((state) => ({
        comuniones: state.comuniones.filter((c) => c.id_comunion !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar comunion", error);
      return null; // Retorna null en caso de error
    }
  },
}));
