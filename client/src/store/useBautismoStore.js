import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useBautismoStore = create((set) => ({
  bautismos: [],

  fetchBautismos: async () => {
    try {
      const res = await axios.get(`${API_URL}/bautismos`);
      set({ bautismos: res.data });
    } catch (error) {
      console.error("Error al obtener bautismos", error);
    }
  },

  createBautismo: async (nuevoBautismo) => {
    try {
      const res = await axios.post(`${API_URL}/bautismos`, nuevoBautismo);
      set((state) => ({
        bautismos: [...state.bautismos, res.data],
      }));
    } catch (error) {
      console.error("Error al crear bautismo", error);
    }
  },

  deleteBautismo: async (id) => {
    try {
      await axios.delete(`${API_URL}/bautismos/${id}`);
      set((state) => ({
        bautismos: state.bautismos.filter((b) => b.id !== id),
      }));
    } catch (error) {
      console.error("Error al eliminar bautismo", error);
    }
  },
}));
