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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import {
//   Alert,
//   Anchor,
//   Button,
//   Container,
//   Paper,
//   PasswordInput,
//   Text,
//   TextInput,
//   Title,
// } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import { IconAlertCircle } from "@tabler/icons-react";
// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";
// export default function Login() {
//   const { signIn, signUp } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/profile";

//   const [mode, setMode] = useState("login"); // 'login' | 'register'
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");

//   const form = useForm({
//     initialValues: { email: "", password: "" },
//     validate: {
//       email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
//       password: (val) =>
//         val.length >= 6
//           ? null
//           : "Password should include at least 6 characters",
//     },
//   });

//   async function submit(e) {
//     e.preventDefault();
//     setError("");

//     const validation = form.validate();
//     if (validation.hasErrors) return;

//     setBusy(true);
//     try {
//       if (mode === "login") {
//         await signIn(form.values.email, form.values.password);
//       } else {
//         await signUp(form.values.email, form.values.password);
//       }
//       navigate(from, { replace: true });
//     } catch (err) {
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <Container size={420} my={40}>
//       <Title ta="center">
//         {mode === "login" ? "Sign in" : "Create account"}
//       </Title>

//       <Text ta="center" c="dimmed" mt={4}>
//         {mode === "login" ? (
//           <>
//             Do not have an account yet?{" "}
//             <Anchor component="button" onClick={() => setMode("register")}>
//               Create account
//             </Anchor>
//           </>
//         ) : (
//           <>
//             Already have an account?{" "}
//             <Anchor component="button" onClick={() => setMode("login")}>
//               Sign in
//             </Anchor>
//           </>
//         )}
//       </Text>

//       <Paper
//         withBorder
//         shadow="sm"
//         p={22}
//         mt={30}
//         radius="md"
//         component="form"
//         onSubmit={submit}
//       >
//         {error && (
//           <Alert
//             icon={<IconAlertCircle size="1rem" />}
//             title="Error"
//             color="red"
//             variant="light"
//             mb="md"
//           >
//             {error}
//           </Alert>
//         )}

//         <TextInput
//           label="Email"
//           placeholder="you@example.com"
//           required
//           radius="md"
//           value={form.values.email}
//           onChange={(e) => form.setFieldValue("email", e.currentTarget.value)}
//           error={form.errors.email}
//         />

//         <PasswordInput
//           label="Password"
//           placeholder="Your password"
//           required
//           mt="md"
//           radius="md"
//           value={form.values.password}
//           onChange={(e) =>
//             form.setFieldValue("password", e.currentTarget.value)
//           }
//           error={form.errors.password}
//         />

//         <Button type="submit" fullWidth mt="xl" radius="md" loading={busy}>
//           {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Register"}
//         </Button>

//         <Text ta="center" mt="md">
//           <Anchor component={Link} to="/home">
//             ← Back to Home
//           </Anchor>
//         </Text>
//       </Paper>
//     </Container>
//   );
// }
