import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useConfirmacionStore = create((set) => ({
  confirmaciones: [],

  fetchConfirmaciones: async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.get(`${API_URL}/confirmaciones`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });
      set({ confirmaciones: res.data });
      return res;
    } catch (error) {
      console.error("Error al obtener confirmaciones", error);
      return null;
    }
  },

  createConfirmacion: async (nuevaConfirmacion) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.post(
        `${API_URL}/confirmaciones`,
        nuevaConfirmacion,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
          },
        }
      );

      set((state) => ({
        confirmaciones: [...state.confirmaciones, res.data],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear confirmación", error);
      return null;
    }
  },

  editConfirmacion: async (confirmacion) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.put(
        `${API_URL}/confirmaciones/${confirmacion.id_confirmacion}`,
        confirmacion,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
          },
        }
      );

      set((state) => ({
        confirmaciones: state.confirmaciones.map((c) =>
          c.id_confirmacion === confirmacion.id_confirmacion
            ? { ...c, ...confirmacion }
            : c
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar confirmación", error);
      return null;
    }
  },

  deleteConfirmacion: async (id) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token cada vez
      const res = await axios.delete(`${API_URL}/confirmaciones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });

      set((state) => ({
        confirmaciones: state.confirmaciones.filter(
          (c) => c.id_confirmacion !== id
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar confirmación", error);
      return null;
    }
  },
}));
