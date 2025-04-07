import "./App.css";
import NavBar from "./components/NavBar.jsx";
import { useEffect, useState } from "react";
import { useBautizoStore } from "./store/useBautizoStore.js";
import { Route, Routes } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import SearchPage from "./pages/SearchPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import EditPage from "./pages/EditPage.jsx";
import LoginPage from "./login/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomeRedirect from "./components/HomeRedirect.jsx";

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

  // Asegúrate de no renderizar el NavBar en rutas donde el usuario no debería verlo
  const shouldRenderNavBar = location.pathname !== "/login" && location.pathname !== "/search"; // No mostrar el NavBar en login ni en la home

  return (
    <div>
      {shouldRenderNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage showSnackbar={showSnackbar} />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage showSnackbar={showSnackbar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <EditPage showSnackbar={showSnackbar} />
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
