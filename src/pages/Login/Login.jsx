import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/constant";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();


  function validateFields() {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  }

  // Handle login
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      login(
        data.token,
        data.username,
        data.firstName || "",
        data.lastName || ""
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-t-2xl p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-white drop-shadow">
            Elvie Frozen Product Store
          </h1>
          <p className="text-white/90 mt-1 text-sm">
            Point of Sale & Inventory Management
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-b-2xl shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-6">
            Login to access your dashboard
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  usernameError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {usernameError && (
                <p className="text-red-600 text-sm mt-1">{usernameError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  passwordError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex justify-center items-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Create Account
            </a>
          </p>
        </div>

        <p className="text-center text-white/90 text-sm mt-4">
          © 2024 Elvie Frozen POS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
