import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Asegúrate de que esta variable esté definida correctamente

export const useBautizoStore = create((set) => ({
  bautizos: [],

  fetchBautizos: async (search = "", year = "", yearNac = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/bautizos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          year,
          yearNac,
        },
      });

      set({ bautizos: res.data });
      return res;
    } catch (error) {
      console.error("Error al obtener bautizos", error);
      return null;
    }
  },

  createBautizo: async (nuevoBautizo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/bautizos`, nuevoBautizo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        bautizos: [...state.bautizos, res.data],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear bautizo", error);
      return null; // Retorna null en caso de error
    }
  },

  editBautizo: async (bautizo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/bautizos/${bautizo.id_bautizo}`,
        bautizo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        bautizos: state.bautizos.map(
          (b) =>
            b.id_bautizo === bautizo.id_bautizo ? { ...b, ...bautizo } : b // Asegura que los cambios se reflejen en el estado
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error al editar bautizo", error);
      return null; // Retorna null en caso de error
    }
  },

  deleteBautizo: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/bautizos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        bautizos: state.bautizos.filter((b) => b.id_bautizo !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar bautizo", error);
      return null; // Retorna null en caso de error
    }
  },
}));
