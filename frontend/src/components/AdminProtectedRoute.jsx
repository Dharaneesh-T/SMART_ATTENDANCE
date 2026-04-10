import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {

  const admin = localStorage.getItem("admin");

  if (admin === "true") {
    return children;
  }

  return <Navigate to="/" />;
}

export default AdminProtectedRoute;