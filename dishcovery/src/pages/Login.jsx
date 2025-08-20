import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        {mode === "login" ? "Welcome back 👋" : "Join Dishcovery 🍽️"}
      </p>

      <form onSubmit={submit}>
        <label style={{ display: "block", margin: "12px 0 4px" }}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, boxSizing: "border-box" }}
        />

        <label style={{ display: "block", margin: "12px 0 4px" }}>
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, boxSizing: "border-box" }}
        />

        {error && (
          <div style={{ color: "crimson", marginTop: 10 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            fontWeight: 600,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 16, fontSize: 14 }}>
        {mode === "login" ? (
          <>
            New here?{" "}
            <button
              onClick={() => setMode("register")}
              style={{
                background: "none",
                border: "none",
                color: "#0b5fff",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("login")}
              style={{
                background: "none",
                border: "none",
                color: "#0b5fff",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign in
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <Link to="/home">← Back to Home</Link>
      </div>
    </div>
  );
}
