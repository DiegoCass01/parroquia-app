import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

export const useBautizoStore = create((set) => ({
  bautizos: [],

  fetchBautizos: async () => {
    try {
      const res = await axios.get(`${API_URL}/bautizos`);

      set({ bautizos: res.data });

      return res;
    } catch (error) {
      console.error("Error al obtener bautizos", error);
      return null; // ❌ Retorna null en caso de error
    }
  },

  createBautizo: async (nuevoBautizo) => {
    try {
      const { user } = useAuthStore.getState(); // 🔹 Obtiene el usuario actual del store
      const res = await axios.post(`${API_URL}/bautizos`, {
        ...nuevoBautizo,
        registrado_por: user?.nombre,
      });

      set((state) => ({
        bautizos: [...state.bautizos, res.data],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear bautizo", error);
      return null; // ❌ Retorna null en caso de error
    }
  },

  editBautizo: async (bautizo) => {
    try {
      const res = await axios.put(
        `${API_URL}/bautizos/${bautizo.id_bautizo}`,
        bautizo
      );

      set((state) => ({
        bautizos: state.bautizos.map(
          (b) => (b.id === bautizo.id_bautizo ? { ...b, ...bautizo } : b) // 🔹 Asegura que los cambios se reflejen en el estado
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar bautizo", error);
      return null; // ❌ Retorna null en caso de error
    }
  },

  deleteBautizo: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/bautizos/${id}`);

      set((state) => ({
        bautizos: state.bautizos.filter((b) => b.id_bautizo !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar bautizo", error);
      return null; // ❌ Retorna null en caso de error
    }
  },
}));
