import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config"; // ✅ IMPORTANT FIX

function TodayAttendance() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${BASE_URL}/api/attendance`;

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {

    try {

      setLoading(true);

      const res = await axios.get(API);

      // ✅ SAFE DATA HANDLING
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.records || [];

      // ✅ DATE FIX (handles ISO format)
      const todayRecords = data.filter((r) =>
        r.date && r.date.startsWith(today)
      );

      setRecords(todayRecords);

    } catch (error) {

      console.error("Error loading attendance:", error);
      alert("Failed to load attendance");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="dashboard-content">

      <h1>Today's Attendance</h1>

      <p>Date: {today}</p>

      {loading ? (

        <p className="loading">Loading attendance...</p>

      ) : (

        <table className="student-table">

          <thead>
            <tr>
              <th>Student ID</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {records.length === 0 ? (

              <tr>
                <td colSpan="3">No attendance records</td>
              </tr>

            ) : (

              records.map((r) => (
                <tr key={r._id}>
                  <td>{r.studentId}</td>
                  <td>{r.subject || "General"}</td>
                  <td
                    style={{
                      color: r.status === "Present" ? "#4caf50" : "#ff4d4d",
                      fontWeight: "bold"
                    }}
                  >
                    {r.status}
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

export default TodayAttendance;