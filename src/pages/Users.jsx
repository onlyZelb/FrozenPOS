import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { API_URL } from "../config/constant";

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [token]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">First Name</th>
            <th className="py-2 px-4">Last Name</th>
            <th className="py-2 px-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.user_id} className="border-b">
                <td className="py-2 px-4">{u.user_id}</td>
                <td className="py-2 px-4">{u.username}</td>
                <td className="py-2 px-4">{u.first_name}</td>
                <td className="py-2 px-4">{u.last_name}</td>
                <td className="py-2 px-4">{u.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
