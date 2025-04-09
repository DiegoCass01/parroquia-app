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
import EditComunion from "./pages/comuniones/EditComunion.jsx";
import SearchComunion from "./pages/comuniones/SearchComunion.jsx";
import CreateComunion from "./pages/comuniones/CreateComunion.jsx";
import SearchConfirmacion from "./pages/confirmaciones/SearchConfirmacion.jsx";
import EditConfirmacion from "./pages/confirmaciones/EditConfirmacion.jsx";
import CreateConfirmacion from "./pages/confirmaciones/CreateConfirmacion.jsx";
import CreateMatrimonio from "./pages/matrimonios/CreateMatrimonio.jsx";
import EditMatrimonio from "./pages/matrimonios/EditMatrimonio.jsx";
import SearchMatrimonio from "./pages/matrimonios/SearchMatrimonio.jsx";
import EditUser from "./pages/admin/EditUser.jsx";
import CreatePage from "./pages/CreatePage.jsx";

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
        <Route path="/create" element={<CreatePage />} />
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
        <Route
          path="/search/comunion"
          element={
            <ProtectedRoute>
              <SearchComunion showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/comunion"
          element={
            <ProtectedRoute>
              <CreateComunion showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/comunion"
          element={
            <ProtectedRoute>
              <EditComunion showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Confirmaciones */}
        <Route
          path="/search/confirmacion"
          element={
            <ProtectedRoute>
              <SearchConfirmacion showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/confirmacion"
          element={
            <ProtectedRoute>
              <CreateConfirmacion showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/confirmacion"
          element={
            <ProtectedRoute>
              <EditConfirmacion showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Matrimonios */}
        <Route
          path="/search/matrimonio"
          element={
            <ProtectedRoute>
              <SearchMatrimonio showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/matrimonio"
          element={
            <ProtectedRoute>
              <CreateMatrimonio showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/matrimonio"
          element={
            <ProtectedRoute>
              <EditMatrimonio showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/user"
          element={
            <ProtectedRoute requiredRole="admin">
              <EditUser />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
