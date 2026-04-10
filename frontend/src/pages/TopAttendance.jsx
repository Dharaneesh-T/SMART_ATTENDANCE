import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config"; // ✅ IMPORTANT FIX

function TopAttendance() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${BASE_URL}/api`;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found → using demo data");
        loadDemo();
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [studentsRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/students`, { headers }),
        axios.get(`${API}/attendance`, { headers })
      ]);

      /* SAFE ARRAY FIX */

      const studentsData = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : studentsRes.data?.students || [];

      const attendance = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data?.records || [];

      /* CALCULATE ATTENDANCE */

      const leaderboard = studentsData.map((student) => {

        const records = attendance.filter(
          (a) => a.studentId === student.studentId
        );

        const present = records.filter(
          (r) => r.status === "Present"
        ).length;

        const total = records.length;

        const percentage =
          total === 0 ? 0 : Number(((present / total) * 100).toFixed(1));

        return {
          studentId: student.studentId,
          name: student.name,
          percentage
        };

      });

      /* SORT DESC */

      leaderboard.sort((a, b) => b.percentage - a.percentage);

      if (!leaderboard || leaderboard.length === 0) {
        console.log("⚠️ No data → loading demo");
        loadDemo();
      } else {
        setStudents(leaderboard.slice(0, 5));
      }

    } catch (error) {

      console.error("❌ Leaderboard error:", error);
      loadDemo();

    } finally {

      setLoading(false);

    }

  };

  /* DEMO DATA FUNCTION */

  const loadDemo = () => {
    setStudents([
      { studentId: "STU001", name: "Arun", percentage: 95 },
      { studentId: "STU002", name: "Rahul", percentage: 90 },
      { studentId: "STU003", name: "Priya", percentage: 88 },
      { studentId: "STU004", name: "Kumar", percentage: 85 },
      { studentId: "STU005", name: "Anitha", percentage: 82 }
    ]);
  };

  return (

    <div className="dashboard-content">

      <h1>Top Attendance Students</h1>

      {loading ? (

        <p>Loading leaderboard...</p>

      ) : (

        <table className="student-table">

          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Student ID</th>
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>

            {students.map((s, index) => (

              <tr key={s.studentId}>

                <td>
                  {index === 0 ? "🥇" :
                   index === 1 ? "🥈" :
                   index === 2 ? "🥉" :
                   index + 1}
                </td>

                <td>{s.name}</td>
                <td>{s.studentId}</td>

                <td style={{ fontWeight: "bold", color: "#4caf50" }}>
                  {s.percentage}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default TopAttendance;