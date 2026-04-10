import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config"; // ✅ IMPORTANT FIX

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function DepartmentAnalytics() {

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const API = `${BASE_URL}/api`;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {

    try {

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

      const deptMap = {};

      students.forEach((student) => {

        const records = attendance.filter(
          (a) => a.studentId === student.studentId
        );

        const present = records.filter(
          (r) => r.status === "Present"
        ).length;

        const total = records.length;

        const dept = student.department || "Unknown";

        if (!deptMap[dept]) {
          deptMap[dept] = { present: 0, total: 0 };
        }

        deptMap[dept].present += present;
        deptMap[dept].total += total;

      });

      const departments = Object.keys(deptMap);

      const analytics = departments.map((d) => {

        const p = deptMap[d].present;
        const t = deptMap[d].total;

        const percent =
          t === 0 ? 0 : Number(((p / t) * 100).toFixed(1));

        return {
          department: d,
          present: p,
          total: t,
          percentage: percent
        };

      });

      if (!analytics || analytics.length === 0) {
        console.log("⚠️ No data → demo loaded");
        loadDemo();
        return;
      }

      setData(analytics);

      setChartData({
        labels: analytics.map(a => a.department),
        datasets: [
          {
            label: "Attendance %",
            data: analytics.map(a => a.percentage),
            backgroundColor: "#2196f3"
          }
        ]
      });

    } catch (error) {

      console.error("❌ Department analytics error:", error);
      loadDemo();

    }

  };

  /* DEMO DATA FUNCTION */

  const loadDemo = () => {

    const demo = [
      { department: "CS", present: 120, total: 150, percentage: 80 },
      { department: "IT", present: 100, total: 140, percentage: 71 },
      { department: "BCA", present: 130, total: 160, percentage: 81 }
    ];

    setData(demo);

    setChartData({
      labels: demo.map(d => d.department),
      datasets: [
        {
          label: "Attendance %",
          data: demo.map(d => d.percentage),
          backgroundColor: "#2196f3"
        }
      ]
    });

  };

  return (

    <div className="dashboard-content">

      <h1>Department Attendance Analytics</h1>

      {chartData && (
        <div style={{ width: "600px", marginBottom: "20px" }}>
          <Bar data={chartData} />
        </div>
      )}

      <table className="student-table">

        <thead>
          <tr>
            <th>Department</th>
            <th>Present</th>
            <th>Total Classes</th>
            <th>Attendance %</th>
          </tr>
        </thead>

        <tbody>

          {data.map((d) => (

            <tr key={d.department}>
              <td>{d.department}</td>
              <td>{d.present}</td>
              <td>{d.total}</td>
              <td>{d.percentage}%</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default DepartmentAnalytics;