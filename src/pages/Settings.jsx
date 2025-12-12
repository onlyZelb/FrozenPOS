import React, { useState, useEffect } from "react";
import axios from "axios";

function Settings() {
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Helper to decode JWT payload
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const [usernameFromToken, setUsernameFromToken] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("User not logged in");
      return;
    }

    const payload = parseJwt(token);
    if (!payload || !payload.sub) {
      setMessage("Invalid token");
      return;
    }

    const username = payload.sub; // assuming 'sub' contains username
    setUsernameFromToken(username);

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9090/api/users`, // get all users and filter by username
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const currentUser = response.data.find((u) => u.username === username);
        if (!currentUser) {
          setMessage("User not found");
          return;
        }

        setUser({
          username: currentUser.username,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setMessage("Failed to fetch user info");
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("User not logged in");
      return;
    }

    if (user.password && user.password !== user.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // fetch all users to find the current user's ID
      const allUsers = await axios.get(`http://localhost:9090/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentUser = allUsers.data.find((u) => u.username === usernameFromToken);
      if (!currentUser) {
        setMessage("User not found");
        return;
      }

      await axios.put(
        `http://localhost:9090/api/users/${currentUser.id}`,
        {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Account updated successfully!");
      setUser({ ...user, password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Failed to update account:", err);
      setMessage("Failed to update account");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {message && (
        <p className="mb-4 text-sm font-medium text-blue-700 bg-blue-100 p-2 rounded">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings;
