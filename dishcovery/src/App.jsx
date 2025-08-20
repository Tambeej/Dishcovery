import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dev from "./pages/Dev"; // ← add this

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <nav
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            borderBottom: "1px solid #eee",
          }}
        >
          <Link to="/home">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/dev">Dev</Link> {/* quick access */}
        </nav>
        <Routes>
          <Route
            path="/home"
            element={<div style={{ padding: 16 }}>Home</div>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dev" element={<Dev />} /> {/* ← mount */}
          {/* your other routes... */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
