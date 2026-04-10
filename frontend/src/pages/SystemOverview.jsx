import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config"; // ✅ FIX

function SystemOverview() {

  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    classes: 0,
    attendance: 0
  });

  const [loading, setLoading] = useState(true);

  const API = `${BASE_URL}/api`;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token → loading demo data");
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

      const students = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : studentsRes.data?.students || [];

      const attendance = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data?.records || [];

      const totalPresent = attendance.filter(
        (a) => a.status === "Present"
      ).length;

      const overall =
        attendance.length === 0
          ? 0
          : Number(((totalPresent / attendance.length) * 100).toFixed(1));

      /* SUBJECT COUNT */

      const subjects = new Set(
        attendance.map(a => a.subject)
      );

      setStats({
        students: students.length,
        faculty: 5, // demo
        subjects: subjects.size,
        classes: attendance.length,
        attendance: overall
      });

    } catch (error) {

      console.error("❌ Stats error:", error);
      loadDemo();

    } finally {

      setLoading(false);

    }

  };

  /* DEMO DATA */

  const loadDemo = () => {
    setStats({
      students: 120,
      faculty: 10,
      subjects: 6,
      classes: 200,
      attendance: 82.5
    });
  };

  return (

    <div className="dashboard-content">

      <h1>System Overview</h1>

      {loading ? (

        <p className="loading">Loading system stats...</p>

      ) : (

        <div className="dashboard-cards">

          <div className="card">
            <h3>Total Students</h3>
            <p>{stats.students}</p>
          </div>

          <div className="card">
            <h3>Total Faculty</h3>
            <p>{stats.faculty}</p>
          </div>

          <div className="card">
            <h3>Total Subjects</h3>
            <p>{stats.subjects}</p>
          </div>

          <div className="card">
            <h3>Total Classes</h3>
            <p>{stats.classes}</p>
          </div>

          <div className="card">
            <h3>Overall Attendance</h3>
            <p>{stats.attendance}%</p>
          </div>

        </div>

      )}

    </div>

  );

}

export default SystemOverview;