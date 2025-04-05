import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function HomeRedirect() {
  const { user } = useAuthStore();
  return user ? <Navigate to="/search" /> : <Navigate to="/" />;
}
