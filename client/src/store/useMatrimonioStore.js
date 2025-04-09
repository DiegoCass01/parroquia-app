import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useMatrimonioStore = create((set) => ({
  matrimonios: [],

  fetchMatrimonios: async () => {
    try {
      const res = await axios.get(`${API_URL}/matrimonios`);
      set({ matrimonios: res.data });
      return res;
    } catch (error) {
      console.error("Error al obtener matrimonios", error);
      return null;
    }
  },

  createMatrimonio: async (nuevoMatrimonio) => {
    try {
      const res = await axios.post(`${API_URL}/matrimonios`, {
        ...nuevoMatrimonio,
      });

      set((state) => ({
        matrimonios: [
          ...state.matrimonios,
          { ...nuevoMatrimonio, id: res.data.id },
        ],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear matrimonio", error);
      return null;
    }
  },

  editMatrimonio: async (matrimonio) => {
    try {
      const res = await axios.put(
        `${API_URL}/matrimonios/${matrimonio.id_matrimonio}`,
        matrimonio
      );

      set((state) => ({
        matrimonios: state.matrimonios.map((m) =>
          m.id_matrimonio === matrimonio.id_matrimonio
            ? { ...m, ...matrimonio }
            : m
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar matrimonio", error);
      return null;
    }
  },

  deleteMatrimonio: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/matrimonios/${id}`);

      set((state) => ({
        matrimonios: state.matrimonios.filter((m) => m.id_matrimonio !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar matrimonio", error);
      return null;
    }
  },
}));
