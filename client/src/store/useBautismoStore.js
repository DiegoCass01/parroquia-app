import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useBautismoStore = create((set) => ({
  bautismos: [],

  fetchBautismos: async () => {
    try {
      const res = await axios.get(`${API_URL}/bautismos`);

      set({ bautismos: res.data });

      return res;
    } catch (error) {
      console.error("Error al obtener bautismos", error);
      return null; // ❌ Retorna null en caso de error
    }
  },

  createBautismo: async (nuevoBautismo) => {
    try {
      const res = await axios.post(`${API_URL}/bautismos`, nuevoBautismo);

      set((state) => ({
        bautismos: [...state.bautismos, res.data],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear bautismo", error);
      return null; // ❌ Retorna null en caso de error
    }
  },

  editBautismo: async (bautismo) => {
    try {
      const res = await axios.put(
        `${API_URL}/bautismos/${bautismo.id}`,
        bautismo
      );

      set((state) => ({
        bautismos: state.bautismos.map(
          (b) => (b.id === bautismo.id ? { ...b, ...bautismo } : b) // 🔹 Asegura que los cambios se reflejen en el estado
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar bautismo", error);
      return null; // ❌ Retorna null en caso de error
    }
  },

  deleteBautismo: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/bautismos/${id}`);

      set((state) => ({
        bautismos: state.bautismos.filter((b) => b.id !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar bautismo", error);
      return null; // ❌ Retorna null en caso de error
    }
  },
}));
