import "./App.css";
import NavBar from "./components/NavBar.jsx";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import CreatePage from "./pages/CreatePage.jsx";
import { isTokenExpired } from "./functions/parseJwt.js";
import UsuariosPage from "./pages/admin/UsuariosPage.jsx";
import EditUsuario from "./pages/admin/EditUsuario.jsx";
import CreateUsuario from "./pages/admin/CreateUsuario.jsx";

export default function App() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirección global si el token ha expirado o no existe
  useEffect(() => {
    const isTokenInvalid = !token || isTokenExpired(token);
    if (isTokenInvalid) {
      logout(); // limpia el estado de autenticación
      navigate("/login");
    }
  }, [token, logout, navigate]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenSnackbar(true);
  };



  const shouldRenderNavBar =
    user && token && !isTokenExpired(token) && location.pathname !== "/login" && location.pathname !== "/";

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
            <ProtectedRoute >
              <EditMatrimonio showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Admin */}
        <Route
          path="/search/usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsuariosPage showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/usuario"
          element={
            <ProtectedRoute>
              <CreateUsuario showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/usuario"
          element={
            <ProtectedRoute requiredRole="admin">
              <EditUsuario showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Puedes cambiar "top" y "center"
        sx={{
          zIndex: 9999,
        }} >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{
          width: "100%",
          fontSize: "1rem",
          fontWeight: 500,
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          backgroundColor:
            alertSeverity === "success"
              ? "#e8f5e9"
              : alertSeverity === "error"
                ? "#ffebee"
                : alertSeverity === "warning"
                  ? "#fff8e1"
                  : "#e3f2fd",
          color:
            alertSeverity === "success"
              ? "#2e7d32"
              : alertSeverity === "error"
                ? "#c62828"
                : alertSeverity === "warning"
                  ? "#f9a825"
                  : "#0277bd",
        }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
