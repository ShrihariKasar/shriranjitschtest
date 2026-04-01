import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // 🔐 NOT LOGGED IN
  if (!token) {
    return <Navigate to="/" />;
  }

  // 🔥 ADMIN ROUTE PROTECTION
  if (location.pathname.startsWith("/admin") && role !== "admin") {
    return <Navigate to="/staff/dashboard" />;
  }

  // 🔥 STAFF ROUTE PROTECTION
  if (location.pathname.startsWith("/staff") && role !== "teacher") {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
}