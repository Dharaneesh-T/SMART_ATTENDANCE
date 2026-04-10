import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config.js";

function Login() {

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin123@gmail.com"); // Pre-filled default admin email
  const [studentId, setStudentId] = useState("STU001"); // Pre-filled default student ID
  const [password, setPassword] = useState("1234"); // Pre-filled default password
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ✅ Validation */
    if (
      (role === "admin" && !email.trim()) ||
      (role === "student" && !studentId.trim()) ||
      !password.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      /* ✅ FIXED API */
      const API =
        role === "admin"
          ? `${BASE_URL}/api/admin/login`
          : `${BASE_URL}/api/students/login`; // ✅ FIXED HERE

      /* Clear old session */
      localStorage.removeItem("admin");
      localStorage.removeItem("token");

      /* ✅ Dynamic payload */
      const payload =
        role === "admin"
          ? {
              email: email.trim(),
              password: password.trim()
            }
          : {
              studentId: studentId.trim(),
              password: password.trim()
            };

      const response = await axios.post(API, payload);
      const data = response.data;

      if (!data || !data.token) {
        alert(data.message || "Login failed");
        return;
      }

      /* Save session */
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      alert("Login successful ✅");

      /* Redirect */
      if (role === "admin") {
        localStorage.setItem("admin", "true");
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message ||
        "Server not reachable. Please check backend.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-container">

      <form className="login-form" onSubmit={handleSubmit}>

        {/* 🔥 Toggle */}
        <div className={`toggle-tabs ${role === "student" ? "student" : ""}`}>
          
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>

          <button
            type="button"
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>

        </div>

        <h2>
          {role === "admin" ? "Admin Login" : "Student Login"}
        </h2>

        {/* ✅ Admin Email */}
        {role === "admin" && (
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
        )}

        {/* ✅ Student ID */}
        {role === "student" && (
          <div className="input-group">
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <label>Student ID</label>
          </div>
        )}

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        {/* Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}

export default Login;