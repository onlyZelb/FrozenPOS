import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/constant";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Handle input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Validate fields
  function validateFields() {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(e) {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    if (!validateFields()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Registration failed");
      }

      setSuccessMsg("Account created successfully! Redirecting...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Top Title Card */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-t-2xl p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-white drop-shadow">
            Elvie Frozen Product Store
          </h1>
          <p className="text-white/90 mt-1 text-sm">Account Registration</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-b-2xl shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-800">Register</h2>
          <p className="text-gray-500 text-sm mb-6">
            Create an account to continue
          </p>

          {serverError && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {serverError}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {successMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Username */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  errors.username
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  errors.password
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  errors.role
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
              </select>
              {errors.role && (
                <p className="text-red-600 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  errors.firstName
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Last Name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                  errors.lastName
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex justify-center items-center"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>

        <p className="text-center text-white/90 text-sm mt-4">
          © 2025 Elvie Frozen POS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
