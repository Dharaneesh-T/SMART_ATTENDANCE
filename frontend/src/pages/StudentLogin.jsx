import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config.js";

function StudentLogin() {

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API = `${BASE_URL}/api/students/login`;

  const handleSubmit = async (e) => {

    e.preventDefault();

    /* Basic Validation */

    if (!studentId || !password) {
      alert("Please enter Student ID and Password");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(API, {
        studentId: studentId.trim(),
        password: password.trim()
      });

      const data = response.data;

      /* Save data in localStorage */

      localStorage.setItem("studentId", data.student.studentId);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Login Successful ✅");

      /* Redirect to dashboard */

      navigate("/student-dashboard");

    } catch (error) {

      console.error("Login Error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please check Student ID and Password.";

      alert(message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-container">

      <form className="login-form" onSubmit={handleSubmit}>

        <h2>Student Login</h2>

        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>

  );

}

export default StudentLogin;