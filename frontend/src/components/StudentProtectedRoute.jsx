import { Navigate } from "react-router-dom";

function StudentProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/student-login" />;
  }

  return children;
}

export default StudentProtectedRoute;