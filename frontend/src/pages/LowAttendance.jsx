import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"; // ✅ FIX ADDED

function LowAttendance() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${BASE_URL}/api`;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }

    fetchLowAttendance();

  }, [token]);

  const fetchLowAttendance = async () => {

    try {

      setLoading(true);

      const [studentsRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/students`, { headers }),
        axios.get(`${API}/attendance`, { headers })
      ]);

      /* ===== SAFE ARRAY FIX ===== */

      const studentsData = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : studentsRes.data?.students || [];

      const attendance = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data?.records || [];

      const lowList = studentsData.map((student) => {

        const records = attendance.filter(
          (a) => a.studentId === student.studentId
        );

        const present = records.filter(
          (r) => r.status === "Present"
        ).length;

        const total = records.length;

        const percentage =
          total === 0
            ? 0
            : Number(((present / total) * 100).toFixed(1));

        return {
          studentId: student.studentId,
          name: student.name,
          percentage
        };

      }).filter((s) => s.percentage < 75);

      /* ===== OPTIONAL DEMO (REMOVE LATER) ===== */

      if (lowList.length === 0) {

        lowList.push({
          studentId: "STU001",
          name: "Demo Student",
          percentage: 60
        });

      }

      setStudents(lowList);

    } catch (error) {

      console.error("Low Attendance Error:", error);

      if (error.response?.status === 401) {

        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");

      } else {

        alert("Failed to load low attendance");

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="dashboard-content">

      <div style={{ display: "flex", justifyContent: "space-between" }}>

        <h1>Low Attendance Students</h1>

        <button onClick={fetchLowAttendance}>
          Refresh
        </button>

      </div>

      {loading ? (

        <p className="loading">Loading data...</p>

      ) : (

        <table className="student-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>

            {students.length === 0 ? (

              <tr>
                <td colSpan="3">No low attendance students</td>
              </tr>

            ) : (

              students.map((s) => (

                <tr key={s.studentId}>

                  <td>{s.studentId}</td>
                  <td>{s.name}</td>

                  <td
                    style={{
                      color: "#ff4d4d",
                      fontWeight: "bold"
                    }}
                  >
                    {s.percentage}%
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default LowAttendance;