
import React, { useState } from "react";

const Login = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const e = {};
    if (!username) e.username = "Username is required";
    else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username))
      e.username = "Invalid username (3-30 chars)";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError((data && data.message) || "Login failed");
      } else {
        const data = await res.json().catch(() => ({}));
        setSuccess("Logged in successfully");
        if (typeof onSuccess === "function") onSuccess(data);
      }
    } catch (err) {
      setServerError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 420,
      margin: "40px auto",
      padding: 20,
      border: "1px solid #e6e6e6",
      borderRadius: 8,
      fontFamily: "Segoe UI, Roboto, sans-serif",
    },
    field: { display: "flex", flexDirection: "column", marginBottom: 12 },
    label: { marginBottom: 6, fontSize: 14 },
    input: {
      padding: 10,
      fontSize: 14,
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    error: { color: "#b00020", fontSize: 13, marginTop: 6 },
    btn: {
      padding: "10px 14px",
      fontSize: 15,
      borderRadius: 6,
      border: "none",
      background: "#0366d6",
      color: "#fff",
      cursor: "pointer",
    },
    smallMuted: { fontSize: 13, color: "#666", marginTop: 8 },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>

      {serverError && (
        <div style={{ ...styles.error, marginBottom: 12 }}>{serverError}</div>
      )}
      {success && (
        <div style={{ color: "green", marginBottom: 12 }}>{success}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={styles.field}>
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            autoComplete="username"
          />
          {errors.username && <div style={styles.error}>{errors.username}</div>}
        </div>

        <div style={styles.field}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />
          {errors.password && <div style={styles.error}>{errors.password}</div>}
        </div>

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div style={styles.smallMuted}>
          Need an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;

