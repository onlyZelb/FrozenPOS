import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-700 text-lg animate-pulse">Checking access...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-6">
        <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Not Logged In</h1>
          <p className="text-gray-700 text-lg mb-2">
            You are not logged in.
          </p>
          <p className="text-gray-600 mb-4">
            Please login with your account to access this page.
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Attempting to access protected pages without authentication is not allowed.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
}
