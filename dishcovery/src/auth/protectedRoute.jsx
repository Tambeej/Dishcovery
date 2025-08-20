import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children ?? <Outlet />;
}
