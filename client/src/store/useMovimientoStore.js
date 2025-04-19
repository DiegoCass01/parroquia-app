import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useMovimientoStore = create((set) => ({
  movimientos: [],

  fetchMovimientos: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/movimiento`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ movimientos: res.data });

      return res;
    } catch (error) {
      console.error("Error al obtener movimientos", error);
      return null;
    }
  },

  createMovimiento: async (nuevoMovimiento) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/movimiento`, nuevoMovimiento, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        movimientos: [
          ...state.movimientos,
          { ...nuevoMovimiento, id_movimiento: res.data.id },
        ],
      }));

      return res;
    } catch (error) {
      console.error("Error al crear movimiento", error);
      return null;
    }
  },

  // editMovimiento: async (movimiento) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.put(
  //       `${API_URL}/movimiento/${movimiento.id_movimiento}`,
  //       movimiento,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     set((state) => ({
  //       movimientos: state.movimientos.map((m) =>
  //         m.id_movimiento === movimiento.id_movimiento
  //           ? { ...m, ...movimiento }
  //           : m
  //       ),
  //     }));

  //     return res;
  //   } catch (error) {
  //     console.error("Error al editar movimiento", error);
  //     return null;
  //   }
  // },

  deleteMovimiento: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/movimiento/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        movimientos: state.movimientos.filter((m) => m.id_movimiento !== id),
      }));

      return res;
    } catch (error) {
      console.error("Error al eliminar movimiento", error);
      return null;
    }
  },
}));
