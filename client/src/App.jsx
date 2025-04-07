import "./App.css";
import NavBar from "./components/NavBar.jsx";
import { useEffect, useState } from "react";
import { useBautizoStore } from "./store/useBautizoStore.js";
import { Route, Routes } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import SearchBautizo from "./pages/bautizos/SearchBautizo.jsx";
import CreateBautizo from "./pages/bautizos/CreateBautizo.jsx";
import EditBautizo from "./pages/bautizos/EditBautizo.jsx";
import LoginPage from "./login/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomeRedirect from "./components/HomeRedirect.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  const { fetchBautizos } = useBautizoStore();

  useEffect(() => {
    fetchBautizos();
  }, [fetchBautizos]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenSnackbar(true);
  };
  const { user } = useAuthStore();

  // Asegúrate de no renderizar el NavBar en rutas donde el usuario no debería verlo
  const shouldRenderNavBar = user && location.pathname !== "/login" && location.pathname !== "/";

  return (
    <div>
      {shouldRenderNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginPage showSnackbar={showSnackbar} />} />
        {/* Rutas de bautizos */}
        <Route
          path="/search/bautizo"
          element={
            <ProtectedRoute>
              <SearchBautizo showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/bautizo"
          element={
            <ProtectedRoute>
              <CreateBautizo showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/bautizo"
          element={
            <ProtectedRoute>
              <EditBautizo showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Comuniones */}

        {/* Rutas de Confirmaciones */}

        {/* Rutas de Matrimonios */}
      </Routes>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
