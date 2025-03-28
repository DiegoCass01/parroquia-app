import "./App.css";
import NavBar from './components/NavBar.jsx'
import { useEffect, useState } from "react";
import { useBautismoStore } from "./store/useBautismoStore.js";
import { Route, Routes } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import SearchPage from "./pages/SearchPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import EditPage from "./pages/EditPage.jsx";


export default function App() {
  const { fetchBautismos } = useBautismoStore();

  useEffect(() => {
    fetchBautismos();
  }, [fetchBautismos]);

  // Estado para manejar la alerta
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // "success" | "error"

  // Función para mostrar el Snackbar
  const showSnackbar = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenSnackbar(true);
  };

  return (
    <div >
      <NavBar />
      <Routes>
        <Route path="/" element={<SearchPage showSnackbar={showSnackbar} />} />
        <Route path="/create" element={<CreatePage showSnackbar={showSnackbar} />} />
        <Route path="/edit" element={<EditPage showSnackbar={showSnackbar} />} />
      </Routes >

      {/* Snackbar para alertas */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
